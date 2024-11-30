import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import appFirebase from '../credenciales';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { ListItem, Icon } from '@rneui/themed';

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

  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'notas', id));
      Alert.alert('Éxito', 'Nota eliminada');
      setLista(lista.filter((nota) => nota.id !== id)); // Actualizar lista localmente
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo eliminar la nota');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Lista de notas */}
        {lista && lista.length > 0 ? (
          lista.map((not) => (
            <View style={styles.card} key={not.id}>
              <View style={styles.cardHeader}>
                {/* Título como botón */}
                <TouchableOpacity
                  style={styles.cardTitleWrapper}
                  onPress={() => props.navigation.navigate('Details', { notaId: not.id })}
                >
                  <Text style={styles.cardTitle}>{not.titulo || 'Sin título'}</Text>
                </TouchableOpacity>
                <View style={styles.cardIcons}>
                  {/* Icono Editar */}
                  <TouchableOpacity
                      onPress={() => props.navigation.navigate('EditNote', { notaId: not.id })}
                    >
                      <Icon name="edit" type="feather" size={20} color="#3B82F6" />
                  </TouchableOpacity>

                  {/* Icono Eliminar */}
                  <TouchableOpacity onPress={() => deleteNote(not.id)}>
                    <Icon name="trash" type="feather" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>{not.fecha || 'Sin fecha'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noNotesText}>No hay notas disponibles</Text>
        )}
      </ScrollView>

      {/* FAB para agregar nueva nota */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => props.navigation.navigate('Crear')}
      >
        <Icon name="plus" type="feather" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Fondo claro
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
    flex: 1, // Esto asegura que el área táctil del título sea amplia
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937', // Gris oscuro
  },
  cardIcons: {
    flexDirection: 'row',
    gap: 10, // Espacio entre los iconos
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280', // Gris tenue
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
    backgroundColor: '#3B82F6', // Azul vibrante
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
