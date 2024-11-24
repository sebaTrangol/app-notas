import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native'

import appFirebase from '../credenciales'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoct } from 'firebase/firestore';
const db = getFirestore(appFirebase)

export default function DetailsNote(props) {

  const [nota, setNota] = useState({})

  const getOneNote = async(id)=>{
    try {
      const docRef = doc(db, 'notas', id)
      const docSnap = await getDoc(docRef)
      setNota(docSnap.data())
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getOneNote(props.route.params.notaId)
  },[])


  const deleteNote = async(id) =>{
    await deleteDoc(doc(db,'notas', id))
    Alert.alert('Exito, nota eliminada.')
    props.navigation.navigate('Notas')
  }
 
    return (
      <View>
        <View style={styles.contenedor}>
          <Text style={styles.texto}>Titulo: {nota.titulo}</Text>
          <Text style={styles.texto}>Detalle: {nota.detalle}</Text>
          <Text style={styles.texto}>Fecha: {nota.fecha}</Text>
          <Text style={styles.texto}> {nota.hora}</Text>

          <TouchableOpacity style={styles.botonEliminar} onPress={()=>deleteNote(props.route.params.notaId)}>
            <Text style={styles.textoEliminar}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  contenedor: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 10,
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
