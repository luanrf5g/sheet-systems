import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { api, Sheet } from "../api/api";

type CreateScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Create'>;

export function CreateSheet() { // Use 'export function' para exportação nomeada
  const navigation = useNavigation<CreateScreenNavigationProp>();
  const [material, setMaterial] = useState('');
  const [thickness, setThickness] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [location, setLocation] = useState('');
  // Peso é opcional, deixaremos sem input por enquanto

  const handleCreate = async () => {
    try {
      const cleanNumericInput = (input: string) => {
        const cleaned = input.replace(',', '.');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
      }

      const cleanStringInput = (input: string, separator = ' ') => {
        const trimmed = input.trim();

        return trimmed
          .split(separator)
          .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(separator);
      }

      // 1. Validação básica de números (para evitar NaN no backend)
      const data = {
        material: cleanStringInput(material),
        thickness: cleanNumericInput(thickness),
        width: cleanNumericInput(width),
        length: cleanNumericInput(length),
        location: cleanStringInput(location),
      };

      // 2. Chama a API
      const response = await api.post<Sheet>('/sheets', data);

      Alert.alert(
        'Sucesso!',
        `Chapa ${response.data.code} criada com ID: ${response.data.id}`
      );

      // 3. Volta para a lista ou para a tela de detalhes
      navigation.goBack();

    } catch (error: any) {
      // O ValidationPipe do NestJS retorna os erros no response.data.message
      const errorMessage = error.response?.data?.message
        ? error.response.data.message.join('\n')
        : 'Erro desconhecido ao cadastrar chapa.';

      Alert.alert('Erro ao Cadastrar', errorMessage);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Material</Text>
      <TextInput style={styles.input} value={material} onChangeText={setMaterial} placeholder="Ex: Aço Carbono" />

      <Text style={styles.label}>Espessura (mm)</Text>
      <TextInput
        style={styles.input}
        value={thickness}
        onChangeText={setThickness}
        keyboardType="numeric"
        placeholder="5.5"
      />

      <Text style={styles.label}>Largura (mm)</Text>
      <TextInput
        style={styles.input}
        value={width}
        onChangeText={setWidth}
        keyboardType="numeric"
        placeholder="1000"
      />

      <Text style={styles.label}>Comprimento (mm)</Text>
      <TextInput
        style={styles.input}
        value={length}
        onChangeText={setLength}
        keyboardType="numeric"
        placeholder="2000"
      />

      <Text style={styles.label}>Localização (Opcional)</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ex: Corredor A-2"
      />

      <Button title="CADASTRAR CHAPA" onPress={handleCreate} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});