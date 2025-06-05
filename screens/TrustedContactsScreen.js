import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const TrustedContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const stored = await AsyncStorage.getItem('trusted_contacts');
    const list = stored ? JSON.parse(stored) : [];
    setContacts(list);
  };

  const saveContacts = async (list) => {
    await AsyncStorage.setItem('trusted_contacts', JSON.stringify(list));
    setContacts(list);
  };

  const addContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Erro', 'Preencha nome e telefone.');
      return;
    }
    const newContact = {
      id: Date.now().toString(),
      name,
      phone
    };
    const updated = [...contacts, newContact];
    saveContacts(updated);
    setName('');
    setPhone('');
  };

  const removeContact = (id) => {
    Alert.alert('Remover', 'Deseja excluir este contato?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        onPress: () => {
          const updated = contacts.filter((c) => c.id !== id);
          saveContacts(updated);
        },
        style: 'destructive'
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Contatos de Confiança</Text>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Nome"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Telefone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addContact}>
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactText}>{item.name}</Text>
                <Text style={styles.contactSub}>{item.phone}</Text>
              </View>
              <TouchableOpacity onPress={() => removeContact(item.id)}>
                <Feather name="trash" size={20} color="#e53935" />
              </TouchableOpacity>
            </View>
          )}
        />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactSub: {
    fontSize: 14,
    color: '#666',
  },
});

export default TrustedContactsScreen;
