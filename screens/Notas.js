import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import appFirebase from '../credenciales';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { ListItem } from '@rneui/themed';

// Inicialización de Firestore
const db = getFirestore(appFirebase);

export default function Notas(props) {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'notas'));
        const docs = [];
        querySnapshot.forEach((doc) => {
          const { titulo, detalle, fecha, hora } = doc.data();
          docs.push({
            id: doc.id,
            titulo,
            detalle,
            fecha,
            hora,
          });
        });
        setLista(docs);
      } catch (error) {
        console.log(error);
      }
    };

    getLista();
  }, []);

  return (
    <View style={styles.contenedorPadre}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Botón para agregar nuevas notas */}
        <TouchableOpacity style={styles.boton} onPress={() => props.navigation.navigate('Crear')}>
          <Text style={styles.textoBoton}>AGREGAR NUEVAS NOTAS</Text>
        </TouchableOpacity>

        {/* Lista de notas */}
        <View>
          {lista && lista.length > 0 ? (
            lista.map((not) => (
              <ListItem
                containerStyle={styles.notaContainer}
                key={not.id}
                bottomDivider
                onPress={() => {
                  props.navigation.navigate('Details', {
                    notaId: not.id,
                  });
                }}
              >
                <ListItem.Content>
                  <ListItem.Title style={styles.titulo}>
                    {not.titulo || 'Título no disponible'}
                  </ListItem.Title>
                  <ListItem.Subtitle style={styles.subtitulo}>
                    {not.fecha || 'Fecha no disponible'}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ))
          ) : (
            <Text style={styles.textoNoNotas}>No hay notas disponibles</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorPadre: {
    flex: 1,
    backgroundColor: 'black', // Fondo negro de la pantalla
    paddingTop: 50 // Mueve el contenido hacia abajo
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20, // Espaciado adicional al final
  },
  boton: {
    backgroundColor: 'white',
    borderBlockColor: 'white',
    borderWidth: 0,
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 20, // Añadir margen a los lados
    paddingHorizontal: 10,
  },
  textoBoton: {
    textAlign: 'center',
    padding: 10,
    color: 'black', // Texto oscuro para el botón
    fontSize: 16,
  },
  notaContainer: {
    backgroundColor: 'white', // Fondo blanco para cada nota
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  titulo: {
    fontWeight: 'bold',
    color: 'black', // Texto negro para el título
  },
  subtitulo: {
    color: 'gray', // Texto gris para el subtítulo
  },
  textoNoNotas: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
});
