'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { api, Sheet } from '@/src/lib/api';
import { formatUUIDAsShort } from '@/src/utils/formatUUID';

// Interface que inclui o Histórico (garanta que essa interface esteja no src/lib/api.ts)
interface SheetWithHistory extends Sheet {
    sheetHistories: {
        id: number;
        alteredField: string;
        oldValue: string | null;
        newValue: string | null;
        updateDate: string;
    }[];
}

interface PageProps {
  params: {
    id: string; // O ID virá como string da URL
  }
}

export default function Detail() {
  const params = useParams() as PageProps["params"];
  const router = useRouter();

  const sheetId = params.id;
  const [sheet, setSheet] = useState<SheetWithHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<Partial<Sheet>>({}); // Rastreia APENAS as alterações
  const [isEditing, setIsEditing] = useState(false);

  if(!sheetId) {
    return <div className="container mx-auto p-8 text-center"><p>ID da chapa não fornecido.</p></div>;
  }

  // Função para limpar e converter a entrada numérica
  const cleanNumericInput = (value: string): number => {
    const cleaned = value.replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const fetchSheet = async () => {
    setLoading(true);
    try {
      // O backend já está configurado para retornar o histórico no findOne
      const response = await api.get<SheetWithHistory>(`/sheets/${sheetId}`);
      setSheet(response.data);
      setUpdates({}); // Reseta updates ao carregar
    } catch (e) {
      alert('Chapa não encontrada ou erro ao carregar.');
      router.push('/sheets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sheetId) {
      fetchSheet();
    }
  }, [sheetId]);

  // Handler para rastrear as mudanças APENAS nos campos editáveis
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Tratamento para valores vazios e numéricos
    let finalValue: string | number | null = value;

    if (name === 'width' || name === 'length' || name === 'thickness') {
      finalValue = cleanNumericInput(value);
      if (value === '') finalValue = null;
    } else if (value === '') {
      finalValue = null;
    }

    setUpdates(prev => ({ ...prev, [name]: finalValue }));
  };

  // 1. Função de Edição (PATCH)
  const handleUpdate = async () => {
    if (Object.keys(updates).length === 0) {
      alert('Nenhuma alteração detectada.');
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/sheets/${sheetId}`, updates);
      alert('Chapa atualizada com sucesso!');
      setIsEditing(false); // Sai do modo de edição
      fetchSheet(); // Recarrega os dados e o histórico
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Erro ao atualizar chapa.';
      alert(`Erro: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Função de Exclusão (DELETE)
  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja EXCLUIR a chapa ${sheet?.code}?`)) {
      return;
    }

    try {
      await api.delete(`/sheets/${sheetId}`);
      alert('Chapa excluída com sucesso.');
      router.push('/dashboard');
    } catch (e) {
      alert('Erro ao excluir chapa.');
    }
  };

  if (loading || !sheet) {
    return <div className="container mx-auto p-8 text-center"><p>{loading ? 'Carregando...' : 'Chapa não encontrada.'}</p></div>;
  }

  // Função auxiliar para obter o valor atualizado (se estiver em updates)
  const getDisplayValue = (field: keyof Sheet) => {
    const value = updates[field] !== undefined ? updates[field] : sheet[field];
    return value === null || undefined ? 'N/A' : value.toString().replace('.', ',');
  };

  const translate = (field: string ) => {
    if(field === 'width') {
      return 'Largura'
    }

    if(field === 'length') {
      return 'Comprimento'
    }

    if(field === 'location') {
      return 'Localização'
    }

    return 'Material'
  }

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

      <h1 className="text-3xl font-bold mb-2">Detalhes da Chapa: {formatUUIDAsShort(sheet.code)}</h1>
      <p className='text-gray=600 mb-6'>Criação: {new Date(sheet.createdAt).toLocaleString()}</p>
      <p className="text-gray-600 mb-6">Última atualização: {new Date(sheet.updatedAt).toLocaleString()}</p>

      {/* Botões de Ação */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded ${isEditing ? 'bg-yellow-700' : ''}`}
          disabled={loading}
        >
          {isEditing ? 'Cancelar Edição' : 'Editar Chapa'}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Excluir Chapa
        </button>
      </div>

      <div className="flex flex-wrap -mx-4">
        {/* Coluna de Detalhes e Edição */}
        <div className="w-full lg:w-1/2 px-4 mb-8">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{isEditing ? 'Formulário de Edição' : 'Dados Atuais'}</h2>

          <div className="space-y-4">
            {/* Campo Material */}
            <div>
              <label className="block text-sm font-medium text-white">Material</label>
              <input
                type="text"
                name="material"
                value={getDisplayValue('material')}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border text-black p-2 rounded ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
              />
            </div>

            {/* Campo Largura */}
            <div>
              <label className="block text-sm font-medium text-white">Largura (mm)</label>
              <input
                type="text"
                name="width"
                value={getDisplayValue('width')}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border text-black p-2 rounded ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
              />
            </div>

            {/* Campo Comprimento */}
            <div>
              <label className="block text-sm font-medium text-white">Comprimento (mm)</label>
              <input
                type="text"
                name="length"
                value={getDisplayValue('length')}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border text-black p-2 rounded ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
              />
            </div>

            {/* Campo Localização */}
            <div>
              <label className="block text-sm font-medium text-white">Localização</label>
              <input
                type="text"
                name="location"
                value={getDisplayValue('location')}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border text-black p-2 rounded ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
              />
            </div>

            {isEditing && (
              <button
                onClick={handleUpdate}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded mt-4"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            )}
          </div>
        </div>

        {/* Coluna de Histórico */}
        <div className="w-full lg:w-1/2 px-4">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Histórico de Alterações</h2>
          <div className="bg-white shadow-md rounded-lg p-4 max-h-96 overflow-y-auto">
            {sheet.sheetHistories.length > 0 ? (
              sheet.sheetHistories.map((item) => (
                <div key={item.id} className="border-l-4 border-green-500 bg-gray-50 p-3 mb-3 rounded">
                  <p className="text-xs text-gray-500">{new Date(item.updateDate).toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-gray-800">
                    O campo <b><i>{translate(item.alteredField)}</i></b> foi alterado de <b>{item.oldValue}</b> para <b>{item.newValue}</b>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Nenhuma alteração registrada além da criação.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}