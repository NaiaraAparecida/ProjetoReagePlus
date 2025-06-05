import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  Alert,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';

const radiusOptions = [1, 2, 5, 10];

const haversineDistance = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapComponent = () => {
  const [reports, setReports] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(2);
  const mapRef = useRef(null);

  const loadReports = async (radiusKm) => {
    try {
      setLoading(true);
      const loc = await Location.getCurrentPositionAsync({});
      const userLoc = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setUserLocation(userLoc);

      const stored = await AsyncStorage.getItem('reports');
      const data = stored ? JSON.parse(stored) : [];
      const withLocation = data.filter((item) => item.location);
      const now = new Date();
      const filtered = withLocation.filter((item) => {
        const createdAt = new Date(item.timestamp);
        const hoursAgo = (now - createdAt) / (1000 * 60 * 60);
        const distance = haversineDistance(userLoc, item.location);
        return hoursAgo <= 24 && distance <= radiusKm;
      });
      setReports(filtered);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar dados do mapa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
        return;
      }
      await loadReports(radius);
    })();
  }, [radius]);

  const getPinColor = (type) => {
    const lower = type.toLowerCase();
    if (lower.includes('fogo') || lower.includes('incêndio')) return '#d32f2f';
    if (lower.includes('enchente') || lower.includes('inundação')) return '#1e88e5';
    return '#ffa000';
  };

  const centerToUser = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      });
    }
  };

  if (loading || !userLocation) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text style={{ marginTop: 10 }}>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...userLocation,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={userLocation}
          title="Você está aqui"
          pinColor="#4caf50"
        />

        <Circle
          center={userLocation}
          radius={radius * 1000}
          strokeColor="#1e88e5"
          fillColor="rgba(30,136,229,0.1)"
        />

        {reports.map((report) => {
          const distance = haversineDistance(userLocation, report.location).toFixed(2);
          return (
            <Marker
              key={report.id}
              coordinate={report.location}
              title={report.type}
              description={report.description}
              pinColor={getPinColor(report.type)}
            >
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{report.type}</Text>
                  <Text style={styles.calloutDesc}>{report.description}</Text>
                  {report.image && (
                    <Image source={{ uri: report.image }} style={styles.calloutImage} />
                  )}
                  <Text style={styles.calloutTime}>{report.timestamp}</Text>
                  <Text style={styles.calloutDistance}>Distância: {distance} km</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.filterBar}>
        <Text style={{ marginRight: 8 }}>Filtrar por raio:</Text>
        <Picker
          selectedValue={radius}
          style={styles.picker}
          onValueChange={(value) => setRadius(value)}
        >
          {radiusOptions.map((r) => (
            <Picker.Item key={r} label={`Até ${r} km`} value={r} />
          ))}
        </Picker>
        <TouchableOpacity onPress={() => loadReports(radius)} style={styles.reloadButton}>
          <Text style={styles.reloadText}>🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={centerToUser} style={styles.reloadButton}>
          <Text style={styles.reloadText}>🎯</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  callout: {
    backgroundColor: '#ffffffee',
    padding: 10,
    borderRadius: 8,
    maxWidth: 250,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#d32f2f',
  },
  calloutDesc: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  calloutImage: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  calloutTime: {
    fontSize: 12,
    color: '#555',
  },
  calloutDistance: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  picker: {
    height: 40,
    flex: 1,
  },
  reloadButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1e88e5',
    borderRadius: 6,
  },
  reloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapComponent;

