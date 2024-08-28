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
        'DELETE FROM Topic WHERE id=?',
        [25],
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
        'create table if not exists U_Ayats(id INTEGER PRIMARY KEY,t_id INTEGER,s_id INTEGER,ayat TEXT, FOREIGN KEY (t_id) REFERENCES TopicTable(id),FOREIGN KEY (s_id) REFERENCES SurahTable(id))',
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
    let data = [
      {"s_id": 2, "t_id": 70,"ayat": "He said i will make you and imam to the Nations"},
      {"s_id": 17, "t_id": 70,"ayat": "one day we shall call together all human beings with their imams"},
      {"s_id": 7, "t_id": 71,"ayat": 'The leaders of the unbelievers among his people said: Ah, we see you are an imbecile and we think you are a liar'},
      {"s_id":7, "t_id": 71,"ayat": "He said o my people i am no imbecile but i am a prophet from the lord and cherisher of the worlds"},
      {"s_id": 11, "t_id": 71,"ayat": "we say nothing but that some of our gods may have seized you with imbecility"},
      {"s_id": 15, "t_id": 72,"ayat": "And the earth We have spread out  set thereon mountains firm and immovable and produced therein all kind of things"},
      {"s_id":27, "t_id": 72,"ayat": "Or who  has made the earth firm  to live in made rivers in its midst set thereon mountains immovable"},
      {"s_id": 70, "t_id": 73,"ayat": "Truly man was created very impatient"},
      {"s_id": 5, "t_id": 74,"ayat": "(forbidden) also is the division (of meat) by raffling with arrows:this is impiety"},
      {"s_id": 6, "t_id":74,"ayat": 'Eat not of (meats) on which Allah`s name has not been pronounced:that would be impiety.'},
      {"s_id": 21, "t_id": 74,"ayat": 'They said,"who has done this to ours gods? He must indeed be some man of impiety!"'},
      {"s_id": 25, "t_id": 74,"ayat": "indeed they have an arrogant conceit of themselves and mighty is the insolence of their impiety"},

    ]


    db.transaction(function (t) {
      data.forEach(item => {
        t.executeSql(
          'INSERT INTO U_Ayats (t_id,s_id,ayat) VALUES (?, ?,?)',
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
        'select * from Topic where etopic LIKE ?',
        ['%I%'],
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
  return (
    <View style={{ padding: 10, gap: 10 }}>
      <Button title="Add Column" onPress={addNewColumn} />
      <Button title="Delete" onPress={deleteCandy} />
      <Button title="Create Table" onPress={createTable} />
      <Button title="get" onPress={getAllData} />
      <Button title="Save Data" onPress={saveData} />
      <Button title="Update  Data" onPress={updateData} />
      <Button title='one data' onPress={getoneData} />

    </View>
  );
};

export default Sqlite;
