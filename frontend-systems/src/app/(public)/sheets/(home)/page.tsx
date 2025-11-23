// frontend-chapas/src/app/chapas/page.tsx
import { api, Sheet } from "@/src/lib/api";

// Esta função será executada no SERVIDOR (Next.js)
async function getSheets() {
  try {
    const response = await api.get<Sheet[]>('/sheets');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar chapas no backend:', error);
    return [];
  }
}

export default async function Home() {
  const sheets: Sheet[] = await getSheets();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Estoque de Chapas (Web)</h1>
      <p className="text-gray-600 mb-4">Conectado ao backend em: {process.env.NEXT_PUBLIC_API_URL}</p>

      <div className="flex justify-between mb-4">
        <p className="text-xl">Total de Chapas: {sheets.length}</p>
        <a
            href="/sheets/create"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
            Nova Chapa
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr className="text-black">
              <th className="py-2 px-4 border-b">Material</th>
              <th className="py-2 px-4 border-b">Espessura (mm)</th>
              <th className="py-2 px-4 border-b">Comprimento (mm)</th>
              <th className="py-2 px-4 border-b">Largura (mm)</th>
              <th className="py-2 px-4 border-b">Localização</th>
              <th className="py-2 px-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sheets.map((sheet: Sheet) => (
              <tr key={sheet.id} className="hover:bg-gray-100 transition duration-150 text-black">
                <td className="py-2 px-4 border-b">{sheet.material}</td>
                <td className="py-2 px-4 border-b">{sheet.thickness}</td>
                <td className="py-2 px-4 border-b">{sheet.length}</td>
                <td className="py-2 px-4 border-b">{sheet.width}</td>
                <td className="py-2 px-4 border-b">{sheet.location || 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  <a href={`/sheets/${sheet.id}`} className="text-blue-500 hover:text-blue-700">Ver Detalhes</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}