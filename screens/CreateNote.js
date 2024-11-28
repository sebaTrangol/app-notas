import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import appFirebase from '../credenciales';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function CreateNote(props) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [estado, setEstado] = useState({ titulo: '', detalle: '' });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    const tempDate = new Date(currentDate);
    const formattedDate = `${tempDate.getDate()}/${tempDate.getMonth() + 1}/${tempDate.getFullYear()}`;
    const formattedTime = `${tempDate.getHours()}:${tempDate.getMinutes()}`;

    if (mode === 'date') {
      setFecha(formattedDate);
    } else {
      setHora(formattedTime);
    }
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  const handlerChangeText = (value, name) => {
    setEstado({ ...estado, [name]: value });
  };

  const saveNote = async () => {
    if (estado.titulo === '' || estado.detalle === '' || fecha === '' || hora === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const nota = {
      titulo: estado.titulo,
      detalle: estado.detalle,
      fecha,
      hora,
    };

    try {
      await addDoc(collection(db, 'notas'), nota);
      Alert.alert('Éxito', 'Nota guardada con éxito');
      props.navigation.navigate('Notas');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Hubo un problema al guardar la nota');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'black' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contenedorPadre}>
        <View style={styles.tarjeta}>
          <TextInput
            placeholder="Ingresar el Título"
            style={styles.textoInput}
            value={estado.titulo}
            onChangeText={(value) => handlerChangeText(value, 'titulo')}
          />
          <TextInput
            placeholder="Ingresa el Detalle"
            multiline={true}
            numberOfLines={5}
            style={styles.textoInput}
            value={estado.detalle}
            onChangeText={(value) => handlerChangeText(value, 'detalle')}
          />
          <View style={styles.inputDate}>
            <TextInput placeholder={fecha || 'Selecciona una fecha'} style={styles.textoDate} editable={false} />
            <TouchableOpacity style={styles.botonDate} onPress={() => showMode('date')}>
              <Text style={styles.subtitle}>Date</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputDate}>
            <TextInput placeholder={hora || 'Selecciona una hora'} style={styles.textoDate} editable={false} />
            <TouchableOpacity style={styles.botonDate} onPress={() => showMode('time')}>
              <Text style={styles.subtitle}>Hora</Text>
            </TouchableOpacity>
          </View>

          {show && (
            <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { height: Platform.OS === 'ios' ? 'auto' : 1000 }]}>
              <DateTimePicker
                value={date}
                mode={mode}
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                onChange={onChange}
              />
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShow(false)}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          )}

          <TouchableOpacity style={styles.botonEnviar} onPress={saveNote}>
            <Text style={styles.textoBtnEnviar}>Guardar Nota</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedorPadre: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  tarjeta: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  textoInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  inputDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textoDate: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  botonDate: {
    backgroundColor: '#B71375',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  subtitle: {
    color: 'white',
  },
  botonEnviar: {
    backgroundColor: '#B71375',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  textoBtnEnviar: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
  },
  modalCloseButton: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#B71375',
    borderRadius: 5,
    padding: 10,
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
  },
});
