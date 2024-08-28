import { View, Text, ImageBackground, StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import sqlite from 'react-native-sqlite-storage'
const { width, height } = Dimensions.get('window');
const StudentProfile = ({ navigation }) => {
  const [data, setData] = useState({});
  const [imagename, setImageName] = useState();

 useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        const parsedData = JSON.parse(value);
        //console.log(parsedData);
        setData(parsedData);
        //setImageName( parsedData.ImageName);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  const deleteSchedules =async () => {
    try {
      // Cancels all scheduled local notifications
      PushNotification.cancelAllLocalNotifications();
      console.log("All scheduled notifications have been canceled.");
  
      // Remove the stored scheduled notifications from AsyncStorage
      await AsyncStorage.removeItem('user');
      console.log("user data removed");
      let db = sqlite.openDatabase({ name: 'demo.db' });
      db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM MySchedule',
        [],
        (tx, results) => {
         // console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('Record deleted successfully');
          } else {
            alert('No record found with the given name');
          }
        },
        error => {
          console.log('Error', error);
          alert('Error deleting record');
        }
      );
    });
      // Navigate to the 'login' screen
      navigation.navigate('login');
    } catch (error) {
      console.error("Error deleting schedules and AsyncStorage data:", error);
    }
  }
  return (
    <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.main}>
      <View style={styles.container}>
        <View style={styles.profileDetail}>
          <Text style={styles.profileDetailHeading}>Name:</Text>
          <Text style={styles.profileDetailText}>{data.uname || 'msyed'}</Text>
        </View>
        <View style={styles.profileDetail}>
          <Text style={styles.profileDetailHeading}>Email:</Text>
          <Text style={styles.profileDetailText}>{data.email || 'msyed@gmail.com'}</Text>
        </View>
        <Pressable style={styles.backButton} onPress={deleteSchedules}>
          <Text style={styles.backButtonText}>Logout</Text>
        </Pressable>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    padding: width * 0.05,
    alignItems: 'center',
    marginVertical: height * 0.05,
    bottom: 0,
  },
  profileImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    marginTop: -width * 0.125,
  },
  profileDetail: {
    width: '90%',
    padding: height * 0.01,
    marginVertical: height * 0.005,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileDetailHeading: {
    fontSize: width * 0.045,
    color: 'black',
    fontWeight: '600',
    width: '40%',
  },
  profileDetailText: {
    fontSize: width * 0.045,
    color: 'black',
    fontWeight: '400',
    width: '60%',
    textAlign: 'justify',
  },
  backButton: {
    left: 30,
    backgroundColor: 'teal',
    borderRadius: 10,
    width: width * 0.2,
    height: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: width * 0.05,
    color: '#fff',
  },
});

export default StudentProfile;
