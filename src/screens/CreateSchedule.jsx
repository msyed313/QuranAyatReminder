import React, { useState } from 'react';
import {
  View, Button, Text, Platform, Alert, Modal, StyleSheet, ImageBackground, Image, Pressable,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
const { width, height } = Dimensions.get('window')

const CreateSchedule = ({ navigation }) => {
  const [selectedday, setSelectedDay] = useState('select day');
  const [modalVisible, setModalVisible] = useState(false);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };
  const scheduleReminder = () => {
    const now = new Date();
    const reminderDate = new Date(now);

    reminderDate.setDate(now.getDate() + ((days.indexOf(selectedday) + 7 - now.getDay()) % 7));
    reminderDate.setHours(time.getHours());
    reminderDate.setMinutes(time.getMinutes());
    reminderDate.setSeconds(0);

    if (reminderDate < now) {
      reminderDate.setDate(reminderDate.getDate() + 7);
    }

    /*PushNotification.localNotificationSchedule({
      message: `Reminder for ${selectedDay}`,
      date: reminderDate,
    });*/

    Alert.alert('Reminder Scheduled', `Reminder set for ${selectedday} at ${time.toLocaleTimeString()}`);
  };
  return (
    <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.bgImage}>
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
              <Pressable>
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
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Pressable style={styles.send} onPress={scheduleReminder}>
        <Text style={styles.sendText}>Set Schedule</Text>
      </Pressable>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </ImageBackground>
  )
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
    marginBottom: height * 0.01,
    //backgroundColor:'red',
    marginTop: height * 0.03
  },
  text: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: 'black',

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
    height: '100%'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    //backgroundColor: 'red',
    alignSelf: 'center'
  },
  modalView: {
    width: '100%',
    height: '50%',
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
})
export default CreateSchedule