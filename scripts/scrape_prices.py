#!/usr/bin/env python3
"""
AutoGestión - Market Price Scraper
Scrape real-time vehicle prices from market portals
and feed them to Supabase for the Valuador algorithm.
"""

import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Any
import asyncio

import pandas as pd
import aiohttp
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


class VehicleScraper:
    """Scrape vehicle prices from market portals."""
    
    def __init__(self):
        self.session = None
        self.prices: List[Dict[str, Any]] = []
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def scrape_mercadolibre(self) -> List[Dict[str, Any]]:
        """Scrape prices from Mercado Libre Argentina."""
        try:
            # Example URL - adjust based on actual ML structure
            url = "https://autos.mercadolibre.com.ar/autos"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            
            async with self.session.get(url, headers=headers, timeout=10) as resp:
                if resp.status != 200:
                    logger.error(f"ML Status: {resp.status}")
                    return []
                
                html = await resp.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract listings (selector may change - monitor regularly)
                listings = []
                for item in soup.find_all('div', class_='poly-card'):
                    try:
                        marca_modelo = item.find('h2')?.text or ""
                        precio_text = item.find('span', class_='price')?.text or "0"
                        precio = self._extract_price(precio_text)
                        
                        # Parse marca/modelo
                        parts = marca_modelo.split()
                        marca = parts[0] if parts else ""
                        modelo = parts[1] if len(parts) > 1 else ""
                        
                        listings.append({
                            "source": "mercado_libre",
                            "marca": marca,
                            "modelo": modelo,
                            "precio_usd": precio,
                            "fecha": datetime.now().isoformat()
                        })
                    except Exception as e:
                        logger.debug(f"Error parsing ML item: {e}")
                        continue
                
                logger.info(f"Scraped {len(listings)} listings from Mercado Libre")
                return listings
        
        except asyncio.TimeoutError:
            logger.error("ML scrape timeout")
            return []
        except Exception as e:
            logger.error(f"ML scrape error: {e}")
            return []
    
    async def scrape_autocosmos(self) -> List[Dict[str, Any]]:
        """Scrape prices from Autocosmos Argentina."""
        try:
            url = "https://www.autocosmos.com.ar/usados"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            
            async with self.session.get(url, headers=headers, timeout=10) as resp:
                if resp.status != 200:
                    logger.error(f"Autocosmos Status: {resp.status}")
                    return []
                
                html = await resp.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                listings = []
                # Adjust selectors based on actual Autocosmos HTML
                for item in soup.find_all('div', class_='result-item'):
                    try:
                        titulo = item.find('h3')?.text or ""
                        precio_text = item.find('span', class_='price')?.text or "0"
                        precio = self._extract_price(precio_text)
                        
                        parts = titulo.split()
                        marca = parts[0] if parts else ""
                        modelo = parts[1] if len(parts) > 1 else ""
                        
                        listings.append({
                            "source": "autocosmos",
                            "marca": marca,
                            "modelo": modelo,
                            "precio_usd": precio,
                            "fecha": datetime.now().isoformat()
                        })
                    except Exception as e:
                        logger.debug(f"Error parsing Autocosmos item: {e}")
                        continue
                
                logger.info(f"Scraped {len(listings)} listings from Autocosmos")
                return listings
        
        except asyncio.TimeoutError:
            logger.error("Autocosmos scrape timeout")
            return []
        except Exception as e:
            logger.error(f"Autocosmos scrape error: {e}")
            return []
    
    @staticmethod
    def _extract_price(price_text: str) -> float:
        """Extract numeric price from text."""
        import re
        numbers = re.findall(r'\d+', price_text.replace('.', '').replace(',', ''))
        return float(''.join(numbers)) if numbers else 0.0
    
    async def scrape_all(self) -> List[Dict[str, Any]]:
        """Scrape all sources concurrently."""
        ml_data = await self.scrape_mercadolibre()
        ac_data = await self.scrape_autocosmos()
        return ml_data + ac_data


class PriceProcessor:
    """Process and aggregate scraped prices."""
    
    @staticmethod
    def aggregate_by_marca_modelo(prices: List[Dict[str, Any]]) -> pd.DataFrame:
        """Aggregate prices by brand and model."""
        df = pd.DataFrame(prices)
        
        if df.empty:
            return pd.DataFrame()
        
        # Group and calculate statistics
        agg = df.groupby(['marca', 'modelo']).agg({
            'precio_usd': ['min', 'max', 'mean', 'count']
        }).reset_index()
        
        agg.columns = ['marca', 'modelo', 'precio_min', 'precio_max', 'precio_promedio', 'cantidad']
        return agg
    
    @staticmethod
    def estimate_km_bucket(precio: float) -> str:
        """Estimate km bucket based on price depreciation patterns."""
        # Heuristic: lower price → higher km
        if precio > 25000:
            return "0-10000"
        elif precio > 18000:
            return "10001-30000"
        elif precio > 12000:
            return "30001-60000"
        elif precio > 8000:
            return "60001-90000"
        else:
            return "120001+"


class SupabaseSyncer:
    """Sync processed prices to Supabase."""
    
    @staticmethod
    def sync_prices(df: pd.DataFrame, year: int = 2025) -> bool:
        """Insert aggregated prices into precios_mercado table."""
        try:
            records = []
            for _, row in df.iterrows():
                record = {
                    "marca": row['marca'],
                    "modelo": row['modelo'],
                    "anio_desde": year,
                    "anio_hasta": year,
                    "km_desde": 0,
                    "km_hasta": 150000,
                    "precio_min_usd": int(row['precio_min']),
                    "precio_max_usd": int(row['precio_max']),
                    "fuente": "scraped_market_data",
                    "actualizado_at": datetime.now().isoformat(),
                    "confianza": min(row['cantidad'] / 10, 1.0),  # Confidence based on sample size
                }
                records.append(record)
            
            # Upsert into Supabase
            response = supabase.table("precios_mercado").upsert(
                records,
                on_conflict="marca,modelo,anio_desde,km_desde"
            ).execute()
            
            logger.info(f"Synced {len(records)} price records to Supabase")
            return True
        
        except Exception as e:
            logger.error(f"Supabase sync error: {e}")
            return False


async def main():
    """Main execution."""
    logger.info("Starting AutoGestión Price Scraper")
    
    try:
        async with VehicleScraper() as scraper:
            # Scrape data
            prices = await scraper.scrape_all()
            
            if not prices:
                logger.warning("No prices scraped")
                return
            
            # Process data
            processor = PriceProcessor()
            df_agg = processor.aggregate_by_marca_modelo(prices)
            
            logger.info(f"Aggregated {len(df_agg)} marca/modelo combinations")
            
            # Sync to Supabase
            syncer = SupabaseSyncer()
            success = syncer.sync_prices(df_agg)
            
            if success:
                logger.info("✅ Price update completed successfully")
            else:
                logger.error("❌ Price update failed")
    
    except Exception as e:
        logger.error(f"Fatal error: {e}")


if __name__ == "__main__":
    asyncio.run(main())
