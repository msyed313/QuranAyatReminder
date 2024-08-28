import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import React from 'react';
import Header from './Header';
import { useNavigation, useRoute } from '@react-navigation/native';
const ScheduleAyats = ({navigation}) => {
  //const { topic, ayat, day } = route.params; // Destructure the passed parameters
  

  return (
    <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.bgImage}>
      <Header navigation={navigation} />
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>{topic}</Text> {/* Display the topic */}
        <Text style={styles.ayat}>{ayat}</Text>       {/* Display the ayat */}
        <Text style={styles.day}>{day}</Text>         {/* Display the day */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ayat: {
    fontSize: 18,
    marginBottom: 10,
  },
  day: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default ScheduleAyats;
