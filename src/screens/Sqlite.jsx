import { View, Text, Button } from 'react-native';
import React from 'react';
import sqlite from 'react-native-sqlite-storage';
const Sqlite = () => {
  const l_name = 1
  const addNewColumn = () => {
    let db = sqlite.openDatabase({ name: 'demo.db' });
    db.transaction(tx => {
      tx.executeSql(
        'ALTER TABLE Gamelevels ADD COLUMN Status TEXT',
        [],
        (tx, results) => {
          console.log('Column added successfully');
          alert('Column added successfully');
        },
        error => {
          console.log('Error adding column', error);
          alert('Error adding column');
        }
      );
    });
  };
  const deleteCandy = () => {
    let db = sqlite.openDatabase({ name: 'demo.db' });
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM U_Ayats WHERE id > ?',
        [349],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('Record deleted successfully');
          } else {
            alert('No record found with the given name');
          }
        },
        error => {
          console.log('Error', error);
          alert('Error deleting record');
        }
      );
    });
  };
  const deleteTable = () => {
    let db = sqlite.openDatabase({ name: 'demo.db' });
    db.transaction(tx => {
      tx.executeSql(
        'DROP TABLE IF EXISTS U_Ayats',
        [],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          // if (results.rowsAffected > 0) {
          // alert('Record deleted successfully');
          //} else {
          //  alert('No record found with the given name');
          //  }
        },
        error => {
          console.log('Error', error);
          alert('Error deleting record');
        }
      );
    });
  };
  async function createTable() {
    let db = await sqlite.openDatabase({ name: 'demo.db' });
    db.transaction(function (t) {
      t.executeSql(
        'create table if not exists A_Ayats(id INTEGER PRIMARY KEY,t_id INTEGER,s_id INTEGER,ayat TEXT, FOREIGN KEY (t_id) REFERENCES TopicTable(id),FOREIGN KEY (s_id) REFERENCES SurahTable(id))',
        [],
        () => {
          alert('table created!');
        },
        e => {
          alert(JSON.stringify(e));
          console.log(JSON.stringify(e));
        },
      );
    });
  }
  async function saveData() {
    let db = await sqlite.openDatabase({ name: 'demo.db' });
    let data =[
      {"s_id": 2, "t_id": 75,"ayat": "Then learnt Adam from his Lord words of inspiration"},
      {"s_id": 4, "t_id": 75,"ayat": "We have sent you inspiration,as we sent it to noah and the messengers after him"},
      {"s_id": 6, "t_id": 75,"ayat": 'This Quran has been revealed to me by inspiration,that i may warn you and all whom it reaches'},
      {"s_id":6, "t_id": 75,"ayat": "or says: i have recieved inspiration when he has recieved none"},
      {"s_id": 2, "t_id": 75,"ayat": "Follow what you are taught by inspiration from your Lord"},
      {"s_id": 2, "t_id": 76,"ayat": "Allah will not call you to account for thoughtlessness in your oaths,but for the intentions in your heart;"},
      {"s_id":11, "t_id": 76,"ayat": "But if their intention is firm for divorce, Allah hears and knows all things"},
      {"s_id": 29, "t_id": 76,"ayat": "commit not evil in the land with intent to do mischief"},
      {"s_id": 9, "t_id": 76,"ayat": "not commit evil on the earth, with intent to do mischief."},
      {"s_id": 6, "t_id":76,"ayat": "They will indeed swear that their intention is nothing good; but Allah does declare that they are certainly liars"},
      {"s_id": 20, "t_id": 77,"ayat": 'send forth, therefore, the children of israel with us , and afflict them not:'},
      {"s_id": 20, "t_id": 77,"ayat": "O you Children of israel! we delivered you from your enemy"},
      {"s_id": 26, "t_id": 77,"ayat": "send you with us the children of israel"},
      {"s_id": 26, "t_id": 77,"ayat": "Thus it was, but we made the children of israel inheritors of such things"},
      {"s_id": 32, "t_id": 77,"ayat": 'We did indeed aforetime give the back to Moses:be not then in doubt of itd reaching you and we made it a guide to the children of israel'},
      {"s_id": 44, "t_id": 77,"ayat": "We deliver aforetime the children of israel from humiliating punishment"},
      {"s_id": 16, "t_id": 78,"ayat": "And before you also the Messangers we sent were but men, to whom we granted inspiration"},
      {"s_id": 17, "t_id": 78,"ayat": "if it were our will, we could take away that which we have sent you by inspiration"},
      {"s_id": 20, "t_id": 78,"ayat": 'i have choosen you listen then to the inspiration(you sent)'},
      {"s_id":20, "t_id": 78,"ayat": "Behold! we sent to your mother,by inspiration the message"},
      {"s_id": 21, "t_id": 78,"ayat": "Not a Messanger did we send before you without this inspiration sent by us to him"},
      {"s_id": 26, "t_id": 78,"ayat": 'Then we told Moses to inspiration:"Strike the sea with your rod"'},
      {"s_id":2, "t_id": 79,"ayat": "In their hearts is a disease and Allah has increased their disease"},
      {"s_id": 2, "t_id": 79,"ayat": "and we shall you your faults and increase (the portion of) those who do good"},
      {"s_id": 2, "t_id": 79,"ayat": "Allah give manifold increase to whom He pleases"},
      {"s_id": 2, "t_id":79,"ayat": "Allah will deprive usury of all blessings, but will give increase for deeds of charity"},
      {"s_id": 3, "t_id": 79,"ayat": 'But in (only) increased their Faith'},
      {"s_id": 2, "t_id": 80,"ayat": "Some you called imposters,and others you slay"},
      {"s_id": 25, "t_id": 80,"ayat": "some they called imposters, and some they (go so far as to) slay"},
      {"s_id": 2, "t_id": 81,"ayat": "For those who can do it (with hardship) is a ransom the feeding of one that is indigent"},
      {"s_id": 3, "t_id": 81,"ayat": 'Allah has heard the taunt of those who say "Allah has indigent and we are rich!"'},
      {"s_id": 5, "t_id": 81,"ayat": "or by way of antonement the feeding of the intigent or its equivalent in fasts that he may taste of the penalty of his deed"},
      {"s_id": 5, "t_id": 82,"ayat": "if you are in a state of ceremonial impurity, bathe your whole body"},
      {"s_id": 4, "t_id": 82,"ayat": "Nor in a state of ceremonial impurity (except when travelling on the road) until after washing your whole body"},
      {"s_id": 2, "t_id": 83,"ayat": 'O my sons! Allah has chsen the faith for you; then die not except in the faith of Islam'},
      {"s_id":2, "t_id": 83,"ayat": "O you who believe! Enter into Islam whole-heartedly"},
      {"s_id": 3, "t_id": 83,"ayat": "The religion before Allah is Islam(submission of his will)"},
      {"s_id": 3, "t_id": 83,"ayat": "O you who believe! fear Allah as He should be feared and die not except in a state of Islam"},
      {"s_id":6, "t_id": 83,"ayat": "Those whom Allah wills to guide, He opens their breast to Islam"},
      {"s_id": 15, "t_id": 84,"ayat": 'They would only say: "Our eyes have been intoxicated: no we have been bewitched by sovoery'},
      {"s_id": 15, "t_id": 85,"ayat": "Verily, by your life in their wild intoxication, they wander in distraction, to and fro"},
      {"s_id": 37, "t_id":85,"ayat": "Free from headiness,nor will they suffer intoxication therefrom"},
      {"s_id": 56, "t_id": 85,"ayat": 'No after-ache will they receive therefrom nor will they suffer intoxication'},
      {"s_id": 89, "t_id": 86,"ayat": "Of the(city of) Iram, with lofty pillars"},
      {"s_id": 5, "t_id": 88,"ayat": "O you who believe! Intoxicants and gambling,stones and arrows are an abomination"},
      {"s_id": 5, "t_id": 88,"ayat": "Satan's plan is to excite enmity and hatred between you with intoxicants and gambling"},
      {"s_id": 12, "t_id": 89,"ayat": 'O you chiefs! expound to me my  vision if it be that you can interpret visions'},
      {"s_id": 2, "t_id": 91,"ayat": "And this way the legacy that Abraham left to his sons,and so did jacob"},
      {"s_id": 2, "t_id": 91,"ayat": "Were you witnesses when death appeared before jacob?"},
      {"s_id": 2, "t_id": 91,"ayat": 'Say you: We believe in Allah and the revelation given to us and to Abraham,Ishmael,Issac,Jacob and'},
      {"s_id":2, "t_id": 91,"ayat": "or do you say that Abraham,ishmael,issac,Jacob and the tribes were jews or christians?"},
      {"s_id": 3, "t_id": 91,"ayat": "Say: we believe in Allah and in what has been revealed to us and what was revealed to Abraham,ishmael,jacob and the Tribes"},
      {"s_id": 2, "t_id": 92,"ayat": "say you we believe in Allah and the revelation given to us and to Abraham,ishmael,issac,jacob and that given to Moses and jesus and that given to (all) prophets from their Lord"},
      {"s_id":3, "t_id": 92,"ayat": 'When jesus found unbelieve on their part he said:"Who will be my helpers to (the work of)Allah?"'},
      {"s_id": 3, "t_id": 92,"ayat": "O jesus! i will take and raise you to myself and clear you(of the falsehoods) of those who blaspheme;"},
      {"s_id": 3, "t_id": 92,"ayat": "The similitude of jesus before Allah is as that of Adam;"},
      {"s_id": 5, "t_id":93,"ayat": 'said jesus:"Fear Allah,if you have faith"'},
      {"s_id": 6, "t_id": 93,"ayat": 'And zakariyya and john,and jesus and Elias:all in the ranks of the Righteous'},
      {"s_id": 42, "t_id": 93,"ayat": "that which we sent by inspiration to you and that which we enjoined on Abraham,Moses and jesus"},
      {"s_id": 43, "t_id": 93,"ayat": 'When jesus came with clear signs, he said :"Now have i come to you with wisdom"'},
      {"s_id": 3, "t_id": 93,"ayat": "his name will be christ jesus, the son of Mery, held in honour in this world and the Hereafter and of (the company of) those nearest to Allah"},
      {"s_id": 4, "t_id": 93,"ayat": 'That they said (in boast),"we killed christ jesus the son of mary,the messenger of Allah"'},
      {"s_id": 2, "t_id": 94,"ayat": "The jews say The christian have naught (to send) upon and the christians say The jews have naught (to stand) upon"},
      {"s_id": 2, "t_id": 94,"ayat": 'They say:"Become jew or christian if you would be guided(to salvation)"'},
      {"s_id": 3, "t_id": 94,"ayat": 'Abraham was not a jew or a christian'},
      {"s_id":4, "t_id": 94,"ayat": "Of the jews there are those who displace words from their places and say"},
      {"s_id": 5, "t_id": 94,"ayat":'(Both) the jews and the christian said:"we are sons of Allah and His beloved"'},
      {"s_id": 5, "t_id": 95,"ayat": "By its standard have been judged the jews,by the prophets who bowed(as in islam) to Allah's will"},
      {"s_id":5, "t_id": 95,"ayat": 'O you who believe! Take not the jews or the christians for your friends and protectors'},
      {"s_id": 5, "t_id": 95,"ayat": "Strongest among men in enmity to the believers will you find the jews and the pagans"},
      {"s_id": 16, "t_id": 95,"ayat": "To the jews who prohibited such things as we have mentioned to you before"},
      {"s_id": 22, "t_id":95,"ayat": 'Those who believe those who foloow the jewish and the sabians,christians,Magians,and polytheists'},
      {"s_id": 6, "t_id": 96,"ayat": 'yet they make the jinns equal with Allah,though Allah did create the jinns'},
      {"s_id": 6, "t_id": 96,"ayat": "Satans among men and jinns,inspiring each other with flowery discourses by way of deception"},
      {"s_id": 7, "t_id": 96,"ayat": 'He will say enter you in the company of the peoples who passed away before you men and jinns into the fire'},
      {"s_id": 7, "t_id": 96,"ayat": "Many are the jinns and men we have made for Hell"},
      {"s_id": 11, "t_id": 96,"ayat": 'And the word of your Lord shall be fulfilled i will fill hell with jinns and men altogether'},
      {"s_id": 9, "t_id": 97,"ayat": "nor acknowledge the religion of truth,(even if they are)of the people of the Book,until they pay the jizyah with willing submission,and feel themselves subdued"},
      {"s_id": 4, "t_id": 101,"ayat": 'if then you find sound judgement in them,release their property to them'},
      {"s_id": 4, "t_id": 101,"ayat": 'their(real)wish is to resort together for judgement to satan,though they were ordered to reject him'},
      {"s_id":5, "t_id": 101,"ayat": "But who for a people whose faith is assured cant give better judgment than Allah?"},
      {"s_id": 5, "t_id": 101,"ayat":'Do they then seek after a judgement of (the Days of) ignorance'},
      {"s_id": 6, "t_id": 101,"ayat": "such is the judgement and ordering of (Him), the the Exalted to power,the omniscient"},
      {"s_id":2, "t_id": 102,"ayat": 'And fight them on until..there prevail justice and faith in Allah'},
      {"s_id": 3, "t_id": 102,"ayat": "That is the witness of Allah ,His angels and those endued with knowledge,standing firm on justice"},
      {"s_id": 4, "t_id": 102,"ayat": "But never will they fail to receive justice in the least little things"},
      {"s_id": 4, "t_id":102,"ayat": 'And who you judge between man and man ,to judge with justice'},
      {"s_id": 6, "t_id": 102,"ayat": 'Take not life which Allah has made scared,except by way of justice and Law'},
      {"s_id": 2, "t_id": 100,"ayat": "but if any of you is ill,or on a journey"},
      {"s_id": 4, "t_id": 100,"ayat": 'But if you are ill,or on a journey,or one of you comes from offices of nature'},
      {"s_id": 5, "t_id": 100,"ayat": 'two just men of your own'},
      {"s_id": 4, "t_id":98,"ayat": "We sent inspiration to Abraham,Ishmael,Isaac,Jacob and the tribes to jesus,Job,Jonah,Aaron and Solomon"},
      {"s_id": 6, "t_id": 98,"ayat": 'and before him we guided Noah and among his progeny,David,Solomon,Job,Joseph,Moses and Aaron'},
      {"s_id": 21, "t_id": 98,"ayat": 'and (remember)Job when he cried to his Lord "Truly distress has seized me but you are the most Merciful of those that are Merciful"'},
      {"s_id":38, "t_id": 98,"ayat": "Commemorate Our servant Job"},
      {"s_id": 6, "t_id": 99,"ayat":'And Zakariya and John and Jesus and Elias all in the ranks of the Righteous'},
      { "s_id": 39, "t_id": 105, "ayat": "And it keepers will say, Did not messangers come to you from among yourselves" },
      { "s_id": 39, "t_id": 105, "ayat": 'its gate will be opened and its keeper will say' },
      { "s_id": 40, "t_id": 105, "ayat": 'Those in the fire will say to the keepers of Hell:"pray to your Lord to lighten us the penalty for a day(at least)!"' },
      { "s_id": 67, "t_id": 105, "ayat": "Almost bursting with fury every time a group is cast therein,its keeper will ask Did no warner come to you?" },
      { "s_id": 83, "t_id": 105, "ayat": 'But they had not been sent as keepers over them!' },
      { "s_id": 6, "t_id": 106, "ayat": 'With him are the keys of the unseen,that treasures that none knows but He' },
      { "s_id": 24, "t_id": 106, "ayat": "that you should eat in your own houses or in houses of which the keys are in your possession or in house of a sincere friend of yours" },
      { "s_id": 28, "t_id": 106, "ayat": 'such were the treasures we had' },
      { "s_id": 2, "t_id": 107, "ayat": 'Treat with kindness your parents and kindred and orphans and those in need' },
      { "s_id": 2, "t_id": 107, "ayat": 'And Allah is full of kindness to (His) devotees' },
      { "s_id": 3, "t_id": 107, "ayat": 'And Allah is full of kindness for those that serve Him' },
      { "s_id": 4, "t_id": 107, "ayat": 'But feed and clothe them therewith, and speak to them words of kindness and justice' },
      { "s_id": 4, "t_id": 107, "ayat": 'and speak to them words of kindness and justice' },
      { "s_id": 5, "t_id": 103, "ayat":"if any of you does so intentionally,the compensation is an offering brought to the kabah of a domestic animal" },
      { "s_id": 5, "t_id": 103, "ayat": "Allah made the kabah the sacred House an asylum of security for men" },
      { "s_id": 76, "t_id": 104, "ayat":"As to the Righteous,they shall drink of a cup(of wine) mixed with kafur" },
      { "s_id": 2, "t_id": 108, "ayat": "But it is Righteous to spend of your substance for your kin"},
      { "s_id": 2, "t_id": 108, "ayat": "It is prescribed,when death approaches any of you,if he leave any goods,that he make a bequest to parents and next of kin"},
      { "s_id": 3, "t_id": 108, "ayat": "Without doubt,among men, the nearest of kin to Abraham,are those who follow him"},
      { "s_id": 4, "t_id": 108, "ayat":"Stand out firmly for justice,as witness to Allah,even as against yourselves,or your parents or your kin" },
      { "s_id": 9, "t_id": 108, "ayat": "it is not fitting for the prophet and those who believe,that they should pray for forgiveness for pagans,even though they be of kin" },
      { "s_id": 5, "t_id": 109, "ayat":"for Allah loves those who are kind" },
      { "s_id": 9, "t_id": 109, "ayat":"but He turned to them(also):for He is unto them Most Kind,Most Merciful" },
      { "s_id": 9, "t_id": 109, "ayat": "it grieves him that you should perish ardently anxious is he over you to the believers is he most kind and merciful"},
      { "s_id": 16, "t_id": 109, "ayat":"for your Lord is indeed Most kind,Most Merciful"},
      { "s_id": 17, "t_id": 109, "ayat":"your Lord has decreed that you worship none but Him,and that you be kind to parents" },
      { "s_id": 4, "t_id": 110, "ayat":"Nor kill or destroy yourselves for verily Allah has been to you Most Merciful" },
      { "s_id": 4, "t_id": 110, "ayat": " if a man kills a believer intentionally,his recompense is Hell,to abide therein(for ever)" },
      { "s_id": 5, "t_id": 110, "ayat":"that which has been killed by strangling,or by a violent blow, or by a headlong fall,or by being gored to death" },
      { "s_id": 5, "t_id": 110, "ayat": "O you who believer kill not game while in the sacred precints or in pilgrim grab"},
      { "s_id": 17, "t_id": 110, "ayat": "kill not your children for fear of want we shall provide"},
      { "s_id": 29, "t_id": 111, "ayat": "we have enjoined on man kindness to parents"},
      { "s_id": 59, "t_id": 111, "ayat":"Our Lord! you are indeed full of kindness,Most Merciful" },
      { "s_id": 71, "t_id": 111, "ayat": "what is the matter with you,that you place not your hope for kindness and long-suffering in Allah" },
      { "s_id": 90, "t_id": 111, "ayat":"and enjoin deeds of kindness and compassion" },
      { "s_id": 2, "t_id": 111, "ayat":" Treat with kindness your parents and kindred and orphans and those in need" },
      { "s_id": 8, "t_id": 111, "ayat": "But kindred by blood have prior rights against each other in the Book of Allah"},
      { "s_id": 24, "t_id": 112, "ayat":"Let not those amongyou who are endued with grace and amplitude of means resolve by oath against helping their kinsmen"},
      { "s_id": 26, "t_id": 112, "ayat":"And admonish your nearest kinsmen" },
      { "s_id": 19, "t_id": 113, "ayat": "then shall we bring them forth on their knees round about Hell"},
      { "s_id": 19, "t_id": 113, "ayat":"But we shall save those who guarded against evil and we shall leave the wrongdoers therein(humbled)  to their knees"},
      { "s_id": 12, "t_id": 114, "ayat":'She gave each of them a knife and she said(to Joseph),"come out before them"' }
    ]

  
    db.transaction(function (t) {
      data.forEach(item => {
        t.executeSql(
          'INSERT INTO E_Ayats (t_id,s_id,ayat) VALUES (?, ?,?)',
          [item.t_id, item.s_id, item.ayat],
          (tx, resultSet) => {
            console.log(JSON.stringify(resultSet));
          },
          e => {
            alert(JSON.stringify(e));
            console.log(JSON.stringify(e));
          }
        );
      });

      alert('All data saved!!');
    });
  }
  async function getAllData() {
    let db = await sqlite.openDatabase({ name: 'demo.db' });
    db.transaction(function (t) {
      t.executeSql(
        'select * from Topic  ',
        [],
        (tx, resultSet) => {
          for (let i = 0; i < resultSet.rows.length; i++) {
            console.log(resultSet.rows.item(i));
          }
          console.log(JSON.stringify(resultSet));
          alert('get All Data');
        },
        e => {
          alert(JSON.stringify(e));
          console.log(JSON.stringify(e));
        },
      );
    });
  }
  async function updateData() {
    let db = await sqlite.openDatabase({ name: 'demo.db' });
    db.transaction(function (t) {
      t.executeSql(
        `update Topic set etopic =?,utopic =? Where id=43`,
        ['Hereafter', 'آخرت'],
        (tx, resultSet) => {
          console.log(JSON.stringify(resultSet));
        },
        e => {
          console.log(JSON.stringify(e));
        },
      );
    });
  }
  async function getoneData() {
    let db = await sqlite.openDatabase({ name: 'demo.db' });
    db.transaction(function (t) {
      t.executeSql(
        'select t_id from E_Ayats ',
        [],
        (tx, resultSet) => {
          // console.log('get All Data');
          const paths = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            // paths.push(results.rows.item(i).t_candy_path);
            //console.log(l_name)
            console.log(resultSet.rows.item(i))
          }
        },
        (e) => {
          console.log(JSON.stringify(e));
        },
      );
    });
  }
  const handleDeleteDatabase = () => {
    sqlite.deleteDatabase({ name: 'CompleteQuran.db', location: 'default', createFromLocation: '~CompleteQuran.db' },
        () => {
            console.log('Database deleted successfully');
        },
        (error) => {
            console.log('Error deleting database', error);
        }
    );
};

  return (
    <View style={{ padding: 10, gap: 10 }}>
      <Button title="Add Column" onPress={addNewColumn} />
      <Button title="Delete" onPress={deleteCandy} />
      <Button title="Create Table" onPress={createTable} />
      <Button title="get" onPress={getAllData} />
      <Button title="Save Data" onPress={saveData} />
      <Button title="Update  Data" onPress={updateData} />
      <Button title='one data' onPress={getoneData} />
      <Button title="Delete Database" onPress={handleDeleteDatabase} />

    </View>
  );
};

export default Sqlite;
