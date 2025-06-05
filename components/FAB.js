import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const FAB = ({ onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onPress) onPress();
    });
  };

  return (
    <Animated.View style={[styles.fabWrapper, { transform: [{ scale }] }]}>
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          pressed && { opacity: 0.85 }
        ]}
        onPress={handlePress}
      >
        <Feather name="alert-triangle" size={32} color="#fff" />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 999,
  },
  fab: {
    backgroundColor: '#d32f2f',
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FAB;




