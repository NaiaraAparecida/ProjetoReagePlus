import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  TouchableOpacity,
  Vibration,
  Modal,
  FlatList,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EmergencyScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();

  const handleSOS = async (isTest = false) => {
    try {
      Vibration.vibrate(500);
      setModalVisible(true);

      let location = null;
      if (!isTest) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        location = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
      } else {
        location = { latitude: -23.5505, longitude: -46.6333 }; // Local simulado
      }

      const alertData = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        location,
        message: isTest ? 'Teste de Emergência' : 'Alerta de SOS acionado',
        contactSent: !isTest,
      };

      const stored = await AsyncStorage.getItem('sos_alerts');
      const existing = stored ? JSON.parse(stored) : [];
      existing.push(alertData);
      await AsyncStorage.setItem('sos_alerts', JSON.stringify(existing));

      setTimeout(() => {
        setModalVisible(false);
        loadHistory();
      }, 2000);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível enviar o alerta.');
    }
  };

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem('sos_alerts');
    const data = stored ? JSON.parse(stored) : [];
    setHistory(data.reverse());
  };

  React.useEffect(() => {
    loadHistory();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Feather name="alert-triangle" size={40} color="#d32f2f" />
        <Text style={styles.title}>Emergência</Text>
        <Text style={styles.description}>
          Pressione o botão SOS para compartilhar sua localização com seus contatos de confiança.
        </Text>

        <TouchableOpacity style={styles.sosButton} onPress={() => handleSOS(false)}>
          <Feather name="alert-circle" size={32} color="#fff" />
          <Text style={styles.sosText}>ENVIAR SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={() => handleSOS(true)}>
          <Feather name="activity" size={22} color="#fff" />
          <Text style={styles.testText}>TESTE DE EMERGÊNCIA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('TrustedContacts')}>
          <Feather name="users" size={18} color="#1e88e5" />
          <Text style={styles.navText}>Gerenciar Contatos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('SOSMap')}>
          <Feather name="map" size={18} color="#1e88e5" />
          <Text style={styles.navText}>Ver Mapa de Alertas</Text>
        </TouchableOpacity>

        <Text style={styles.historyTitle}>Histórico de Alertas</Text>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.alertItem}>
              <Text style={styles.alertText}>{item.timestamp}</Text>
              <Text style={styles.alertText}>
                📍 {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
              </Text>
            </View>
          )}
        />

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Feather name="check-circle" size={50} color="green" />
              <Text style={styles.modalText}>Alerta enviado com sucesso!</Text>
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
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  sosButton: {
    flexDirection: 'row',
    backgroundColor: '#e53935',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  sosText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  testButton: {
    flexDirection: 'row',
    backgroundColor: '#757575',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  testText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  navText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#1e88e5',
  },
  modalOverlay: {
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
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: 'green',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  alertItem: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  alertText: {
    fontSize: 14,
    color: '#444',
  },
});

export default EmergencyScreen;


