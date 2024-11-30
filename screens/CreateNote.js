import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import appFirebase from '../credenciales';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function CreateNote(props) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');

  const onDateChange = (event, selectedValue) => {
    setShowDatePicker(false);
    if (selectedValue) {
      setSelectedDate(
        `${selectedValue.getDate()}/${selectedValue.getMonth() + 1}/${selectedValue.getFullYear()}`
      );
    }
  };

  const onTimeChange = (event, selectedValue) => {
    setShowTimePicker(false);
    if (selectedValue) {
      setSelectedTime(
        `${selectedValue.getHours()}:${selectedValue.getMinutes()}`
      );
    }
  };

  const saveNote = async () => {
    if (!title || !detail || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const note = {
      titulo: title,
      detalle: detail,
      fecha: selectedDate,
      hora: selectedTime,
    };

    try {
      await addDoc(collection(db, 'notas'), note);
      Alert.alert('Éxito', 'Nota guardada con éxito');
      props.navigation.navigate('Notas'); // Regresa al inicio
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al guardar la nota');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el Título"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Detalle:</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Ingresa el Detalle"
        multiline={true}
        numberOfLines={4}
        value={detail}
        onChangeText={setDetail}
      />

      <Text style={styles.label}>Fecha seleccionada:</Text>
      <TextInput
        style={styles.input}
        placeholder="Seleccionar Fecha"
        value={selectedDate}
        editable={false}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.buttonText}>Seleccionar Fecha</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Hora seleccionada:</Text>
      <TextInput
        style={styles.input}
        placeholder="Seleccionar Hora"
        value={selectedTime}
        editable={false}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.buttonText}>Seleccionar Hora</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          onChange={onTimeChange}
        />
      )}

      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={saveNote}
      >
        <Text style={styles.buttonText}>Guardar Nota</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB', // Fondo gris claro
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Gris oscuro
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderColor: '#E5E7EB', // Gris tenue
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 10, // Bordes redondeados
    backgroundColor: '#FFFFFF', // Blanco
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#3B82F6', // Azul vibrante para botones
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF', // Fondo blanco
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
