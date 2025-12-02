'use client'
import { Poppins } from "next/font/google"
import { api, Profile, Sheet } from "@/src/lib/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
})

type DashboardList = Array<Sheet | Profile>

const SOCKET_URL = 'http://192.168.3.213:3333'

async function getList() {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar chapas no backend:', error);
    return [];
  }
}

async function searchAll(value: string) {
  try {
    const response = await api.get(`/search/${value}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar chapas no backend:', error);
    return [];
  }
}

function codeAsShort(code: string) {
  const start = code.slice(0, 2);
  const end = code.slice(-4);

  return `${start}-${end}`;
}

export default function Dashboard() {
  const [list, setList] = useState<DashboardList>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchSheets() {
      const response = await getList();
      setList(response);
    }
    fetchSheets();
  }, [])

  useEffect((): void => {
    async function reFetchSheets() {
      if(search.trim() === '') {
        const response = await getList();
        setList(response);
        return;
      }
      const response = await searchAll(search);
      setList(response);
    }
    reFetchSheets();
  }, [search])

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Conectado ao Servidor WebSocket!');
    })

    socket.on('AddedPlate', (newItem: Sheet) => {
      console.log('Chapa adicionada via WebSocket: ', newItem.code);

      setList(prevList => [...prevList, newItem])
    })

    socket.on('UpdatedPlate', (updatedItem: Sheet) => {
      console.log('Chapa atualizada via WebSocket: ', updatedItem.code)

      setList(prevList =>
        prevList.map(
          item => item.id === updatedItem.id ? updatedItem : item
        )
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <main
      className="full-screen-page overflow-hidden"
      style={{
        backgroundColor: '#f0f0f0',
        color: '#242424',
        padding: 32,
        height: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: 64,
          marginBottom: 32
        }}
      >
        <span style={{fontSize: 48, fontWeight: 'bold'}}>Metalizze</span>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              backgroundColor: "#fff",
              padding: '16px 12px',
              fontSize: 16,
              width: 350,
              borderRadius: 8,
              border: 'none',
              outline: 'none',
              boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.25)',
            }}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          width: '100%',
          height: 'calc(100% - 128px)',
          boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.25)',
          padding: '16px 24px',
          display: 'block',
          position: 'relative',
          borderCollapse: 'collapse',
          scrollbarWidth: 'none'
        }}
      >
        <div style={{
          display:'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}>
          <span style={{fontWeight: 'bold', fontSize: 32}}>
            Estoque
          </span>

          <a
            style={{
              backgroundColor: '#242424',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: '8px 16px',
              textDecoration: 'none',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center'
            }}
            href="/sheets/create"
          >
            Registrar Entrada
          </a>
        </div>

        <div className="overflow-x-auto"
          style={{
            maxHeight: 'calc(100% - 64px)',
            position: 'sticky',
            backgroundColor: '#fff'
          }}
        >
          <table className="min-w-full table-fixed divide-y shadow-md rounded-lg">
            <thead style={{
              backgroundColor: '#f0f0f0',
              fontFamily: poppins.style.fontFamily,
              position: 'sticky',
              zIndex: 10,
              top: 0,
            }}>
              <tr className="text-center position-sticky top-0">
                <th className="py-2 px-4">Material</th>
                <th className="py-2 px-4">Código</th>
                <th className="py-2 px-4">Espessura (mm)</th>
                <th className="py-2 px-4">Comprimento (mm)</th>
                <th className="py-2 px-4">Largura (mm)</th>
                <th className="py-2 px-4">Localização</th>
                <th className="py-2 px-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((item: Sheet | Profile) => (
                <tr key={item.code}
                  className={"hover:bg-gray-100 transition duration-150 text-black text-center"}
                  style={{fontSize: 16, height: 64, borderBottom: '2px solid #ddd', width: 100}}
                >
                  <td className="py-2 px-4">{item.material}</td>
                  <td className="py-2 px-4">{codeAsShort(item.code)}</td>
                  <td className="py-2 px-4">{item.thickness}</td>
                  <td className="py-2 px-4">{item.length}</td>
                  <td className="py-2 px-4">{item.width}</td>
                  <td className="py-2 px-4">{item.location || 'N/A'}</td>
                  <td className="py-2 px-4">
                    <a href={`item/${item.code}`} className="text-blue-500 hover:text-blue-700">Ver Detalhes</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}