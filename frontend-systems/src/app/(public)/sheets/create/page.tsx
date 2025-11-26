// frontend-chapas/src/app/chapas/nova/page.tsx
'use client'; // Componente que usa state e eventos precisa ser um Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/src/lib/api'

// Tipagem para o formulário (UpdateChapaDto no backend)
interface CreateSheetPayload {
  material: string;
  thickness: string; // Usamos string aqui para o input, e convertemos antes de enviar
  width: string;
  length: string;
  location: string;
}

export default function CreateSheet() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateSheetPayload>({
    material: '',
    thickness: '',
    width: '',
    length: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para limpar e converter a entrada numérica (Tratamento de Vírgula/Ponto)
  const cleanNumericInput = (value: string): number => {
    const cleaned = value.replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num; // Se for inválido, envia 0
  };

  // Handler genérico para atualização do estado
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Converte os campos numéricos para float antes de enviar
    const payload = {
      material: formData.material,
      thickness: cleanNumericInput(formData.thickness),
      width: cleanNumericInput(formData.width),
      length: cleanNumericInput(formData.length),
      location: formData.location || null, // Se vazio, envia null
    };

    console.log(payload)

    try {
      await api.post('/sheets', payload);
      alert('Chapa cadastrada com sucesso!');
      router.push('/'); // Volta para a lista
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao cadastrar chapa.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-semibold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar à Lista Principal
      </Link>

      <h1 className="text-3xl font-bold mb-6">Cadastrar Nova Chapa</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Erro de Validação:</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-lg">

        {/* Material */}
        <div className="mb-4">
          <label htmlFor="material" className="block text-gray-700 font-bold mb-2">Material</label>
          <input
            type="text"
            id="material"
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Espessura */}
        <div className="mb-4">
          <label htmlFor="thickness" className="block text-gray-700 font-bold mb-2">Espessura (mm)</label>
          <input
            type="text"
            id="thickness"
            name="thickness"
            value={formData.thickness}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Use vírgula para decimal, ex: 1,5"
            required
          />
        </div>

        {/* Largura */}
        <div className="mb-4">
          <label htmlFor="width" className="block text-gray-700 font-bold mb-2">Largura (mm)</label>
          <input
            type="text"
            id="width"
            name="width"
            value={formData.width}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: 1000"
            required
          />
        </div>

        {/* Comprimento */}
        <div className="mb-4">
          <label htmlFor="length" className="block text-gray-700 font-bold mb-2">Comprimento (mm)</label>
          <input
            type="text"
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: 2000"
            required
          />
        </div>

        {/* Localização */}
        <div className="mb-6">
          <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Localização (Opcional)</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: Armazém B1"
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'CADASTRAR CHAPA'}
        </button>
      </form>
    </div>
  );
}