import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import SQLite from 'react-native-sqlite-storage';

const databaseName = "CompleteQuran.db"; // Name of your database file

const Check = () => {
    const [ayat, setAyat] = useState('');

    useEffect(() => {
        openDatabase();
    }, []);

    const openDatabase = () => {
        SQLite.openDatabase(
            {
                name: databaseName,
                location: 'default',
                createFromLocation: '~CompleteQuran.db', // Ensure this is correct
            },
            (db) => {
                console.log("Database opened successfully");

                // Query to get Ayats (example query, adjust according to your table structure)
                db.transaction(tx => {
                    tx.executeSql(
                        "SELECT AyahText FROM Quran WHERE SuraId = 1 AND VerseId = 1", // Adjust this query according to your table
                        [],
                        (tx, results) => {
                            console.log("Query completed");
                            if (results.rows.length > 0) {
                                let ayatArabic = results.rows.item(0).AyahText;
                                console.log("Arabic Ayat: ", ayatArabic);

                                // Set the Ayat to state and apply transliteration
                                const romanEnglishAyat = transliterateToEnglish(ayatArabic);
                                setAyat(romanEnglishAyat);
                            } else {
                                console.log("No Ayat found.");
                            }
                        },
                        (error) => {
                            console.error("Error executing SQL query: ", error);
                        }
                    );
                });
            },
            (error) => {
                console.error("Error opening database: ", error);
            }
        );
    }

    const transliterateToEnglish = (arabicText) => {
        const arabicToEnglishMap = {
            'ا': 'a',
            'ب': 'b',
            'ت': 't',
            'ث': 'th',
            'ج': 'j',
            'ح': 'h',
            'خ': 'kh',
            'د': 'd',
            'ذ': 'dh',
            'ر': 'r',
            'ز': 'z',
            'س': 's',
            'ش': 'sh',
            'ص': 's',
            'ض': 'd',
            'ط': 't',
            'ظ': 'z',
            'ع': 'a',
            'غ': 'gh',
            'ف': 'f',
            'ق': 'q',
            'ك': 'k',
            'ل': 'l',
            'م': 'm',
            'ن': 'n',
            'ه': 'h',
            'و': 'w',
            'ي': 'y',
            'ء': "'",
            'آ': 'aa',
            'إ': 'i',
            'أ': 'a',
            'ى': 'a',
            'ة': 'h',
        };
         console.log(arabicText.split('').map(char => arabicToEnglishMap[char] || char).join(''));
         
        // Map each Arabic character to its corresponding English transliteration
        return arabicText.split('').map(char => arabicToEnglishMap[char] || char).join('');
    };

    return (
        <View>
            <Text style={{fontSize:20}}>{ayat ? `Transliterated Ayat: ${ayat}` : 'Loading...'}</Text>
        </View>
    );
}

export default Check;
