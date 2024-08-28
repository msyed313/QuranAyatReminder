import { useState } from 'react';
import React from 'react';
import {
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    TextInput,
    Dimensions
} from 'react-native';
import sqlite from 'react-native-sqlite-storage'

const { width, height } = Dimensions.get('window');

const Registration = ({ navigation }) => {
    const [passView, setPassView] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const register = async () => {
        let db = await sqlite.openDatabase({name: 'demo.db'});
        db.transaction(function (t) {
          t.executeSql(
            'insert into Register(uname,email,password) values (?,?,?)',
            [name,email,password],
            (tx, resultSet) => {
              //console.log(JSON.stringify(resultSet));
              alert('account created');
              setEmail(''),setName(''),setPassword('')
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
                <Text style={styles.t1}>Create new Account</Text>
                <TextInput placeholder="uname" style={styles.input} onChangeText={setName} value={name} />
                {error.Name && <Text>{error.Name}</Text>}
                <TextInput placeholder="email" style={styles.input} onChangeText={setEmail} value={email} />
                {error.Email && <Text>{error.Email}</Text>}
                <TextInput
                    placeholder="password"
                    style={[styles.input, { position: 'relative' }]}
                    secureTextEntry={!passView}
                    onChangeText={setPassword}
                    value={password}
                />
                {error.Password && <Text>{error.Password}</Text>}
                {passView ? (
                    <Pressable onPress={() => setPassView(false)}>
                        <Image
                            source={require('../assets/hide.png')}
                            style={styles.icon}
                        />
                    </Pressable>
                ) : (
                    <Pressable onPress={() => setPassView(true)}>
                        <Image
                            source={require('../assets/view.png')}
                            style={styles.icon}
                        />
                    </Pressable>
                )}

                <Pressable style={styles.press} onPress={register} >
                    <Text style={styles.pressText}>Signup</Text>
                </Pressable>
                <Pressable>
                    <Text
                        style={[styles.t1, { fontSize: width * 0.043 }]}
                        onPress={() => navigation.navigate('login')}>
                        Already have account? Login
                    </Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    ImageBackground: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    v1: {
        width: '90%',
        borderWidth: 3,
        paddingHorizontal: width * 0.05,
        borderColor: '#7E25D7',
        backgroundColor: '#02A4ED',
        borderRadius: 30,
        alignItems: 'center',
        gap: width * 0.02
    },
    t1: {
        fontSize: width * 0.07,
        color: 'black',
        fontWeight: '500',
        paddingVertical: height * 0.02,
    },
    imgview: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        //backgroundColor:'red'
    },
    img: {
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: 50
    },
    btn: {
        borderRadius: 30,
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C5CACB',
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
        marginLeft: width * 0.25,
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

export default Registration;
