/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from "react-native-push-notification";
import sqlite from 'react-native-sqlite-storage'
import { Modal, View, Text, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
let setAyatDetails;
let setIsModalVisible;
PushNotification.configure({
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        const { topicid,  day } = notification.data;
        const topic=notification.title
        // Fetch Ayat dynamically when the notification is triggered
        let db = sqlite.openDatabase({ name: 'demo.db' });

        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM E_Ayats WHERE t_id = ? ORDER BY RANDOM() LIMIT 1',
                [topicid],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        const ayat = results.rows.item(0).ayat;
                        const ayatDetails = {
                            ayat,
                            topicid,
                            //language,
                            day,
                            topic
                        };

                         // Add delay before showing the modal
                         setTimeout(() => {
                            setAyatDetails(ayatDetails);
                            setIsModalVisible(true);
                        }, 3000); 
                        
                    } else {
                        console.log('No Ayat found for the selected topic and language');
                    }
                },
                error => {
                    console.log('Error fetching Ayat: ', error);
                }
            );
        });

        // Required on iOS only (to call completion handler)
        //notification.finish(pushNotificationIOS.FetchResult.NoData);
    },
    requestPermissions: Platform.OS === 'ios'
})

const AyatModal = ({ isVisible, ayatDetails, onClose }) => (
    <Modal
        transparent={true}
        visible={isVisible}
        animationType="slide"
        onRequestClose={onClose}
    >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: '90%', padding: 20, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center' }}>
                <Text style={{ fontSize: 25, marginBottom: 10, color: 'black', fontWeight: '500', alignSelf: 'center' }}>Ayat Details</Text>
                {ayatDetails ? (
                    <>
                        <View style={{ flexDirection: 'row', width: '100%', }}>
                            <Text style={{ fontSize: 22, marginBottom: 10, color: 'black', width: '20%', textAlign: 'justify', fontWeight: '500' }}>Day</Text>
                            <Text style={{ fontSize: 20, marginBottom: 10, color: 'black', width: '75%', textAlign: 'justify' }}>{ayatDetails.day}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', }}>
                            <Text style={{ fontSize: 22, marginBottom: 10, color: 'black', width: '20%', textAlign: 'justify', fontWeight: '500' }}>Topic</Text>
                            <Text style={{ fontSize: 20, marginBottom: 10, color: 'black', width: '75%', textAlign: 'justify' }}>{ayatDetails.topic}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', }}>
                            <Text style={{ fontSize: 22, marginBottom: 10, color: 'black', width: '20%', textAlign: 'justify', fontWeight: '500' }}>Ayat</Text>
                            <Text style={{ fontSize: 20, marginBottom: 10, color: 'black', width: '75%', textAlign: 'justify' }}>{ayatDetails.ayat}</Text>
                        </View>

                    </>
                ) : (
                    <Text>No Ayat Found</Text>
                )}
                <Button title="Close" onPress={onClose} />
            </View>
        </View>
    </Modal>
);

const MainApp = () => {
    const [ayatDetails, _setAyatDetails] = useState(null);
    const [isModalVisible, _setIsModalVisible] = useState(false);

    useEffect(() => {
        // Assign global setters
        setAyatDetails = _setAyatDetails;
        setIsModalVisible = _setIsModalVisible;
    }, []);

    return (
        <>
            <App />
            <AyatModal
                isVisible={isModalVisible}
                ayatDetails={ayatDetails}
                onClose={() => setIsModalVisible(false)}
            />
        </>
    );
};

AppRegistry.registerComponent(appName, () => MainApp);
