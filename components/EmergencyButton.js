import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EmergencyButton = () => {
  const handleSOS = () => {
    Alert.alert('⚠️ SOS Enviado', 'Sua localização foi compartilhada com seus contatos.');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSOS}>
      <MaterialIcons name="report-problem" size={28} color="#fff" />
      <Text style={styles.text}>SOS</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#d32f2f',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10
  }
});

export default EmergencyButton;

