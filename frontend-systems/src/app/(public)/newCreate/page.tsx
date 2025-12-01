"use client"

import { api } from '@/src/lib/api'
import Link from 'next/link'
import { useState } from 'react'

export default function SheetCreatePage() {
  const [type, setType] = useState<'chapa' | 'perfil'>('chapa')

  const [formData, setFormData] = useState({
    material: '',
    thickness: '',
    length: '',
    width: '',
    location: '',
    // perfil specific
    height: '',
    profileType: 'ROUND',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const cleanNumericInput = (value: string): number => {
    const cleaned = value.replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num; // Se for inválido, envia 0
  };

  function update<K extends keyof typeof formData>(key: K, value: typeof formData[K]) {
    setFormData((s) => ({ ...s, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const payload: Record<string, any> = {
      material: formData.material,
      thickness: cleanNumericInput(formData.thickness),
      length: cleanNumericInput(formData.length),
      width: cleanNumericInput(formData.width),
      location: formData.location,
    }

    try {
      let endpoint = '/sheets'

      if (type === 'perfil') {
        endpoint = '/profiles'
        payload.height = cleanNumericInput(formData.height)
        payload.profileType = formData.profileType
      }

      console.log('Payload to submit:', payload)
      console.log('Endpoint:', endpoint)

      await api.post(endpoint, payload)

      setSuccess('Registro criado com sucesso')
      // optionally clear form
      setFormData({ material: '', thickness: '', length: '', width: '', location: '', height: '', profileType: 'Redondo' })
    } catch (err: any) {
      setError(err?.message ?? 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="absolute left-6 top-6">
        <Link href="/dashboard" className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white shadow-md text-sm text-gray-700 hover:shadow-lg transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Voltar ao Dashboard</span>
        </Link>
      </div>

      <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-center text-2xl font-bold mb-6 italic">Novo registro de entrada</h2>

        {/* type selector */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setType('chapa')}
            className={`px-4 py-2 rounded-full transition-colors text-sm ${type === 'chapa' ? 'bg-black text-white font-medium' : 'bg-gray-100 text-gray-600'}`}
          >
            Cadastro de chapa
          </button>

          <button
            onClick={() => setType('perfil')}
            className={`px-4 py-2 rounded-full transition-colors text-sm ${type === 'perfil' ? 'bg-black text-white font-medium' : 'bg-gray-100 text-gray-600'}`}
          >
            Cadastro de perfil de aço
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">Material</span>
              <input
                value={formData.material}
                onChange={(e) => update('material', e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                placeholder="Aço Carbono"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">Espessura</span>
              <input
                value={formData.thickness}
                onChange={(e) => update('thickness', e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                placeholder="Ex.: 1.5"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">Comprimento</span>
              <input
                value={formData.length}
                onChange={(e) => update('length', e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                placeholder="2000"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-700">
              <span className="font-medium">Largura</span>
              <input
                value={formData.width}
                onChange={(e) => update('width', e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                placeholder="1000"
              />
            </label>
          </div>

          {/* Fields only for perfil */}
          {type === 'perfil' && (
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-sm text-gray-700">
                <span className="font-medium">Altura</span>
                <input
                  value={formData.height}
                  onChange={(e) => update('height', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  placeholder="Altura do perfil"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-gray-700">
                <span className="font-medium">Tipo de perfil</span>
                <select
                  value={formData.profileType}
                  onChange={(e) => update('profileType', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  <option>ROUND</option>
                  <option>SQUARE</option>
                  <option>RECTANGULAR</option>
                </select>
              </label>
            </div>
          )}

          <label className="flex flex-col gap-2 text-sm text-gray-700">
            <span className="font-medium">Localização</span>
            <input
              value={formData.location}
              onChange={(e) => update('location', e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
              placeholder="Andar B1"
            />
          </label>

          <div className="flex items-center justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-neutral-900 text-white font-medium shadow disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Registrar'}
            </button>
          </div>

          {(error || success) && (
            <div className="mt-4 text-center text-sm">
              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
