import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from "react-native-push-notification";
import sqlite from 'react-native-sqlite-storage';
import { Modal, View, Text, Button } from 'react-native';
import React, { useState, useEffect } from 'react';

let setAyatDetails;
let setIsModalVisible;

PushNotification.configure({
    onNotification: async function (notification) {
        console.log("NOTIFICATION:", notification);
        const { topicid, day, language } = notification.data;
        const topic = notification.title;

        try {
            // Open the database asynchronously
            const db = await openDatabaseAsync();

            // Perform the database transaction to fetch the Ayat
            const ayatDetails = await getTopicAyat(db, topicid, language, day, topic);

            if (ayatDetails) {
                // Add delay before showing modal
                setTimeout(() => {
                    setAyatDetails(ayatDetails);
                    setIsModalVisible(true);
                }, 3000);
            } else {
                console.log('No Ayat found');
            }
        } catch (error) {
            console.log('Error during notification handling:', error);
        }
    },
    requestPermissions: Platform.OS === 'ios'
});

// Function to open the SQLite database asynchronously
async function openDatabaseAsync() {
    return new Promise((resolve, reject) => {
        let db = sqlite.openDatabase({ name: 'CompleteQuran.db', location: 'default', createFromLocation: '~CompleteQuran.db' },
            () => resolve(db),
            error => reject(error)
        );
    });
}

/*const getTopicAyat = async (db, topicid, language, day, topic) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT surahId, ayatId FROM topicAyat WHERE topicId = ? ORDER BY RANDOM() LIMIT 1',
                [topicid],
                async (tx, resultSet) => {
                    if (resultSet.rows.length > 0) {
                        const surahId = resultSet.rows.item(0).surahId;
                        const ayatId = resultSet.rows.item(0).ayatId;

                        // Fetch the ayat text from the corresponding language table
                        const ayatText = await fetchAyat(db, language, surahId, ayatId);

                        resolve({
                            ayat: ayatText,
                            topicid,
                            day,
                            topic,
                        });
                    } else {
                        resolve(null);
                    }
                },
                (tx, error) => {
                    console.log('Error fetching topic ayat:', error);
                    reject(error);
                }
            );
        });
    });
};*/
const getTopicAyat = async (db, topicid, language, day, topic) => {
    let ayatDetails = null;

    // Get total number of Ayats for this topic
    const totalAyats = await getTotalAyatsForTopic(db, topicid);

    while (!ayatDetails) {
        // Get the count of shown Ayats for this topic
        const shownCount = await getShownAyatsCount(db, topicid);

        // If all Ayats are shown, reset the ShownAyats table for this topic
        if (shownCount >= totalAyats) {
            await resetShownAyatsForTopic(db, topicid);
        }

        const randomAyat = await getRandomAyat(db, topicid);
        
        if (!randomAyat) {
            console.log('No Ayat found');
            return null;
        }

        const { surahId, ayatId } = randomAyat;

        const alreadyShown = await checkIfAyatShown(db, topicid, surahId, ayatId);

        if (!alreadyShown) {
            const ayatText = await fetchAyat(db, language, surahId, ayatId);

            // Save the selected Ayat to ShownAyats table
            await saveShownAyat(db, topicid, surahId, ayatId);

            ayatDetails = {
                ayat: ayatText,
                topicid,
                day,
                topic,
            };
        }
    }

    return ayatDetails;
};

// Function to get total number of Ayats for a topic
async function getTotalAyatsForTopic(db, topicid) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT COUNT(*) AS ayatCount FROM topicAyat WHERE topicId = ?',
                [topicid],
                (tx, resultSet) => {
                    resolve(resultSet.rows.item(0).ayatCount);
                },
                (tx, error) => {
                    console.log('Error fetching total ayats for topic:', error);
                    reject(error);
                }
            );
        });
    });
}

// Function to get count of shown Ayats for a topic
async function getShownAyatsCount(db, topicid) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT COUNT(*) AS shownCount FROM ShownAyats WHERE topicId = ?',
                [topicid],
                (tx, resultSet) => {
                    resolve(resultSet.rows.item(0).shownCount);
                },
                (tx, error) => {
                    console.log('Error fetching shown ayats count:', error);
                    reject(error);
                }
            );
        });
    });
}

// Function to reset shown Ayats for a topic
async function resetShownAyatsForTopic(db, topicid) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM ShownAyats WHERE topicId = ?',
                [topicid],
                (tx, resultSet) => {
                    resolve(true);
                },
                (tx, error) => {
                    console.log('Error resetting shown ayats:', error);
                    reject(error);
                }
            );
        });
    });
}


// Function to get a random Ayat
async function getRandomAyat(db, topicid) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT surahId, ayatId FROM topicAyat WHERE topicId = ? ORDER BY RANDOM() LIMIT 1',
                [topicid],
                (tx, resultSet) => {
                    if (resultSet.rows.length > 0) {
                        resolve(resultSet.rows.item(0));
                    } else {
                        resolve(null);
                    }
                },
                (tx, error) => {
                    console.log('Error fetching random ayat:', error);
                    reject(error);
                }
            );
        });
    });
}

// Function to check if Ayat is already shown
async function checkIfAyatShown(db, topicid, surahId, ayatId) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM ShownAyats WHERE topicId = ? AND surahId = ? AND ayatId = ?',
                [topicid, surahId, ayatId],
                (tx, resultSet) => {
                    resolve(resultSet.rows.length > 0);
                },
                (tx, error) => {
                    console.log('Error checking if ayat is shown:', error);
                    reject(error);
                }
            );
        });
    });
}

// Function to save shown Ayat
async function saveShownAyat(db, topicid, surahId, ayatId) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO ShownAyats (topicId, surahId, ayatId) VALUES (?, ?, ?)',
                [topicid, surahId, ayatId],
                (tx, resultSet) => {
                    resolve(true);
                },
                (tx, error) => {
                    console.log('Error saving shown ayat:', error);
                    reject(error);
                }
            );
        });
    });
}


// Function to fetch an Ayat from the database
async function fetchAyat(db, language, surahId, ayatId) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            let query;
            if (language == 'Translation') {
                query = `SELECT EnglishText FROM ${language} WHERE SurahRef = ? AND AyahRef = ? LIMIT 1`;
            }
            else {
                query = `SELECT AyahText FROM ${language} WHERE SuraId = ? AND VerseId = ? LIMIT 1`;
            }
            tx.executeSql(query, [surahId, ayatId], (tx, resultSet) => {
                if (resultSet.rows.length > 0) {
                    if (language == 'Translation') {
                        resolve(resultSet.rows.item(0).EnglishText);
                    }
                    else {
                        resolve(resultSet.rows.item(0).AyahText);
                    }

                } else {
                    resolve(null);
                }
            }, (tx, error) => {
                console.log('Error fetching Ayat:', error);
                reject(error);
            });
        });
    });
}

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
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={{ fontSize: 22, marginBottom: 10, color: 'black', width: '20%', textAlign: 'justify', fontWeight: '500' }}>Day</Text>
                            <Text style={{ fontSize: 20, marginBottom: 10, color: 'black', width: '75%', textAlign: 'justify' }}>{ayatDetails.day}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={{ fontSize: 22, marginBottom: 10, color: 'black', width: '20%', textAlign: 'justify', fontWeight: '500' }}>Topic</Text>
                            <Text style={{ fontSize: 20, marginBottom: 10, color: 'black', width: '75%', textAlign: 'justify' }}>{ayatDetails.topic}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
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
