import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

// Importar las pantallas
import Notas from './screens/Notas'; // Pantalla "Notas"
import CreateNote from './screens/CreateNote'; // Pantalla "Crear Notas"
import DetailsNote from './screens/DetailsNote'; // Pantalla "Detalles Notas"
import EditNote from './screens/EditNote'; // Pantalla editar notas

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "white",
          headerBackTitleVisible: false, // Elimina el texto junto a la flecha en iOS
          headerBackTitle: "", // Asegura que el texto del botón de retroceso sea una cadena vacía
        }}
      >
        <Stack.Screen
          name="Notas"
          component={Notas}
          options={{
            headerLeft: null, // Elimina el botón de regreso en esta pantalla
            title: "NOTAS APP",
          }}
        />

        <Stack.Screen
          name="Crear"
          component={CreateNote}
          options={{
            title: "CREAR NOTAS",
          }}
        />

        <Stack.Screen
          name="Details"
          component={DetailsNote}
          options={{
            title: "DETALLE NOTAS",
          }}
        />
        <Stack.Screen 
         name="EditNote" 
         component={EditNote}
         options={{
          title: "EDITAR NOTAS",
        }} 
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
