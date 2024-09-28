import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import React from 'react';
import Header from './Header';
import { useNavigation, useRoute } from '@react-navigation/native';
const ScheduleAyats = ({navigation}) => {
  const [translationToggle, setTranslationToggle] = useState([]);
  const [selectedTable, setSelectedTable] = useState('Translation');
  const [surahNames, setSurahNames] = useState([]);
  //const { topic, ayat, day } = route.params; // Destructure the passed parameters
  /*
    onPress={async () => {
                    if (isArabicSelected) {
                      const translation = await getRomanArabicTranslation(ayat.surahId, ayat.ayatId);
                      alert(`${translation}`);
                    }
                  }}
  */ 
                  const getRomanArabicTranslation = async (surahId, ayatId) => {
                    let db = await sqlite.openDatabase({
                      name: 'CompleteQuran.db',
                      location: 'default',
                      createFromLocation: '~CompleteQuran.db',
                    });
                
                    return new Promise((resolve, reject) => {
                      db.transaction((tx) => {
                        tx.executeSql(
                          'SELECT Translation FROM RomanArabic WHERE SurahId = ? AND AyatId = ?',
                          [surahId, ayatId],
                          (tx, resultSet) => {
                            if (resultSet.rows.length > 0) {
                              const row = resultSet.rows.item(0);
                              resolve(row.Translation);
                            } else {
                              resolve('Translation not found');
                            }
                          },
                          (tx, error) => {
                            reject(error);
                          }
                        );
                      });
                    });
                  };
    /*
    async function searchAyatTopics(searchTerm) {
  let db = await sqlite.openDatabase({
    name: 'CompleteQuran.db',
    location: 'default',
    createFromLocation: '~CompleteQuran.db'
  });

  db.transaction(function (t) {
    t.executeSql(
      'SELECT * FROM Topic WHERE topicName LIKE ? ORDER BY LOWER(topicName) ASC',
      [`%${searchTerm}%`], // Using parameterized query to prevent SQL injection
      (tx, resultSet) => {
        let topics = [];
        for (let i = 0; i < resultSet.rows.length; i++) {
          topics.push(resultSet.rows.item(i));
        }
        console.log(resultSet.rows.length);
        // console.log(topics);
        
        setAyatTopicList(topics); // Update state using setter function
      },
      e => {
        console.log(JSON.stringify(e));
      },
    );
  });
}
 */            
  return (
    <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.bgImage}>
      
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
