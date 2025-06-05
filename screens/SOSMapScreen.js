import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';

const SOSMapScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [radius, setRadius] = useState('1km');

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const stored = await AsyncStorage.getItem('sos_alerts');
        const data = stored ? JSON.parse(stored) : [];
        setAlerts(data.filter(a => a.location));
      } catch (error) {
        console.error('Erro ao carregar alertas:', error);
      }
    };

    loadAlerts();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topOverlay}>
        <View style={styles.filterContainer}>
          <Text style={styles.label}>Filtrar por raio:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={radius}
              style={styles.picker}
              onValueChange={(itemValue) => setRadius(itemValue)}
            >
              <Picker.Item label="1 km" value="1km" />
              <Picker.Item label="5 km" value="5km" />
              <Picker.Item label="10 km" value="10km" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="refresh-ccw" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="target" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            coordinate={alert.location}
            title={alert.message}
            description={`Enviado em ${alert.timestamp}`}
            pinColor="#d32f2f"
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 50 : 20,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center'
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '94%',
    alignSelf: 'center'
  },
  label: {
    fontSize: 14,
    marginRight: 6
  },
  pickerWrapper: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    marginRight: 6
  },
  picker: {
    height: 40,
    width: '100%'
  },
  iconButton: {
    backgroundColor: '#1e88e5',
    padding: 10,
    borderRadius: 8,
    marginLeft: 4
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});

export default SOSMapScreen;




