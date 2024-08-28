import { View, Text, ImageBackground, StyleSheet, Modal, Dimensions, Pressable, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from './Header';
import sqlite from 'react-native-sqlite-storage';

const { width, height } = Dimensions.get('window');

const AyatTopics = ({ navigation }) => {
    const [selectedtopic, setSelectedTopic] = useState('Select Topic');
    const [modalVisible, setModalVisible] = useState(false);
    const [ayattopiclist, setAyatTopicList] = useState([]);
    const [ayatslist, setAyatsList] = useState([]);

    useEffect(() => {
        getAyatTopics()
    }, []);

    async function getAyatTopics() {
        let db = sqlite.openDatabase({ name: 'demo.db' });
        db.transaction(function (t) {
            t.executeSql(
                'select * from Topic',
                [],
                (tx, resultSet) => {
                    let topics = [];
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        topics.push(resultSet.rows.item(i));
                        console.log(resultSet.rows.item(i));

                    }
                    setAyatTopicList(topics); // Update state using setter function
                },
                e => {
                    alert(JSON.stringify(e));
                    console.log(JSON.stringify(e));
                },
            );
        });
    }

    async function getAllAyats(id) {
        console.log(id);
        let db = sqlite.openDatabase({ name: 'demo.db' });
        db.transaction(function (t) {
            t.executeSql(
                'select * from U_Ayats where t_id =?',
                [id],
                (tx, resultSet) => {
                    let ayats = [];
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        ayats.push(resultSet.rows.item(i));
                        console.log(resultSet.rows.item(i));

                    }
                    setAyatsList(ayats); // Update state using setter function
                },
                e => {
                    alert(JSON.stringify(e));
                    console.log(JSON.stringify(e));
                },
            );
        });
    }

    return (
        <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.bgImage}>
            <Header navigation={navigation} />
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
                            {ayattopiclist.map((item, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        setModalVisible(false);
                                        setSelectedTopic(item.utopic);
                                        getAllAyats(item.id)
                                    }}>
                                    <Text style={styles.modalText}>{item.utopic}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>



            {selectedtopic !== 'Select Topic' && (
                <View style={{ height: '60%' }}>
                    <ScrollView style={styles.ayatList}>
                        {ayatslist
                            .map((ayat, index) => (
                                <View key={index} style={styles.ayatContainer}>
                                    <Text style={styles.ayatText}>{ayat.ayat}</Text>
                                </View>
                            ))}
                    </ScrollView>
                </View>

            )}

            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
        </ImageBackground>
    );
};

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
    press2: {
        width: '90%',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.03,
        backgroundColor: 'white',
        marginBottom: height * 0.01,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        alignSelf: 'center'
    },
    modalView: {
        width: '100%',
        height: '50%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: width * 0.1,
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
    ayatList: {
        width: '90%',
        marginTop: height * 0.02,

    },
    ayatContainer: {
        marginBottom: width * 0.03,
    },
    ayatText: {
        fontSize: width * 0.05,
        color: 'black',
        borderWidth: 2,
        padding: width * 0.03,
        borderRadius: 20,
        backgroundColor: 'rgba(205,205,205,0.8)',
        borderColor: 'rgba(205,205,205,0.8)'
    },
});

export default AyatTopics;
