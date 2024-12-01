import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import appFirebase from '../credenciales';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Icon } from '@rneui/themed';

const db = getFirestore(appFirebase);

export default function Notas(props) {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const getLista = () => {
      const notesQuery = query(collection(db, 'notas'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(
        notesQuery,
        (querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            const { titulo, detalle, fecha, hora } = doc.data();
            docs.push({
              id: doc.id,
              titulo: titulo || 'Sin título',
              detalle: detalle || '',
              fecha: fecha || '',
              hora: hora || '',
            });
          });
          setLista(docs); // Actualiza la lista
        },
        (error) => {
          console.error('Error al obtener las notas:', error);
        }
      );
      return unsubscribe; // Limpia la suscripción al desmontar
    };

    const unsubscribe = getLista();
    return () => unsubscribe();
  }, []);

  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'notas', id));
      Alert.alert('Éxito', 'Nota eliminada');
      setLista((prevLista) => prevLista.filter((nota) => nota.id !== id)); // Actualiza localmente
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      Alert.alert('Error', 'No se pudo eliminar la nota');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {lista.length > 0 ? (
          lista.map((nota) => (
            <View style={styles.card} key={nota.id}>
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  style={styles.cardTitleWrapper}
                  onPress={() => props.navigation.navigate('Details', { notaId: nota.id })}
                >
                  <Text style={styles.cardTitle}>{nota.titulo}</Text>
                </TouchableOpacity>
                <View style={styles.cardIcons}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('EditNote', { notaId: nota.id })}>
                    <Icon name="edit" type="feather" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteNote(nota.id)}>
                    <Icon name="trash" type="feather" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>{nota.fecha}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noNotesText}>No hay notas disponibles</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => props.navigation.navigate('Crear')}>
        <Icon name="plus" type="feather" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  noNotesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3B82F6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
