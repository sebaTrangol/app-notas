import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, ImageBackground, Button, 
         Alert, TouchableOpacity, ScrollView, FlatList, TextInput } from 'react-native';


// Importar las pantallas
import Notas from './screens/Notas'; // Pantalla "Notas"
import CreateNote from './screens/CreateNote'; // Pantalla "Crear Notas"
import DetailsNote from './screens/DetailsNote'; // Pantalla "Detalles Notas"

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Notas"
          component={Notas}
          options={{
            title: "NOTAS APP",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#8B1874" },
            headerTintColor: "white",
          }}
        />

        <Stack.Screen
          name="Crear"
          component={CreateNote}
          options={{
            title: "CREAR NOTAS",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#8B1874" },
            headerTintColor: "white",
          }}
        />

        <Stack.Screen
          name="Details"
          component={DetailsNote}
          options={{
            title: "Detalles Notas",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#8B1874" },
            headerTintColor: "white",
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
