import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../App";
import { api, Sheet, SheetHistory } from "../api/api";

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

type NumericFields = 'thickness' | 'width' | 'length' | 'weight';

export function DetailSheet() {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const { id } = route.params; // Captura o ID passado pela rota

  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<{ [key: string]: any }>({}); // Objeto vazio para começar

  // Estados para edição (usaremos apenas material e localização para simplificar)
  // const [material, setMaterial] = useState('');
  // const [location, setLocation] = useState('');
  // const [width, setWidth] = useState('');
  // const [length, setLength] = useState('');

  // 1. Função de busca por ID
  const fetchSheet = async () => {
    setLoading(true);
    try {
      const response = await api.get<Sheet>(`/sheets/${id}`);
      const fetchedSheet = response.data;
      setSheet(fetchedSheet);

      // Preenche os estados de edição com os valores atuais
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da chapa.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheet();
  }, [id]);

  const  handleChange = (field: keyof Sheet, value: any) => {
  // Se o valor for uma string vazia para um campo opcional, envia 'null'

  if(['thickness', 'width', 'length', 'weight'].includes(field as NumericFields)) {
    const cleanString = String(value).replace(',', '.');
    const numValue = parseFloat(cleanString);

    if(value.length === 0) {
      setUpdates(prev => ({ ...prev, [field]: null }));
      return;
    }

    if(!isNaN(numValue)) {
      setUpdates(prev => ({ ...prev, [field]: numValue }));
    }

    return;
  }

  const finalValue = value === '' ? null : value;

  // Rastreia a alteração no objeto 'updates'
  setUpdates(prev => ({ ...prev, [field]: finalValue }));
};

  // 2. Função de Atualização (PATCH)
  const handleUpdate = async () => {
    if (Object.keys(updates).length === 0) {
      Alert.alert('Atenção', 'Nenhuma alteração detectada para salvar.');
      return;
    }

    try {
      console.log(updates);
      // Envia APENAS as propriedades que foram modificadas
      await api.patch(`/sheets/${id}`, updates);
      Alert.alert('Sucesso', 'Chapa atualizada com sucesso!');

      // Limpa as atualizações e força o recarregamento dos detalhes
      setUpdates({});
      fetchSheet();
      // Não vamos usar navigation.goBack() para ficar na tela e ver as mudanças.

    } catch (e) {
      Alert.alert('Erro', 'Falha ao atualizar a chapa. Verifique os dados.');
    }
  };

  // 3. Função de Exclusão (DELETE)
  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja remover esta chapa do estoque? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "EXCLUIR", onPress: async () => {
          try {
            await api.delete(`/sheets/${id}`);
            Alert.alert('Sucesso', 'Chapa excluída com sucesso.');
            navigation.popToTop(); // Volta para a tela principal (Listagem)
          } catch (e) {
            Alert.alert('Erro', 'Falha ao excluir a chapa.');
          }
        }, style: "destructive" },
      ]
    );
  };

  const HistoryItem = ({ item }: { item: SheetHistory }) => {
  return (
    <View style={historyStyles.item}>
      <Text style={historyStyles.date}>
        {new Date(item.updateDate).toLocaleDateString()} às {new Date(item.updateDate).toLocaleTimeString()}
      </Text>
      <Text>
        O campo <Text style={historyStyles.field}>{item.alteredField}</Text> foi alterado
        para <Text style={historyStyles.value}>{item.newValue || 'Vazio'}</Text>
      </Text>
      <Text style={historyStyles.user}>Por: {item.user || 'Sistema'}</Text>
    </View>
  );
};

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  if (!sheet) {
    return <Text style={styles.errorText}>Chapa não encontrada ou erro de carregamento.</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>ID: {sheet.id}</Text>
        <Text style={styles.codigo}>Código QR: {sheet.code}</Text>

        {/* Detalhes Atuais */}
        <View style={styles.card}>
          <Text style={styles.subtitle}>Dimensões Atuais:</Text>
          <Text>Largura: {sheet.width}mm | Comprimento: {sheet.length}mm</Text>
          <Text>Espessura: {sheet.thickness}mm</Text>
          <Text>Entrada: {new Date(sheet.createdAt).toLocaleString()}</Text>
        </View>

        {/* Formulário de Edição */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Editar Dados:</Text>

          <Text style={styles.label}>Material</Text>
          <TextInput
            style={styles.input}
            value={updates.material !== undefined ? updates.material : sheet.material}
            onChangeText={(text) => handleChange('material', text)}
          />

          <Text style={styles.label}>Localização</Text>
          <TextInput
            style={styles.input}
            value={updates.location !== undefined ? updates.location : sheet.location}
            onChangeText={(text) => handleChange('location', text)}
          />

          <Text style={styles.label}>Largura</Text>
          <TextInput
            style={styles.input}
            value={updates.width !== undefined ? updates.width : sheet.width.toString()}
            onChangeText={(text) => handleChange('width', parseFloat(text))}
          />

          <Text style={styles.label}>Comprimento</Text>
          <TextInput
            style={styles.input}
            value={updates.length !== undefined ? updates.length : sheet.length.toString()}
            onChangeText={(text) => handleChange('length', parseFloat(text))}
          />

          <View style={styles.buttonRow}>
            <Button title="SALVAR ALTERAÇÕES" onPress={handleUpdate} />
          </View>

          <View style={{ marginTop: 20 }}>
            <Button title="EXCLUIR CHAPA" onPress={handleDelete} color="red" />
          </View>
        </View>
        <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Histórico de Alterações</Text>

        {sheet.sheetHistories && sheet.sheetHistories.length > 0 ? (
          sheet.sheetHistories.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))
        ) : (
          <Text style={{ fontStyle: 'italic', color: '#888' }}>
            Nenhuma alteração registrada.
          </Text>
        )}
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#f9f9f9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', color: 'red', marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  codigo: { fontSize: 16, color: '#555', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, elevation: 2, marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  formContainer: { marginTop: 20, padding: 10, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
});

const historyStyles = StyleSheet.create({
  item: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  field: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  value: {
    fontWeight: 'bold',
  },
  user: {
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  }
});