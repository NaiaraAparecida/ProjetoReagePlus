// Substitua seu ReportList.js por este

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, TextInput, Share, Platform, StatusBar, SafeAreaView, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchType, setSearchType] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    handleFilter(searchType);
  }, [reports, searchType]);

  const loadReports = async () => {
    const stored = await AsyncStorage.getItem('reports');
    const data = stored ? JSON.parse(stored) : [];
    const reversed = [...data].reverse();
    setReports(reversed);
    setFilteredReports(reversed);
  };

  const handleFilter = (text) => {
    setSearchType(text);
    if (text.trim() === '') {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter((item) =>
        item.type.toLowerCase().includes(text.trim().toLowerCase())
      );
      setFilteredReports(filtered);
    }
  };

  const deleteReport = async (id) => {
    Alert.alert('Excluir', 'Deseja realmente excluir esta ocorrência?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const filtered = reports.filter((item) => item.id !== id);
          await AsyncStorage.setItem('reports', JSON.stringify(filtered.reverse()));
          setReports(filtered);
        }
      }
    ]);
  };

  const exportToJSON = async () => {
    try {
      const stored = await AsyncStorage.getItem('reports');
      const content = stored ? JSON.stringify(JSON.parse(stored), null, 2) : '{}';
      await Share.share({
        message: content,
        title: 'Ocorrências exportadas',
      });
    } catch (error) {
      Alert.alert('Erro ao exportar', 'Não foi possível exportar os dados.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.headerRow}>
        <Feather name="alert-triangle" size={20} color="#d32f2f" />
        <Text style={styles.type}>{item.type}</Text>
        <TouchableOpacity onPress={() => deleteReport(item.id)}>
          <MaterialIcons name="delete" size={24} color="#e53935" />
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{item.description}</Text>

      {/* Imagem */}
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.reportImage} />
      )}

      {/* Localização */}
      {item.location && (
        <Text style={styles.locationText}>
          📍 Lat: {item.location.latitude.toFixed(5)}, Lon: {item.location.longitude.toFixed(5)}
        </Text>
      )}

      <Text style={styles.timestamp}>
        <Feather name="clock" size={14} /> {item.timestamp}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>📋 Ocorrências Registradas</Text>

        <TextInput
          style={styles.input}
          placeholder="🔎 Filtrar por tipo (ex: enchente)"
          value={searchType}
          onChangeText={handleFilter}
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={exportToJSON}>
            <Feather name="share" size={16} color="#fff" />
            <Text style={styles.actionText}>Exportar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={() => {
            Alert.alert('Função temporariamente desativada');
          }}>
            <Feather name="trash-2" size={16} color="#fff" />
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        {filteredReports.length === 0 ? (
          <Text style={styles.empty}>Nenhuma ocorrência encontrada.</Text>
        ) : (
          <FlatList
            data={filteredReports}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
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
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  empty: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  item: {
    backgroundColor: '#f9fbe7',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 6,
  },
  description: {
    fontSize: 15,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#555',
  },
  reportImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e88e5',
    padding: 10,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9e9e9e',
    padding: 10,
    borderRadius: 8,
  },
  clearText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ReportList;





