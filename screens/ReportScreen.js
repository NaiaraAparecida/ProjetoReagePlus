import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert,
  Platform, SafeAreaView, StatusBar, Image, Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const ReportForm = () => {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
        return;
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
    } catch {
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!type.trim() || !description.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
      return;
    }

    const loc = await getCurrentLocation();
    const newReport = {
      id: Date.now().toString(),
      type,
      description,
      image: imageUri || null,
      location: loc,
      timestamp: new Date().toLocaleString(),
    };

    try {
      const storedReports = await AsyncStorage.getItem('reports');
      const reports = storedReports ? JSON.parse(storedReports) : [];
      reports.push(newReport);
      await AsyncStorage.setItem('reports', JSON.stringify(reports));

      setType('');
      setDescription('');
      setImageUri(null);
      setLocation(null);
      setSuccessModalVisible(true);
      setTimeout(() => setSuccessModalVisible(false), 2500);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a ocorrência.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Tipo de Risco</Text>
        <View style={styles.inputRow}>
          <Feather name="alert-triangle" size={20} color="#d32f2f" />
          <TextInput
            style={styles.input}
            placeholder="Ex: Enchente, Incêndio..."
            value={type}
            onChangeText={setType}
          />
        </View>

        <Text style={styles.label}>Descrição</Text>
        <View style={styles.inputRow}>
          <Feather name="file-text" size={20} color="#555" />
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Descreva o que está acontecendo..."
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <Text style={styles.label}>Imagem do Evento</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Feather name="camera" size={20} color="#fff" />
          <Text style={styles.imageButtonText}>Escolher Imagem</Text>
        </TouchableOpacity>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Feather name="send" size={18} color="#fff" />
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

        {/* Modal de Sucesso */}
        <Modal visible={successModalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Feather name="check-circle" size={40} color="green" />
              <Text style={styles.successText}>Ocorrência registrada!</Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  previewImage: {
    marginTop: 10,
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#43a047',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  successText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: 'green',
  },
});

export default ReportForm;




