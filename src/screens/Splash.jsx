import { View, Text, ImageBackground, StyleSheet, Image, Dimensions, useAnimatedValue, Animated, StatusBar } from 'react-native'
import React,{useEffect,useRef,useState} from 'react'
const { width, height } = Dimensions.get('window')
import AsyncStorage from '@react-native-async-storage/async-storage'
const Splash = ({navigation}) => {
    const anim = useRef(new Animated.Value(0)).current;
    const [data, setData] = useState({});
    const animation = () => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 2000, // Adjust duration as needed
            useNativeDriver: true,
        }).start(() => {
            const timer = setTimeout(() => {
                if(data){
                     navigation.navigate('main')
                }
                else{
                    navigation.navigate('login');
                }
                
            }, 1000);

            return () => clearTimeout(timer);
        });
    }
    const retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('user');
          if (value !== null) {
            const parsedData = JSON.parse(value);
            //console.log(parsedData);
            setData(parsedData);
          }
        } catch (error) {
          console.error('Error retrieving data:', error);
        }
      };
    useEffect(() => {
        retrieveData(),
        animation()
    }, []);
    return (
        <ImageBackground source={require('../assets/CloudsBackground.png')} style={styles.bgImage}>
            <StatusBar backgroundColor='skyblue' barStyle='dark-content' />
            <Animated.Image source={require('../assets/logo.jpeg')} style={[
                styles.logo,
                { opacity: anim },
            ]} />
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: width * 0.35,
        height: width * 0.35,
        borderRadius:100
    }
})
export default Splash