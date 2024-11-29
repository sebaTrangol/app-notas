import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateNote() {
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
        onPress={() => {
          console.log('Título:', title);
          console.log('Detalle:', detail);
          console.log('Fecha:', selectedDate);
          console.log('Hora:', selectedTime);
        }}
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
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    alignSelf: 'flex-start'
  },
  input: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#B71375',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});
