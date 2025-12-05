import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, BackHandler, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WebViewScreen = ({ url, onBack }) => {
  const insets = useSafeAreaInsets();
  
  const injectedCSS = `
    <style>
      html { color-scheme: light !important; }
      body { background-color: white !important; color: black !important; }
      * { color-scheme: light !important; }
    </style>
  `;
  
  const injectedJS = `
    (function() {
      const meta = document.createElement('meta');
      meta.name = 'color-scheme';
      meta.content = 'light';
      document.head.appendChild(meta);
      
      document.documentElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    })();
    true;
  `;
  const webViewRef = useRef(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  const handleRefresh = () => {
    if (webViewRef.current && !isRefreshing) {
      setIsRefreshing(true);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        rotateAnim.setValue(0);
        setIsRefreshing(false);
      });
      webViewRef.current.reload();
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
        >
          <Text style={styles.backText}>← Keluar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <Animated.Text style={[styles.refreshText, { transform: [{ rotate: spin }] }]}>
            ↻
          </Animated.Text>
          <Text style={styles.refreshText}> Refresh</Text>
        </TouchableOpacity>
      </View>
      <WebView 
        source={{ uri: url }} 
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mixedContentMode="compatibility"
        allowsBackForwardNavigationGestures={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        injectedJavaScript={injectedJS}
        onMessage={() => {}}
        forceDarkOn={false}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('HTTP error: ', nativeEvent);
        }}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  refreshButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 16,
    color: '#007AFF',
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;