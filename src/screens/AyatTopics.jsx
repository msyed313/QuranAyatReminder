import { View, Text, ImageBackground, StyleSheet,Modal, Dimensions, Pressable, ScrollView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
const { width, height } = Dimensions.get('window')
const AyatTopics = ({ navigation }) => {
    const [selectedtopic, setSelectedTopic] = useState('Select Topic');
    const [modalVisible, setModalVisible] = useState(false);
    const ayaytopiclist = [
        {
            sr: 1,
            topic: "Prayer"
        },
        {
            sr: 2,
            topic: "Fast"
        },
        {
            sr: 3,
            topic: "Hajj"
        },
        {
            sr: 4,
            topic: "Zakat"
        },
        {
            sr: 5,
            topic: "Jihad"
        },
    ]
    const ayatList = {
        "Prayer": [
            "Indeed, prayer has been decreed upon the believers a decree of specified times.",
            "And establish prayer and give zakah and bow with those who bow [in worship and obedience]."
        ],
        "Fast": [
            "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.",
            "But to fast is best for you, if you only knew."
        ],
        "Hajj": [
            "And complete the Hajj and 'umrah for Allah.",
            "And proclaim to the people the Hajj."
        ],
        "Zakat": [
            "Take, [O, Muhammad], from their wealth a charity by which you purify them and cause them increase.",
            "And establish prayer and give zakah, and whatever good you put forward for yourselves - you will find it with Allah."
        ],
        "Jihad": [
            "And strive for Allah with the striving due to Him.",
            "Indeed, the Mujahideen who strive with their wealth and their lives in the cause of Allah."
        ]
    };
    return (
        <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.bgImage}>
            <Text style={styles.heading}>Ayat Topic List</Text>
            <Pressable style={styles.press2} onPress={() => setModalVisible(true)}>
                <Text style={{ fontSize: width * 0.05, color: 'black' }}>{selectedtopic}</Text>
                <Image
                    source={require('../assets/down.png')}
                    style={{ width: width * 0.1, height: width * 0.1 }}
                />
            </Pressable>
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>

          <View style={styles.modalView}>
            <ScrollView>
              <Pressable>
                {ayaytopiclist.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => [
                      setModalVisible(false),
                      setSelectedTopic(item.topic),
                    ]}>
                    <Text style={styles.modalText}>{item.topic}</Text>
                  </Pressable>
                ))}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {selectedtopic !== 'Select Topic' && (
                <ScrollView style={styles.ayatList}>
                    {ayatList[selectedtopic].map((ayat, index) => (
                        <Text key={index} style={styles.ayatText}>{ayat}</Text>
                    ))}
                </ScrollView>
            )}
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
    listView: {
        width: '90%',
        //backgroundColor:'red',
        marginVertical: height * 0.01,
        flexDirection: 'row',
        gap: width * 0.05,
        padding: width * 0.02,
        alignItems: 'center'
    },
    press2: {
        width: '90%',
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
    listButton: {
        borderWidth: 2,
        width: '50%',
        padding: width * 0.01,
        backgroundColor: 'gray',
        borderColor: 'gray'
    },
    listSr: {
        fontSize: width * 0.07,
        fontWeight: '700',
        color: 'black'
    },
    listText: {
        fontSize: width * 0.06,
        fontWeight: '500',
        color: 'white'
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
        //fontWeight: 'bold',
    },
    ayatList: {
        width: '90%',
        marginTop: height * 0.02,
    },
    ayatText: {
        fontSize: width * 0.05,
        color: 'black',
        marginBottom: width * 0.03,
        borderWidth:2,
        padding:width * 0.03,
        borderRadius: 20,
        backgroundColor:'rgba(205,205,205,0.8)',
        borderColor:'rgba(205,205,205,0.8)'
    },
})
export default AyatTopics