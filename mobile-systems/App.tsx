import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { ListSheets } from './src/screens/ListSheets';
import { CreateSheet } from './src/screens/CreateSheet';
import { DetailSheet } from './src/screens/DetailSheet';
import { QrScanner } from './src/screens/QrScanner';
import { SafeAreaView } from 'react-native-safe-area-context';

export type RootStackParamList = {
  Create: undefined;
  List: undefined;
  Detail: {id: number};
  Scanner: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen
          name="List"
          component={ListSheets}
          options={{ title: "Estoque de Chapas"}}
        />

        <Stack.Screen
          name="Create"
          component={CreateSheet}
          options={{ title: "Criação de Chapa" }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailSheet}
          options={{ title: "Detalhes da Chapa" }}
        />
        <Stack.Screen
          name='Scanner'
          component={QrScanner}
          options={{ title: "Leitor de QR Code" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
