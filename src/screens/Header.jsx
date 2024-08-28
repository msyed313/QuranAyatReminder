import { Animated, View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

const { width, height } = Dimensions.get('window');

const Header = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContainer}>
        <Pressable onPress={()=>navigation.navigate('profile')}>
          <Image source={require('../assets/logo.jpeg')} style={styles.logo} />
        </Pressable>
        <Text style={styles.headerText}>Quran Ayat Reminder</Text>
      </View>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: height * 0.02,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: width * 0.1
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  logo: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: 50,
    resizeMode: 'contain',
  },

});
