import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import appFirebase from '../credenciales'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoct } from 'firebase/firestore';
import { ListItem } from '@rneui/themed'
import { ListItemChevron } from '@rneui/base/dist/ListItem/ListItem.Chevron';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
import { ListItemSubtitle } from '@rneui/base/dist/ListItem/ListItem.Subtitle';
const db = getFirestore(appFirebase)


export default function Notas(props) {

  const [lista, setLista] = useState([])

  // Lógica para llamar la lista de documentos
  useEffect(() => {
    const getLista = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'notas')); // Obtiene todos los documentos de la colección 'notas'
        const docs = []; // Array para almacenar los documentos recuperados

        querySnapshot.forEach((doc) => {
          const { titulo, detalle, fecha, hora } = doc.data(); // Extrae los campos de cada documento
          docs.push({
            id: doc.id, // Agrega el ID del documento
            titulo,
            detalle,
            fecha,
            hora,
          });
        });

        setLista(docs); // Actualiza el estado con la lista de documentos
      } catch (error) {
        console.log(error); // Muestra el error en caso de que ocurra
      }
    };

  getLista(); // Llama a la función para obtener la lista de documentos al cargar el componente
}, []);
 
    return (
      <ScrollView>
        <View>
          <TouchableOpacity style={styles.boton} onPress={()=>props.navigation.navigate('Crear')}>
           <Text style={styles.textoBoton}> AGREGAR NUEVAS NOTAS </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contenedor}>
          {lista.map((not)=>(
            <ListItem bottomDivider key={not.id} onPress={()=>{props.navigation.navigate('Details',{
              notaId: not.id
            })}}>
              <ListItemChevron />

              <ListItemContent>
                <ListItemTitle style={styles.titulo}>{not.titulo}</ListItemTitle>
                <ListItemSubtitle>{not.fecha}</ListItemSubtitle>
              </ListItemContent>
            </ListItem>
          ))
          }
        </View>

      </ScrollView>
    )
}

const styles = StyleSheet.create({
  boton:{
    backgroundColor: '#B71375',
    borderBlockColor: '#FC4F00',
    borderWidth: 3,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },
  textoBoton:{
    textAlign: 'center',
    padding: 10,
    color: 'white',
    fontSize: 16
  },
  contenedor: {
    margin:20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titulo: {
    fontWeight: 'bold',
  },
})
