import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity, Alert, Platform, Modal, SafeAreaView, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const ReportForm = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [sending, setSending] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const handleSubmit = async () => {
    if (!description) {
      Alert.alert('Erro', 'A descrição é obrigatória.');
      return;
    }
    setSending(true);
    await getLocation();

    const newReport = {
      description,
      image,
      location,
      date: new Date().toISOString(),
    };

    try {
      const stored = await AsyncStorage.getItem('reports');
      const reports = stored ? JSON.parse(stored) : [];
      reports.push(newReport);
      await AsyncStorage.setItem('reports', JSON.stringify(reports));
      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
        setDescription('');
        setImage(null);
        setSending(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reportar Ocorrência</Text>

        <TextInput
          style={styles.input}
          placeholder="Descreva o que está acontecendo..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <Button title={sending ? 'Enviando...' : 'Enviar Ocorrência'} onPress={handleSubmit} disabled={sending} />

        <View style={{ marginTop: 20 }}>
          <Button title="Ver Histórico de Ocorrências" onPress={() => navigation.navigate('ReportHistory')} />
        </View>

        <Modal visible={successModal} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <LottieView
              source={require('../assets/Animation - 1749093240549.json')}
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
            />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Ocorrência enviada!</Text>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? 40 : 0
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top'
  },
  imagePicker: {
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ReportForm;






