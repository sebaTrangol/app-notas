import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import appFirebase from '../credenciales';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export default function EditNote(props) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');

  const noteId = props.route.params.notaId;

  const getNoteData = async (id) => {
    try {
      const docRef = doc(db, 'notas', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { titulo, detalle, fecha, hora } = docSnap.data();
        setTitle(titulo || '');
        setDetail(detalle || '');
        setSelectedDate(fecha || '');
        setSelectedTime(hora || '');
      } else {
        Alert.alert('Error', 'La nota no existe.');
        props.navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNoteData(noteId);
  }, []);

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

  const saveChanges = async () => {
    if (!title || !detail || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const docRef = doc(db, 'notas', noteId);
      await updateDoc(docRef, {
        titulo: title,
        detalle: detail,
        fecha: selectedDate,
        hora: selectedTime,
      });
      Alert.alert('Éxito', 'Nota actualizada con éxito');
      props.navigation.navigate('Notas');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar la nota');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          placeholder="Editar Título"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Detalle:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Editar Detalle"
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
          <Text style={styles.buttonText}>Editar Fecha</Text>
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
          <Text style={styles.buttonText}>Editar Hora</Text>
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
          style={[styles.button, styles.saveButton]}
          onPress={saveChanges}
        >
          <Text style={[styles.buttonText, styles.saveButtonText]}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  input: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#10B981', // Verde para diferenciar
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 18, // Tamaño más grande
    fontWeight: '700', // Texto en negrita
  },
});
