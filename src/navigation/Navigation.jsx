import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from '../screens/Splash'
import Main from '../screens/Main'
import AyatTopics from '../screens/AyatTopics'
import CreateSchedule from '../screens/CreateSchedule'
import Sqlite from '../screens/Sqlite'
import Registration from '../screens/Registration'
import Login from '../screens/Login'
import StudentProfile from '../screens/StudentProfile'
import ScheduleAyats from '../screens/ScheduleAyats'
//import { navigationRef } from './NavigationService'
import MySchedules from '../screens/MySchedules'
import Check from '../screens/Check'
import EditSchedule from '../screens/EditSchedule'
//const navigationref=React.createRef()
const stack = createNativeStackNavigator()
const Navigation = () => {
  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{ headerShown: false }} >
      
        <stack.Screen name='splash' component={Splash} />
        <stack.Screen name='login' component={Login} />
        <stack.Screen name='register' component={Registration} />
        {/*<stack.Screen  name='check' component={Check} />*/}
        <stack.Screen name='sqlite' component={Sqlite} />
        <stack.Screen name='main' component={Main} />
        <stack.Screen name='ayattopic' component={AyatTopics} />
        <stack.Screen name='createschedule' component={CreateSchedule} />
        <stack.Screen name='profile' component={StudentProfile} />
        <stack.Screen name='ScheduleAyats' component={ScheduleAyats} />
        <stack.Screen name='schedules' component={MySchedules} />
        <stack.Screen name='editschedule' component={EditSchedule} />

      </stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation