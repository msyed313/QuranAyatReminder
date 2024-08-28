import { View, Text, ImageBackground, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
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
                <Pressable
                  style={[styles.tableRowText, styles.action]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </Pressable>
              </View>
            );
          })}
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
  tableContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    // elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginVertical: height * 0.05,
    height: '70%',
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
    //backgroundColor:'red',
    gap:width * 0.07
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
  },
  action: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    height: '50%'
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
