/* eslint-disable prettier/prettier */
// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React
import React from 'react';

// Import Navigators from React Navigation
import {createStackNavigator} from '@react-navigation/stack';

// import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import CustomSidebarMenu from '../Components/CustomSidebarMenu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';

const Tab = createMaterialBottomTabNavigator();

// const Tab = createBottomTabNavigator();

const TabScreen = props => {
  const colorScheme = useColorScheme();
  //   const {theme} = useMaterial3Theme();

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      //   shifting={true}
      activeColor="#059FDC">
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          unmountOnBlur: true,
          //   tabBarIcon: ({color}) => (
          //     <MaterialCommunityIcons name="home" color={color} size={26} />
          //   ),
        }}
      />
      <Tab.Screen
        name="MapScreen"
        // screenOptions={{ headerShown: true }}
        component={MapScreen}
        options={{
          title: 'MapScreen',
          unmountOnBlur: true,
        }}
        // options={{
        //   headerShown: true,
        //   tabBarLabel: 'MapScreen',
        // }}
      />
    </Tab.Navigator>
  );
};

export default TabScreen;
