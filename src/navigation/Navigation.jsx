import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from '../screens/Splash'
import Main from '../screens/Main'
import AyatTopics from '../screens/AyatTopics'
import CreateSchedule from '../screens/CreateSchedule'
const stack=createNativeStackNavigator()
const Navigation = () => {
  return (
    <NavigationContainer>
         <stack.Navigator screenOptions={{headerShown:false}}>
            <stack.Screen name='splash' component={Splash} />
            <stack.Screen name='main' component={Main} />
            <stack.Screen name='ayattopic' component={AyatTopics} />
            <stack.Screen name='createschedule' component={CreateSchedule} />
         </stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation