'use client'

import { useState } from 'react'

export default function ValuadorPage() {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    km: ''
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/valuador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marca: formData.marca,
          modelo: formData.modelo,
          anio: parseInt(formData.anio),
          km: parseInt(formData.km.split(' ')[0]) // tomar el primer número
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Error al calcular precio' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Roboto, sans-serif' }}>
      <h1>Valuador Inteligente</h1>
      <p>Ingresá los datos de tu vehículo y obtené un rango de precio de mercado actualizado.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label>Marca</label>
          <select
            value={formData.marca}
            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
            required
          >
            <option value="">Seleccionar</option>
            <option value="Toyota">Toyota</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Ford">Ford</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="Renault">Renault</option>
            <option value="Peugeot">Peugeot</option>
            <option value="Honda">Honda</option>
            <option value="Fiat">Fiat</option>
            <option value="Nissan">Nissan</option>
            <option value="Jeep">Jeep</option>
          </select>
        </div>

        <div>
          <label>Modelo</label>
          <input
            type="text"
            placeholder="Corolla, Gol, Tracker..."
            value={formData.modelo}
            onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Año</label>
          <select
            value={formData.anio}
            onChange={(e) => setFormData({ ...formData, anio: e.target.value })}
            required
          >
            <option value="">Seleccionar</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
            <option value="2013">2013</option>
          </select>
        </div>

        <div>
          <label>Kilometraje</label>
          <select
            value={formData.km}
            onChange={(e) => setFormData({ ...formData, km: e.target.value })}
            required
          >
            <option value="">Seleccionar</option>
            <option value="0">0 — 10.000 km</option>
            <option value="10">10.001 — 30.000 km</option>
            <option value="30">30.001 — 60.000 km</option>
            <option value="60">60.001 — 90.000 km</option>
            <option value="90">90.001 — 120.000 km</option>
            <option value="120">Más de 120.000 km</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular precio de mercado →'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <>
              <p>Rango estimado: {result.rango}</p>
              <p>Fecha: {result.fecha}</p>
              <p>{result.meta}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}