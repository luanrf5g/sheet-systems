import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../App";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { api, Sheet } from "../api/api";
import { io } from "socket.io-client";

type ListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'List'>;

const SOCKET_URL = "http://192.168.1.105:3333";

export function ListSheets() {
  const navigation = useNavigation<ListScreenNavigationProp>();
  const isFocused = useIsFocused(); // Hook para saber se a tela está ativa (recarrega ao voltar)
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSheets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Sheet[]>('/sheets');
      setSheets(response.data);
    } catch (e) {
      setError('Erro ao carregar chapas. Verifique a conexão com o backend.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Conectado ao Servidor WebSocket!');
    })

    socket.on('AddedPlate', (newSheet: Sheet) => {
      console.log('Nova chapa recebida via WebSocket: ', newSheet.code);

      setSheets(prevSheets => [newSheet, ...prevSheets])
    })

    socket.on('UpdatedPlate', (updatedSheet: Sheet) => {
      console.log('Chapa atualizada via WebSocket: ', updatedSheet.code);

      setSheets(prevSheets =>
        prevSheets.map(sheet => sheet.id === updatedSheet.id ? updatedSheet : sheet)
      )
    })

    return () => {
      socket.disconnect();
    }
  }, [])

  // Recarrega a lista toda vez que a tela for focada (útil após criar/editar)
  useEffect(() => {
    if (isFocused) {
      fetchSheets();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando estoque...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchSheets} />
      </View>
    );
  }

  // Componente de item da lista
  const renderItem = ({ item }: { item: Sheet }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Detail', { id: item.id })} // Navega para Detalhe
    >
      <Text style={styles.itemTitle}>{item.material} - {item.thickness}mm</Text>
      <Text>Dimensões ( mm ): {item.length}x{item.width}</Text>
      <Text>Localização: {item.location || 'N/A'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sheets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma chapa em estoque. Cadastre uma!</Text>}
      />

      {/* Botões de Ação */}
      <View style={styles.buttonContainer}>
        <Button
          title="NOVA CHAPA"
          onPress={() => navigation.navigate('Create')}
        />
        {/* <View style={{ width: 10 }} /> */}
        {/* <Button
          title="SCAN QR"
          onPress={() => navigation.navigate('Scanner')}
          color="#2a78f0"
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  buttonContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
});