import { View, Text, ImageBackground, StyleSheet, ScrollView, Dimensions, Pressable,Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './Header';
import PushNotification from 'react-native-push-notification';
import sqlite from 'react-native-sqlite-storage';

const { width, height } = Dimensions.get('window');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MySchedules = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [sortedNotifications, setSortedNotifications] = useState([]);

  useEffect(() => {
    //getSchedules();
    PushNotification.getScheduledLocalNotifications((notifications) => {
      console.log('Scheduled Notifications:', notifications);
      setNotifications(notifications);
      setSortedNotifications(sortByWeekday(notifications));
    });
  }, []);

  async function getSchedules() {
    let db = await sqlite.openDatabase({ name: 'demo.db' });
    db.transaction(function (t) {
      t.executeSql(
        'SELECT * FROM MySchedule',
        [],
        (tx, resultSet) => {
          // console.log('Database Results:', resultSet.rows.raw());
        },
        (error) => {
          console.error('Error fetching schedules:', error);
          alert('Failed to fetch schedules.');
        }
      );
    });
  }
  const handleDelete = (id) => {
    // Cancel the specific notification
    PushNotification.cancelLocalNotification({ id: id.toString() });

    // Update the state to remove the deleted notification from the list
    const updatedNotifications = notifications.filter((item) => item.id !== id);
    setNotifications(updatedNotifications);
    setSortedNotifications(sortByWeekday(updatedNotifications));
  };
  function sortByWeekday(notifications) {
    const grouped = notifications.reduce((acc, item) => {
      const date = new Date(item.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    }, {});

    return weekdays.reduce((acc, day) => {
      if (grouped[day]) {
        acc.push(...grouped[day]);
      }
      return acc;
    }, []);
  }

  return (
    <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.bgImage}>
      <Header navigation={navigation} />
      <View style={styles.container}>
        <ScrollView horizontal>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeaderView}>
              <Text style={styles.tableHeaderText}>Srno</Text>
              <Text style={styles.tableHeaderText}>Day</Text>
              <Text style={styles.tableHeaderText}>Topic</Text>
              <Text style={styles.tableHeaderText}>Time</Text>
              <Text style={styles.tableHeaderText}>Action</Text>
            </View>
            <ScrollView style={{ width: '100%' }}>
              {sortedNotifications.map((item, index) => {
                const date = new Date(item.date);
                const timeString = date.toLocaleTimeString();
                return (
                  <View key={index} style={[styles.tableRowView, index % 2 && styles.tableRowAlt]}>
                    <Text style={styles.tableRowText}>{index + 1}</Text>
                    <Text style={styles.tableRowText}>{item.message}</Text>
                    <Text style={styles.tableRowText}>{item.title}</Text>
                    <Text style={styles.tableRowText}>{timeString}</Text>
                    <View style={[styles.tableRowText, { flexDirection: 'row', justifyContent: 'center' }]}>
                    <Pressable style={styles.action} onPress={() => navigation.navigate('editschedule', { id: item.id })}>
                      <Image source={require('../assets/edit.png')} style={{ tintColor: 'blue' }} />
                    </Pressable>
                    <Pressable style={styles.action} onPress={() => handleDelete(item.id)}>
                      <Image source={require('../assets/delete.png')} style={{ tintColor: 'red' }} />
                    </Pressable>
                  </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  container: {
    width: width, // Ensures the container spans the full screen width
    //paddingHorizontal: 2, // Optional padding
  },
  tableContainer: {
    width: width * 1.1, // Set a wider width for scrolling
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  tableHeaderView: {
    flexDirection: 'row',
    backgroundColor: '#28b5b5',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    justifyContent: 'space-around',
  },
  tableHeaderText: {
    fontSize: width * 0.06,
    color: 'black',
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
  },
  tableRowView: {
    flexDirection: 'row',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    justifyContent: 'space-around',
    gap: width * 0.02,
    height: height * 0.11,
  },
  tableRowAlt: {
    backgroundColor: '#f2f2f2',
  },
  tableRowText: {
    fontSize: width * 0.045,
    color: 'black',
    fontWeight: '500',
    width: '20%',
    textAlign: 'center',
    gap:5
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    height: '40%'
  },
  actionButtonText: {
    fontSize: width * 0.045,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'teal',
    borderRadius: 10,
    width: width * 0.2,
    height: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: width * 0.05,
    color: '#fff',
  },
});

export default MySchedules;
