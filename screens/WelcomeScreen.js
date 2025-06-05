import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true
      })
    ]).start();

    const timeout = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/red-plus-icon-5.jpg')}
        style={[styles.logo, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Reage+
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  logo: { width: 160, height: 160, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e88e5' }
});

export default WelcomeScreen;
