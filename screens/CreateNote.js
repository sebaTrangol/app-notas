// Importación de librerías necesarias
import React, { useState } from 'react'; // React para manejar componentes y useState para los estados
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native'; // Componentes nativos de React Native
import DateTimePicker from '@react-native-community/datetimepicker'; // Componente DateTimePicker para seleccionar fechas y horas
import { Platform } from 'react-native';
import appFirebase from '../credenciales'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoct } from 'firebase/firestore';
const db = getFirestore(appFirebase)

// Componente principal
export default function CreateNote(props) {
  // Estado inicial para los datos de la nota
  const initialState = {
    titulo: '', // Título de la nota
    detalle: '', // Detalle o contenido de la nota
  };

  // Estados del componente
  const [date, setDate] = useState(new Date()); // Almacena la fecha seleccionada (inicia con la fecha actual)
  const [mode, setMode] = useState('date'); // Define si se está seleccionando una fecha ('date') o una hora ('time')
  const [show, setShow] = useState(false); // Controla si el DateTimePicker se muestra o no
  const [fecha, setFecha] = useState(''); // Almacena la fecha seleccionada como texto
  const [hora, setHora] = useState(''); // Almacena la hora seleccionada como texto
  const [estado, setEstado] = useState(initialState); // Almacena los datos del formulario (título y detalle)

  // Función para manejar el cambio de fecha u hora en el DateTimePicker
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date; // Usa la fecha seleccionada o la fecha actual
    setShow(false); // Oculta el DateTimePicker después de seleccionar una fecha u hora
    setDate(currentDate); // Actualiza el estado con la nueva fecha seleccionada

    // Formateo de la fecha y hora seleccionadas
    const tempDate = new Date(currentDate);
    const formattedDate = `${tempDate.getDate()}/${tempDate.getMonth() + 1}/${tempDate.getFullYear()}`; // Formatea la fecha como dd/mm/aaaa
    const formattedTime = `Hora: ${tempDate.getHours()} minutos: ${tempDate.getMinutes()}`; // Formatea la hora como hh:mm

    // Asigna el valor formateado según el modo seleccionado
    if (mode === 'date') {
      setFecha(formattedDate); // Si es fecha, actualiza el estado 'fecha'
    } else {
      setHora(formattedTime); // Si es hora, actualiza el estado 'hora'
    }
  };

  // Función para mostrar el DateTimePicker con el modo deseado (fecha u hora)
  const showMode = (currentMode) => {
    setShow(true); // Muestra el DateTimePicker
    setMode(currentMode); // Establece el modo ('date' o 'time')
  };

  const handlerChangeText = (value, name)=>{
     setEstado({...estado, [name]:value})
  }
   
  // prueba local para guardar datos
  const saveNote= async()=>{
    try {
      if(estado.titulo ==='' || estado.detalle === ''){
        Alert.alert('mensaje importante, debes rellenar el campo requerido')
      }
      else{
        const nota = {
        titulo: estado.titulo,
        detalle: estado.detalle,
        fecha: fecha,
        hora: hora
        }
        await addDoc(collection(db,'notas'),{
          ...nota
        })

        Alert.alert('Guardado con exito')
        props.navigation.navigate('Notas')

      }
    } catch (error) {
      console.log(error);
      
    }
    
    // console.log(nota);
  }

  return (
    <View style={styles.contenedorPadre}>
      {/* Tarjeta que contiene el formulario */}
      <View style={styles.tarjeta}>
        <View style={styles.contenedor}>
          {/* Input para ingresar el título */}
          <TextInput 
            placeholder="Ingresar el Título" 
            style={styles.textoInput} 
            value={estado.titulo}
            onChangeText={(value)=>handlerChangeText(value, 'titulo')}
          />

          {/* Input para ingresar el detalle */}
          <TextInput
            placeholder="Ingresa el Detalle"
            multiline={true} // Permite varias líneas de texto
            numberOfLines={10} // Establece el número máximo de líneas visibles
            style={styles.textoInput}
            value={estado.detalle}
            onChangeText={(value)=>handlerChangeText(value, 'detalle')}
          />

          {/* Contenedor para seleccionar la fecha */}
          <View style={styles.inputDate}>
            <TextInput
              placeholder={fecha || 'Selecciona una fecha'} // Muestra la fecha seleccionada o un texto de ejemplo
              style={styles.textoDate}
              editable={false} // Deshabilita la edición directa en el campo
            />
            {/* Botón para abrir el selector de fecha */}
            <TouchableOpacity style={styles.botonDate} onPress={() => showMode('date')}>
              <Text style={styles.subtitle}>Date</Text>
            </TouchableOpacity>
          </View>

          {/* Contenedor para seleccionar la hora */}
          <View style={styles.inputDate}>
            <TextInput
              placeholder={hora || 'Selecciona una hora'} // Muestra la hora seleccionada o un texto de ejemplo
              style={styles.textoDate}
              editable={false} // Deshabilita la edición directa en el campo
            />
            {/* Botón para abrir el selector de hora */}
            <TouchableOpacity style={styles.botonDate} onPress={() => showMode('time')}>
              <Text style={styles.subtitle}>Hora</Text>
            </TouchableOpacity>
          </View>

          {/* Muestra el DateTimePicker si 'show' es true */}
          {show && (
            <DateTimePicker
              testID="dateTimePicker" // ID para pruebas
              value={date} // Fecha actual del selector
              mode={mode} // Modo (fecha u hora)
              is24Hour={true} // Usa el formato de 24 horas
              display="default" // Estilo del selector
              onChange={onChange} // Función que se ejecuta al seleccionar una fecha/hora
              minimumDate={new Date(2023, 0, 1)} // Fecha mínima permitida
            />
          )}

          {/* Botón para guardar la nota */}
          <View>
            <TouchableOpacity style={styles.botonEnviar} onPress={saveNote}>
              <Text style={styles.textoBtnEnviar}>Guardar Nota</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  contenedorPadre: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
  },
  tarjeta: {
    margin: 20,
    backgroundColor: 'white', // Fondo blanco
    borderRadius: 20, // Esquinas redondeadas
    width: '90%', // Ancho del 90% del contenedor
    padding: 20,
    shadowColor: '#000', // Sombra negra
    shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
    shadowOpacity: 0.25, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 7, // Sombra en Android
  },
  contenedor: {
    padding: 20, // Espaciado interno
  },
  textoInput: {
    borderColor: 'slategray', // Color del borde
    borderWidth: 1, // Ancho del borde
    padding: 2, // Espaciado interno
    marginTop: 10, // Margen superior
    borderRadius: 8, // Esquinas redondeadas
  },
  inputDate: {
    width: '100%',
    flexDirection: 'row', // Organiza elementos en una fila
    alignItems: 'center', // Centra verticalmente
  },
  botonDate: {
    backgroundColor: '#B71375', // Color de fondo
    borderRadius: 5, // Esquinas redondeadas
    padding: 10, // Espaciado interno
    width: '30%', // Ancho del 30% del contenedor
    height: '90%', // Altura del 90% del contenedor
    marginTop: 10, // Margen superior
    marginLeft: 10, // Margen izquierdo
  },
  textoDate: {
    borderColor: 'slategray', // Color del borde
    borderWidth: 1, // Ancho del borde
    padding: 10, // Espaciado interno
    marginTop: 10, // Margen superior
    borderRadius: 8, // Esquinas redondeadas
    flex: 1, // Ocupa todo el espacio disponible
  },
  subtitle: {
    color: 'white', // Texto blanco
    fontSize: 18, // Tamaño de fuente
    textAlign: 'center', // Centrado
  },
  botonEnviar: {
    backgroundColor: '#B71375', // Color de fondo
    borderColor: '#FC4F00', // Color del borde
    borderWidth: 3, // Ancho del borde
    borderRadius: 20, // Esquinas redondeadas
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  textoBtnEnviar: {
    textAlign: 'center', // Texto centrado
    padding: 10, // Espaciado interno
    color: 'white', // Texto blanco
    fontSize: 16, // Tamaño de fuente
  },
});
