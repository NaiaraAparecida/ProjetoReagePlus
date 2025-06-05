import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ReportHistoryScreen = () => {
  const [reports, setReports] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadReports = async () => {
      const stored = await AsyncStorage.getItem('reports');
      if (stored) {
        setReports(JSON.parse(stored).reverse());
      }
    };
    const unsubscribe = navigation.addListener('focus', loadReports);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <Text style={styles.description}>{item.description}</Text>
      {item.location && (
        <Text style={styles.location}>
          Lat: {item.location.latitude.toFixed(4)} | Long: {item.location.longitude.toFixed(4)}
        </Text>
      )}
      <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1e88e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Ocorrências</Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e88e5',
    marginLeft: 12
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  location: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4
  },
  date: {
    fontSize: 12,
    color: '#777'
  }
});

export default ReportHistoryScreen;
