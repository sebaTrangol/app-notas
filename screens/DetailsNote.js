import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';

import appFirebase from '../credenciales';
import { getFirestore, doc, deleteDoc, getDoc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function DetailsNote(props) {
  const [nota, setNota] = useState(null);

  // Función para obtener una nota por su ID
  const getOneNote = async (id) => {
    try {
      const docRef = doc(db, 'notas', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNota(docSnap.data());
      } else {
        Alert.alert('Error', 'La nota no existe.');
        props.navigation.navigate('Notas');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // UseEffect para cargar los datos de la nota
  useEffect(() => {
    getOneNote(props.route.params.notaId);
  }, []);

  // Función para eliminar la nota
  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'notas', id));
      Alert.alert('Éxito', 'Nota eliminada.');
      props.navigation.navigate('Notas');
    } catch (error) {
      console.log(error);
    }
  };

  // Si `nota` aún no está cargada, muestra un mensaje de "Cargando"
  if (!nota) {
    return (
      <View style={styles.contenedorPadre}>
        <Text style={styles.texto}>Cargando nota...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedorPadre}>
      <View style={styles.tarjeta}>
        <Text style={styles.texto}>Título: {nota.titulo || 'Título no disponible'}</Text>
        <Text style={styles.texto}>Detalle: {nota.detalle || 'Detalle no disponible'}</Text>
        <Text style={styles.texto}>Fecha: {nota.fecha || 'Fecha no disponible'}</Text>
        <Text style={styles.texto}>Hora: {nota.hora || 'Hora no disponible'}</Text>

        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => deleteNote(props.route.params.notaId)}
        >
          <Text style={styles.textoEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos para los elementos del componente
const styles = StyleSheet.create({
  contenedorPadre: {
    flex: 1,
    backgroundColor: 'black', // Fondo completamente negro
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    // paddingTop: 0, // Ajusta el espacio superior entre el título y el contenido
  },
  tarjeta: {
    margin: 20,
    backgroundColor: 'white', // Fondo blanco de la tarjeta
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  texto: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: 'black', // Texto negro
  },
  botonEliminar: {
    backgroundColor: '#B71375',
    borderColor: '#FC4F00',
    borderWidth: 3,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  textoEliminar: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
    fontSize: 16,
  },
});
