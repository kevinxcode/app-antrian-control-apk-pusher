import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import UrlInputScreen from './UrlInputScreen';
import WebViewScreen from './WebViewScreen';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#ffffff');
    loadLastSession();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [currentUrl]);

  const loadLastSession = async () => {
    try {
      const lastUrl = await AsyncStorage.getItem('lastActiveUrl');
      if (lastUrl) {
        setCurrentUrl(lastUrl);
      }
    } catch (error) {
      console.log('Error loading session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = async (url) => {
    try {
      await AsyncStorage.setItem('lastActiveUrl', url);
    } catch (error) {
      console.log('Error saving session:', error);
    }
  };

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem('lastActiveUrl');
    } catch (error) {
      console.log('Error clearing session:', error);
    }
  };

  const handleNavigateToWebView = (url) => {
    setCurrentUrl(url);
    saveSession(url);
  };

  const handleBackToInput = () => {
    setCurrentUrl('');
    clearSession();
  };

  const handleBackPress = () => {
    if (currentUrl) {
      handleBackToInput();
      return true;
    }
    return false;
  };

  if (isLoading) {
    return null;
  }

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