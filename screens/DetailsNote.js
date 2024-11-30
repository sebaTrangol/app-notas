import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Icon } from '@rneui/themed';

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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando nota...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Título:</Text>
        <Text style={styles.content}>{nota.titulo || 'Título no disponible'}</Text>

        <Text style={styles.title}>Detalle:</Text>
        <Text style={styles.content}>{nota.detalle || 'Detalle no disponible'}</Text>

        <Text style={styles.title}>Fecha:</Text>
        <Text style={styles.content}>{nota.fecha || 'Fecha no disponible'}</Text>

        <Text style={styles.title}>Hora:</Text>
        <Text style={styles.content}>{nota.hora || 'Hora no disponible'}</Text>

        {/* Botón para eliminar */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNote(props.route.params.notaId)}
        >
          <Icon name="trash" type="feather" size={24} color="white" />
          <Text style={styles.deleteButtonText}>Eliminar Nota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 15,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
