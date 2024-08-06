import { View, Text, ImageBackground, StyleSheet, Dimensions, StatusBar, Pressable } from 'react-native'
import React from 'react'
const {width,height}=Dimensions.get('window')
const Main = ({navigation}) => {
    return (
        <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.bgImage}>
            <Text style={styles.heading}>Quranic Ayat Reminder</Text>
            <Pressable style={styles.button} onPress={()=>navigation.navigate('ayattopic')}>
                <Text style={styles.buttonText}>Ayat Topic</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Ayat</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText} onPress={()=>navigation.navigate('createschedule')}>Set Ayat Alert</Text>
            </Pressable>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        alignItems:'center'
    },
    heading:{
        fontSize:width*0.08,
        fontWeight:'500',
        marginVertical:height*0.02,
        color:'blue'
    },
    button:{
        backgroundColor:'#7E25D7',
        width:'50%',
        marginHorizontal:width*0.03,
        height:height*0.05,
        marginVertical:width*0.03,
        borderRadius:50,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center'
    },
    buttonText:{
        fontSize:width*0.055,
        color:'white',
    }
})
export default Main