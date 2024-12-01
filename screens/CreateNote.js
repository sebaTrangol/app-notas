import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import appFirebase from '../credenciales';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';


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
    if (event.type === 'set') {
      const chosenDate = selectedValue || date; // Usa la fecha actual si no se selecciona una nueva
      const formattedDate = `${String(chosenDate.getDate()).padStart(2, '0')}-${String(
        chosenDate.getMonth() + 1
      ).padStart(2, '0')}-${chosenDate.getFullYear()}`;
      setSelectedDate(formattedDate);
      setDate(chosenDate); // Actualiza el estado de la fecha
    }
    setShowDatePicker(false); // Cierra el selector después de la selección o cancelación
  };

  const onTimeChange = (event, selectedValue) => {
    if (event.type === 'set') {
      const chosenTime = selectedValue || date; // Usa la hora actual si no se selecciona una nueva
      const formattedTime = `${String(chosenTime.getHours()).padStart(2, '0')}:${String(
        chosenTime.getMinutes()
      ).padStart(2, '0')}`;
      setSelectedTime(formattedTime);
      setDate(chosenTime); // Actualiza el estado de la hora
    }
    setShowTimePicker(false); // Cierra el selector después de la selección o cancelación
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
      timestamp: serverTimestamp(), // Esto genera un timestamp al momento de guardar
    };

    try {
      await addDoc(collection(db, 'notas'), note);
      Alert.alert('Éxito', 'Nota guardada con éxito');
      props.navigation.navigate('Notas');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al guardar la nota');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>Título:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el título"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Detalle:</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Ingresa el detalle"
            multiline={true}
            numberOfLines={4}
            value={detail}
            onChangeText={setDetail}
          />

          <Text style={styles.label}>Fecha seleccionada:</Text>
          <TextInput
            style={styles.input}
            placeholder="Seleccionar Fecha"
            value={selectedDate || ''}
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
            value={selectedTime || ''}
            editable={false}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.buttonText}>Seleccionar Hora</Text>
          </TouchableOpacity>

          {showDatePicker &&
            (Platform.OS === 'ios' ? (
              <View style={styles.iosPickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedValue) => {
                    if (event.type === 'set') {
                      const chosenDate = selectedValue || date;
                      const formattedDate = `${String(chosenDate.getDate()).padStart(2, '0')}-${String(
                        chosenDate.getMonth() + 1
                      ).padStart(2, '0')}-${chosenDate.getFullYear()}`;
                      setSelectedDate(formattedDate);
                      setDate(chosenDate);
                    }
                    setShowDatePicker(false);
                  }}
                />
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
                      date.getMonth() + 1
                    ).padStart(2, '0')}-${date.getFullYear()}`;
                    setSelectedDate(formattedDate);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            ))}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={true}
              onChange={onTimeChange}
            />
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
          <Text style={styles.saveButtonText}>Guardar Nota</Text>
        </TouchableOpacity>
      </ScrollView>
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#374151',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iosPickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    width: '90%',
    position: 'relative', // Habilitar posicionamiento relativo
    height: 250, // Fijar una altura estándar para el contenedor
  },
  confirmButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute', // Posicionamiento absoluto
    bottom: 20, // Separar del borde inferior del contenedor
    alignSelf: 'center', // Centrar horizontalmente dentro del contenedor
    width: '80%', // Ajustar el ancho del botón
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
