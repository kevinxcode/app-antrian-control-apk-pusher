import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WebViewScreen = ({ url, onBack }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
        >
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
      </View>
      <WebView source={{ uri: url }} style={styles.webview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;