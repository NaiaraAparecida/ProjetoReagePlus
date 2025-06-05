import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const CustomTabBarBackground = () => {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="80" viewBox="0 0 400 80">
        <Path
          fill="#ffffffee"
          d="
            M0,0 
            H160 
            C170,0 190,40 200,40 
            C210,40 230,0 240,0 
            H400 
            V80 
            H0 
            Z
          "
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    zIndex: 0,
  }
});

export default CustomTabBarBackground;

