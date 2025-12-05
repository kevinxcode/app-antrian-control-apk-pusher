import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const UrlInputScreen = ({ onNavigate }) => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastActiveUrl, setLastActiveUrl] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadHistory();
    checkLastSession();
  }, []);

  const checkLastSession = async () => {
    try {
      const lastUrl = await AsyncStorage.getItem('lastActiveUrl');
      if (lastUrl) {
        setLastActiveUrl(lastUrl);
      }
    } catch (error) {
      console.log('Error checking session:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('urlHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const saveToHistory = async (newUrl) => {
    try {
      const updatedHistory = [newUrl, ...history.filter(item => item !== newUrl)].slice(0, 10);
      setHistory(updatedHistory);
      await AsyncStorage.setItem('urlHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Error saving history:', error);
    }
  };

  const handleSubmit = () => {
    if (url.trim()) {
      const formattedUrl = url.startsWith('http') ? url : `http://${url}`;
      saveToHistory(formattedUrl);
      onNavigate(formattedUrl);
    }
  };

  const selectFromHistory = (selectedUrl) => {
    setUrl(selectedUrl);
    onNavigate(selectedUrl);
  };

  const continueLastSession = () => {
    onNavigate(lastActiveUrl);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>🚀 Control Panel</Text>
        <Text style={styles.subtitle}>Sistem Antrian</Text>
      </View>
      
      <View style={styles.card}>
        {lastActiveUrl && (
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>🔄 Session Aktif</Text>
            <Text style={styles.sessionUrl} numberOfLines={1}>{lastActiveUrl}</Text>
            <TouchableOpacity style={styles.continueButton} onPress={continueLastSession}>
              <Text style={styles.continueButtonText}>Lanjutkan Session</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Masukkan URL server"
            placeholderTextColor="#999"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.guideText}>Contoh: 192.168.1.100:8080</Text>
        
        <TouchableOpacity 
          style={styles.historyToggle} 
          onPress={() => setShowHistory(!showHistory)}
        >
          <Text style={styles.historyToggleText}>
            📋 {showHistory ? 'Sembunyikan' : 'History'}
          </Text>
        </TouchableOpacity>
      </View>

      {showHistory && (
        <View style={styles.historyCard}>
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.historyItem} 
                onPress={() => selectFromHistory(item)}
              >
                <Text style={styles.historyText}>{item}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Belum ada history</Text>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#667eea',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyToggle: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  historyToggleText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  historyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  historyItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    padding: 30,
  },
  guideText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  sessionCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 5,
  },
  sessionUrl: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UrlInputScreen;