import React, { useEffect, useState } from 'react';
import {
  View, Button, Text, Platform, Alert, Modal, StyleSheet, ImageBackground, Image, Pressable,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from './Header';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqlite from 'react-native-sqlite-storage';

const { width, height } = Dimensions.get('window');

const CreateSchedule = ({ navigation }) => {
  const [selectedday, setSelectedDay] = useState('Sunday');
  const [modalVisible, setModalVisible] = useState(false);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedtopic, setSelectedTopic] = useState('topic');
  const [topicmodal, setTopicModal] = useState(false);
  const [ayattopiclist, setAyatTopicList] = useState([]);
  const [selectedtopicid, setSelectedTopicId] = useState(0);
  const [modal, setModal] = useState(false);
  const [selectedlanguage, setSelectedLanguage] = useState('English');
  const [selectedtable, setSelectedTable] = useState('Translation');
  const [repeatType, setRepeatType] = useState(null)
  const languages = [
    {
      lang: 'Urdu',
      t_nam: 'quran_urdu'
    },
    {
      lang: 'Arabic',
      t_nam: 'Quran'
    }
  ];
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  useEffect(() => {
    getAyatTopics();
    checkAndCreateChannel();
  }, []);

  const checkAndCreateChannel = async () => {
    const channelCreated = await AsyncStorage.getItem('channelCreated');
    if (!channelCreated) {
      PushNotification.createChannel(
        {
          channelId: "ayat-channel",
          channelName: "Ayat Notifications",
          channelDescription: "A channel to send Ayat notifications",
          importance: 4,
          vibrate: true,
          playSound: true,
          soundName: 'default',
        },
        (created) => {
          if (created) {
            AsyncStorage.setItem('channelCreated', 'true');
            console.log('Notification channel created');
          }
        }
      );
    }
  };

  const scheduleReminder = async () => {
    let db = await sqlite.openDatabase({ name: 'demo.db' });

    const dayIndex = days.indexOf(selectedday);
    const now = new Date();
    const reminderDate = new Date(now);

    // Set the time for the reminder
    reminderDate.setHours(time.getHours());
    reminderDate.setMinutes(time.getMinutes());
    reminderDate.setSeconds(0);

    // Calculate the number of days until the next occurrence of the selected day
    /* const daysUntilReminder = (dayIndex + 7 - now.getDay()) % 7;
 
     // Set the reminder date to the next occurrence of the selected day
     if (daysUntilReminder === 0 && reminderDate < now) {
         // If today is the selected day but the time has already passed, schedule it for next week
         reminderDate.setDate(reminderDate.getDate() + 7);
     } else {
         reminderDate.setDate(reminderDate.getDate() + daysUntilReminder);
     }
 
     */
    // Schedule the notification
    PushNotification.localNotificationSchedule({
      channelId: "ayat-channel",
      message: `${selectedday}`,
      date: reminderDate,
      allowWhileIdle: true,
      title: selectedtopic,
      repeatType: repeatType, 
      //number:selectedlanguage,// Repeat every week
      data: {
        topicid: selectedtopicid,
        day: selectedday,
        language: selectedtable,
      }
    });

    // Save the schedule into the SQLite database
    /*    db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO myschedule (Topic, Day, Language, Time) VALUES (?, ?, ?, ?)',
            [selectedtopic, selectedday, selectedlanguage, time.toLocaleTimeString()],
            (tx, results) => {
              console.log('Schedule saved successfully');
            },
            error => {
              console.log('Error saving schedule: ', error);
            }
          );
        });*/

    Alert.alert(`Reminder set for ${selectedday} at ${time.toLocaleTimeString()} and will repeat ${repeatType}.`);
  };

  async function getAyatTopics() {
    let db = await sqlite.openDatabase({
      name: 'CompleteQuran.db',
      location: 'default',
      createFromLocation: '~CompleteQuran.db'
    });
    db.transaction(function (t) {
      t.executeSql(
        'SELECT * FROM Topic ORDER BY LOWER(topicName) ASC',
        [],
        (tx, resultSet) => {
          let topics = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            topics.push(resultSet.rows.item(i));
          }
          setAyatTopicList(topics); // Update state using setter function
        },
        e => {
          console.log(JSON.stringify(e));
        },
      );
    });
  }

  return (
    <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.bgImage}>
      <Header navigation={navigation} />
      <Text style={styles.heading}>Create Ayat Schedule</Text>
      <View style={styles.view}>
        <Text style={styles.text}>Select Time</Text>
        <Pressable onPress={() => setShowTimePicker(true)} >
          <TextInput
            style={styles.input}
            editable={false}
            value={time.toLocaleTimeString()}
            placeholder="Select Date"
          />
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>
      <View style={styles.view}>
        <Text style={styles.text}>Select Day</Text>
        <Pressable style={styles.press2} onPress={() => setModalVisible(true)}>
          <Text style={{ fontSize: width * 0.05, color: 'black' }}>{selectedday}</Text>
          <Image
            source={require('../assets/down.png')}
            style={{ width: width * 0.1, height: width * 0.1 }}
          />
        </Pressable>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              {days.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => [
                    setModalVisible(false),
                    setSelectedDay(item),
                  ]}>
                  <Text style={styles.modalText}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.view}>
        <Text style={styles.text}>Select Topic</Text>
        <Pressable style={styles.press2} onPress={() => setTopicModal(true)}>
          <Text style={{ fontSize: width * 0.05, color: 'black', textAlign: 'justify' }}>{selectedtopic}</Text>
          <Image
            source={require('../assets/down.png')}
            style={{ width: width * 0.1, height: width * 0.1 }}
          />
        </Pressable>
      </View>

      <Modal animationType="slide" transparent={true} visible={topicmodal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              {ayattopiclist.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setTopicModal(false);
                    setSelectedTopic(item.topicName);
                    setSelectedTopicId(item.topicId)
                  }}>
                  <Text style={styles.modalText}>{item.topicName}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.view}>
        <Text style={styles.text}>Select Language</Text>
        <Pressable style={styles.press2} onPress={() => setModal(true)}>
          <Text style={{ fontSize: width * 0.05, color: 'black' }}>{selectedlanguage}</Text>
          <Image
            source={require('../assets/down.png')}
            style={{ width: width * 0.1, height: width * 0.1 }}
          />
        </Pressable>
      </View>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { height: '30' }]}>
            <ScrollView>
              {languages.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => [
                    setModal(false),
                    setSelectedLanguage(item.lang),
                    setSelectedTable(item.t_nam)
                  ]}>
                  <Text style={styles.modalText}>{item.lang}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Pressable style={styles.send} onPress={scheduleReminder}>
        <Text style={styles.sendText}>Set Schedule</Text>
      </Pressable>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.languageButton}
          onPress={() => setRepeatType(null)}
        >
          <View style={repeatType == null ? styles.selectedLanguageButtonView : styles.languageButtonView}></View>
          <Text style={styles.languageText}>Once</Text>
        </Pressable>
        <Pressable
          style={styles.languageButton}
          onPress={() => setRepeatType('week')}
        >
          <View style={repeatType == 'week' ? styles.selectedLanguageButtonView : styles.languageButtonView}></View>
          <Text style={styles.languageText}>Weekly</Text>
        </Pressable>
        <Pressable
          style={styles.languageButton}
          onPress={() => setRepeatType('month')}
        >
          <View style={repeatType == 'month' ? styles.selectedLanguageButtonView : styles.languageButtonView}></View>
          <Text style={styles.languageText}>Monthly</Text>
        </Pressable>
      </View>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    alignItems: 'center'
  },
  heading: {
    fontSize: width * 0.08,
    fontWeight: '500',
    marginVertical: height * 0.02,
    color: 'blue'
  },
  view: {
    width: '90%',
    height: width * 0.15,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: width * 0.05,
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
    //backgroundColor:'red',
    //marginTop: height * 0.03
  },
  text: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: 'black',
    width: '50%'
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    color: 'black',
    fontSize: width * 0.05
  },
  press2: {
    width: '50%',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.03,
    backgroundColor: 'white',
    //height: '100%'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    //backgroundColor: 'red',
    alignSelf: 'center'
  },
  modalView: {
    width: '100%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width * 0.1,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: width * 0.03,
    textAlign: 'center',
    fontSize: width * 0.07,
    color: 'black',
    borderBottomWidth: 2,
    padding: width * 0.03,
    borderColor: 'red',
  },
  send: {
    backgroundColor: '#7E25D7',
    width: '50%',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: width * 0.02,
    marginTop: height * 0.02,
  },
  sendText: {
    fontSize: width * 0.055,
    color: 'white',
    fontWeight: '500'
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
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '90%',
  },
  languageButton: {
    padding: 10,
    borderRadius: 12,
    width: '30%',
    alignItems: 'center',
    //backgroundColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 10
  },
  languageText: {
    fontSize: width * 0.05,
    color: 'black',
    fontWeight: '600'
  },
  languageButtonView: {
    width: width * 0.04,
    height: width * 0.04,
    backgroundColor: 'lightblue',
    borderRadius: 30
  },
  selectedLanguageButtonView: {
    width: width * 0.04,
    height: width * 0.04,
    backgroundColor: 'blue',
    borderRadius: 30
  }
})
export default CreateSchedule;
