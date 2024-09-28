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
  const [ayatTextList, setAyatTextList] = useState([]);
  const [isArabicSelected, setIsArabicSelected] = useState(true);
  const [isUrduSelected, setIsUrduSelected] = useState(false);
  const [isEnglishSelected, setIsEnglishSelected] = useState(false);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
  const [aName, setAName] = useState();
  const [uName, setUName] = useState()
  const [count, setCount] = useState(0)
  useEffect(() => {
   // getAyatTopics()
    getAyatTopicsByCount()
  }, [count]);
  async function getAyatTopicsByCount() {
    let db = await sqlite.openDatabase({
      name: 'CompleteQuran.db',
      location: 'default',
      createFromLocation: '~CompleteQuran.db'
    });
    db.transaction(function (t) {
      t.executeSql(
        'SELECT * FROM Topic ORDER BY count DESC',
        [],
        (tx, resultSet) => {
          let topics = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            topics.push(resultSet.rows.item(i));
            // console.log(resultSet.rows.item(i).count);

          }
          console.log(resultSet.rows.length);

          setAyatTopicList(topics); // Update state using setter function
        },
        e => {
          console.log(JSON.stringify(e));
        },
      );
    });
  }

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
            // console.log(resultSet.rows.item(i).count);

          }
          console.log(resultSet.rows.length);

          setAyatTopicList(topics); // Update state using setter function
        },
        e => {
          console.log(JSON.stringify(e));
        },
      );
    });
  }

  const getTopicAyat = async (selectedTopicIndex) => {
    //console.log(selectedTopicIndex);

    let db = await sqlite.openDatabase({
      name: 'CompleteQuran.db',
      location: 'default',
      createFromLocation: '~CompleteQuran.db',
    });
    return new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT surahId, ayatId FROM topicAyat WHERE topicId = ?',
          [selectedTopicIndex],
          (tx, resultSet) => {
            let topicAyatList = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
              topicAyatList.push({
                surahId: resultSet.rows.item(i).surahId,
                ayatId: resultSet.rows.item(i).ayatId,
              });
            }
            resolve(topicAyatList);
            // console.log(topicAyatList);


          }
        );
      });
    });
  };

  const getAyatText = async (ayatPairs, table) => {
    let db = await sqlite.openDatabase({
      name: 'CompleteQuran.db',
      location: 'default',
      createFromLocation: '~CompleteQuran.db',
    });
    console.log(table);

    return new Promise((resolve, reject) => {
      let ayatTexts = []; // Store fetched Ayat texts here

      db.transaction((tx) => {
        let query;
        if (table == 'Translation') {
          query = `SELECT T.EnglishText, S.surah_Urdu_Names, T.AyahRef,T.SurahRef
                   FROM ${table} T 
                   JOIN surahs S ON T.SurahRef = S.Id 
                   WHERE (T.SurahRef = ? AND T.AyahRef = ?)`;
        } else {
          query = `SELECT T.AyahText, S.surah_Urdu_Names, T.VerseID ,T.SuraID
                   FROM ${table} T 
                   JOIN surahs S ON T.SuraID = S.Id 
                   WHERE (T.SuraID = ? AND T.VerseID = ?)`;
        }

        // Iterate over Ayat pairs and fetch the data for each one
        let remaining = ayatPairs.length;
        ayatPairs.forEach((pair) => {
          tx.executeSql(
            query,
            [pair.surahId, pair.ayatId],
            (tx, resultSet) => {
              if (resultSet.rows.length > 0) {
                const row = resultSet.rows.item(0);
                //console.log(row);
                ayatTexts.push({
                  surahName: row.surah_Urdu_Names,
                  ayatId: table == 'Translation' ? row.AyahRef : row.VerseID,
                  ayatText: table == 'Translation' ? row.EnglishText : row.AyahText,
                  surahId: table == 'Translation' ? row.SurahRef : row.SuraID,
                });
              }

              // When all pairs are processed, resolve the promise with the fetched Ayat texts
              remaining--;
              if (remaining === 0) {
                resolve(ayatTexts);
              }
            },
            (tx, error) => {
              reject(error);
            }
          );
        });
      });
    });
  };


  const handleTopicSelect = async (index) => {
    setSelectedTopicIndex(index);

    // Check which language is currently selected and select the corresponding table
    let table = 'Quran'; // Default Arabic table
    if (isUrduSelected) {
      table = 'quran_urdu'; // Urdu table
    } else if (isEnglishSelected) {
      table = 'Translation'; // English table
    }

    const topicAyat = await getTopicAyat(index);  // Get the Ayat for selected topic
    const ayatTexts = await getAyatText(topicAyat, table); // Get the Ayat texts based on the selected language
    setAyatTextList(ayatTexts);
    setModalVisible(false);
  };

  const handleLanguageSelect = async (language) => {
    let table = 'Translation';
    if (language === 'urdu') {
      table = 'quran_urdu'; // Urdu table
    } else if (language === 'arabic') {
      table = 'Quran'; // Arabic table
    }
    const topicAyat = await getTopicAyat(selectedTopicIndex);
    const ayatTexts = await getAyatText(topicAyat, table);
    setAyatTextList(ayatTexts);

    setIsArabicSelected(language === 'arabic');
    setIsUrduSelected(language === 'urdu');
    setIsEnglishSelected(language === 'english');
  };

  async function getTopicDetail(topicname) {
    let db = await sqlite.openDatabase({
      name: 'CompleteQuran.db',
      location: 'default',
      createFromLocation: '~CompleteQuran.db'
    });
    db.transaction(function (t) {
      t.executeSql(
        'select * from Topic Where topicName =?',
        [topicname],
        (tx, resultSet) => {
          // console.log('get All Data');
          const paths = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            // paths.push(results.rows.item(i).t_candy_path);
            console.log(resultSet.rows.item(i).uName)
            setAName(resultSet.rows.item(i).aName)
            setUName(resultSet.rows.item(i).uName)
          }
        },
        (e) => {
          console.log(JSON.stringify(e));
        },
      );
    });
  }

  // Highlight matching words function
  const highlightText = (text, topicName) => {
    const words = text.split(' ');
    return words.map((word, index) => {
      const isHighlighted = word.toLowerCase().includes(topicName.toLowerCase());
      return (
        <Text key={index} style={isHighlighted ? styles.highlightedText : styles.normalText}>
          {word + ' '}
        </Text>
      );
    });
  };
  async function updateData(count, id) {
    let db = await sqlite.openDatabase({
      name: 'CompleteQuran.db',
      location: 'default',
      createFromLocation: '~CompleteQuran.db',
    });
    db.transaction(function (t) {
      t.executeSql(
        `update Topic set count = ? Where topicId=${id}`,
        [count + 1],
        (tx, resultSet) => {
          console.log(JSON.stringify(resultSet));
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
      <Text style={styles.heading}>Ayat Topic List</Text>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={()=>getAyatTopicsByCount()}>
          <Text style={styles.buttonText}> Most searched</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={()=>getAyatTopics()}>
          <Text style={styles.buttonText}>Any topic</Text>
        </Pressable>

      </View>


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
                    setSelectedTopic(item.topicName);
                    handleTopicSelect(item.topicId)
                    getTopicDetail(item.topicName)
                    updateData(item.count, item.topicId)
                    setCount(count + 1)
                  }}>
                  <Text style={styles.modalText}>{item.topicName}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.languageButton, isArabicSelected && styles.selectedLanguage]}
          onPress={() => handleLanguageSelect('arabic')}
        >
          <Text style={styles.languageText}>Arabic</Text>
        </Pressable>
        <Pressable
          style={[styles.languageButton, isUrduSelected && styles.selectedLanguage]}
          onPress={() => handleLanguageSelect('urdu')}
        >
          <Text style={styles.languageText}>Urdu</Text>
        </Pressable>
        <Pressable
          style={[styles.languageButton, isEnglishSelected && styles.selectedLanguage]}
          onPress={() => handleLanguageSelect('english')}
        >
          <Text style={styles.languageText}>English</Text>
        </Pressable>
      </View>
      {selectedtopic !== 'Select Topic' && (
        <View style={{ height: '50%' }}>
          <ScrollView style={styles.ayatList}>
            {ayatTextList
              .map((ayat, index) => (
                <Pressable key={index}>
                  <View style={styles.ayatContainer} >
                    <Text style={styles.surahText}>Surah: {ayat.surahName} | Ayat: {ayat.ayatId}</Text>
                    <Text style={styles.ayatText}>{ayat.ayatText}</Text>
                  </View>
                </Pressable>
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
    marginBottom: height * 0.01,
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
    width: '80%',
    alignSelf: 'center'
  },
  modalView: {
    width: '100%',
    height: '80%',
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
    backgroundColor: 'grey',
  },
  selectedLanguage: {
    backgroundColor: 'blue',
    borderColor: '#1E88E5',
    borderWidth: 1,
  },
  languageText: {
    fontSize: width * 0.04,
    color: 'white',
  },
  surahText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 5,
  },
  highlightedText: {
    color: 'red', // Color for highlighted words
    fontWeight: 'bold',
  },
  normalText: {
    color: 'black',
  },
  buttonView:{
    flexDirection:'row',
    justifyContent:'space-between',
    //gap:10,
    alignItems:'center',
    marginBottom:height*0.01,
    height:height*0.07,
    width:'85%'
  },
  button:{
    backgroundColor:'#7E25D7',
    width:'48%',
    padding:5,
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
  },
  buttonText:{
    fontSize:width*0.05,
    color:'white',
    fontWeight:'500'
  }
});

export default AyatTopics;
