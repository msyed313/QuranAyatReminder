import { View, Text, ImageBackground, StyleSheet, Image, Dimensions, useAnimatedValue, Animated, StatusBar } from 'react-native'
import React,{useEffect,useRef} from 'react'
const { width, height } = Dimensions.get('window')
const Splash = ({navigation}) => {
    const anim = useRef(new Animated.Value(0)).current;
    const animation = () => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 2000, // Adjust duration as needed
            useNativeDriver: true,
        }).start(() => {
            const timer = setTimeout(() => {
                navigation.navigate('main');
            }, 1000);

            return () => clearTimeout(timer);
        });
    }
    useEffect(() => {

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