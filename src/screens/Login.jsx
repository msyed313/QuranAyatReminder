import React, { useState } from 'react';
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Text,
    TextInput,
    View,
    Pressable,
    Image,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sqlite from 'react-native-sqlite-storage';
const { width, height } = Dimensions.get('window')
function Login({ navigation }) {
    const [passView, setPassView] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async () => {
        let db = await sqlite.openDatabase({name: 'demo.db'});
        db.transaction(function (t) {
          t.executeSql(
            'SELECT * FROM Register WHERE uname = ? AND password = ?',
            [name, password],
            (tx, resultSet) => {
              if (resultSet.rows.length > 0) {
                console.log(resultSet.rows.item(0));
                setName(''),setPassword(''),setError('')
                 AsyncStorage.setItem('user', JSON.stringify(resultSet.rows.item(0)));
                navigation.navigate('main')
               // alert('Login successful');
              } else {
               // console.log('Invalid username or password');
                setError('Invalid username or password')
              }
            },
            e => {
              alert(JSON.stringify(e));
              console.log(JSON.stringify(e));
            },
          );
        });
    };
    return (
        <ImageBackground
            source={require('../assets/CloudsBackground.png')}
            style={styles.ImageBackground}>
            <StatusBar backgroundColor="skyblue" barStyle="dark-content" />

            <View style={styles.v1}>
                <Text style={styles.t1}>Login to your account</Text>
                {error ? <Text style={{ fontSize: 15, color: 'red', textAlign: 'center' }}>{error}</Text> : null}
                <TextInput
                    placeholder="email"
                    onChangeText={setName}
                    value={name}
                    style={styles.input} />
                <TextInput
                    placeholder="password"
                    onChangeText={setPassword}
                    value={password}
                    style={[styles.input, { position: 'relative' }]}
                    secureTextEntry={passView ? false : true}
                />
                {passView ? (
                    <Pressable onPress={() => setPassView(false)}>
                        <Image
                            source={require('../assets/hide.png')}
                            style={styles.icon}
                        />
                    </Pressable>
                ) : (
                    <Pressable onPress={() => [setPassView(true)]}>
                        <Image
                            source={require('../assets/view.png')}
                            style={styles.icon}
                        />
                    </Pressable>
                )}
                <Pressable style={styles.press} onPress={handleLogin} >
                    <Text style={styles.pressText}>login</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('register')}>
                    <Text style={[styles.t1, { fontSize: width * 0.043 }]}>
                        Don't have account ? Signup
                    </Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    ImageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    v1: {
        width: '90%',
        borderWidth: 3,
        paddingVertical: width * 0.03,
        paddingHorizontal: width * 0.05,
        borderColor: '#7E25D7',
        backgroundColor: '#02A4ED',
        borderRadius: 30,
        alignItems: 'center',
        gap: width * 0.02
    },
    t1: {
        fontSize: width * 0.06,
        color: 'black',
        fontWeight: '500',
        paddingVertical: height * 0.02,
    },
    input: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 30,
        fontSize: width * 0.05,
        color: 'black',
        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.03,
        marginVertical: width * 0.01,
    },
    icon: {
        width: width * 0.07,
        height: width * 0.07,
        position: 'absolute',
        marginTop: -width * 0.13,
        marginLeft: width * 0.24,
    },
    press: {
        backgroundColor: '#7E25D7',
        width: '50%',
        alignItems: 'center',
        borderRadius: 50,
        paddingVertical: width * 0.01
    },
    pressText: {
        fontSize: width * 0.07,
        color: 'white',
        fontWeight: '400'
    }
});
export default Login;