import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import appFirebase from '../credenciales';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function CreateNote(props) {
  const initialState = {
    titulo: '',
    detalle: '',
  };

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [estado, setEstado] = useState(initialState);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    const tempDate = new Date(currentDate);
    const formattedDate = `${tempDate.getDate()}/${tempDate.getMonth() + 1}/${tempDate.getFullYear()}`;
    const formattedTime = `Hora: ${tempDate.getHours()} minutos: ${tempDate.getMinutes()}`;

    if (mode === 'date') {
      setFecha(formattedDate);
    } else {
      setHora(formattedTime);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const handlerChangeText = (value, name) => {
    setEstado({ ...estado, [name]: value });
  };

  const saveNote = async () => {
    try {
      if (estado.titulo === '' || estado.detalle === '' || fecha === '' || hora === '') {
        Alert.alert('Mensaje importante', 'Debes rellenar todos los campos requeridos');
      } else {
        const nota = {
          titulo: estado.titulo,
          detalle: estado.detalle,
          fecha: fecha,
          hora: hora,
        };
        await addDoc(collection(db, 'notas'), {
          ...nota,
        });
        Alert.alert('Guardado con éxito');
        props.navigation.navigate('Notas');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.contenedorPadre}>
      <View style={styles.tarjeta}>
        <View style={styles.contenedor}>
          <TextInput
            placeholder="Ingresar el Título"
            style={styles.textoInput}
            value={estado.titulo}
            onChangeText={(value) => handlerChangeText(value, 'titulo')}
          />

          <TextInput
            placeholder="Ingresa el Detalle"
            multiline={true}
            numberOfLines={10}
            style={styles.textoInput}
            value={estado.detalle}
            onChangeText={(value) => handlerChangeText(value, 'detalle')}
          />

          <View style={styles.inputDate}>
            <TextInput
              placeholder={fecha || 'Selecciona una fecha'}
              style={styles.textoDate}
              editable={false}
            />
            <TouchableOpacity style={styles.botonDate} onPress={() => showMode('date')}>
              <Text style={styles.subtitle}>Date</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputDate}>
            <TextInput
              placeholder={hora || 'Selecciona una hora'}
              style={styles.textoDate}
              editable={false}
            />
            <TouchableOpacity style={styles.botonDate} onPress={() => showMode('time')}>
              <Text style={styles.subtitle}>Hora</Text>
            </TouchableOpacity>
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
              minimumDate={new Date(2000, 0, 1)}
            />
          )}

          <TouchableOpacity style={styles.botonEnviar} onPress={saveNote}>
            <Text style={styles.textoBtnEnviar}>Guardar Nota</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorPadre: {
    flex: 1,
    backgroundColor: 'black', // Fondo negro para la pantalla
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: -10, // Ajusta este valor para mover hacia abajo el contenido
  },
  tarjeta: {
    backgroundColor: 'white', // Fondo blanco para la tarjeta
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  contenedor: {
    padding: 20,
  },
  textoInput: {
    borderColor: 'slategray',
    borderWidth: 1,
    padding: 2,
    marginTop: 10,
    borderRadius: 8,
  },
  inputDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  botonDate: {
    backgroundColor: '#B71375',
    borderRadius: 5,
    padding: 10,
    width: '30%',
    marginLeft: 10,
  },
  textoDate: {
    borderColor: 'slategray',
    borderWidth: 1,
    padding: 10,
    flex: 1,
    borderRadius: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  botonEnviar: {
    backgroundColor: '#B71375',
    borderColor: '#FC4F00',
    borderWidth: 3,
    borderRadius: 20,
    marginTop: 20,
  },
  textoBtnEnviar: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
    fontSize: 16,
  },
});
