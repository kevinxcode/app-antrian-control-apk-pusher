import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UrlInputScreen from './UrlInputScreen';
import WebViewScreen from './WebViewScreen';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState('');

  const handleNavigateToWebView = (url) => {
    setCurrentUrl(url);
  };

  const handleBackToInput = () => {
    setCurrentUrl('');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {currentUrl ? (
        <WebViewScreen 
          url={currentUrl} 
          onBack={handleBackToInput} 
        />
      ) : (
        <UrlInputScreen 
          onNavigate={handleNavigateToWebView} 
        />
      )}
    </SafeAreaProvider>
  );
}