/* eslint-disable prettier/prettier */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../Screen/HomeScreen';
import MapScreen from '../Screen/MapScreen';
import EntryMapScreen from '../Screen/EntryMapScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabScreen from '../Screen/TabScreen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

// function HomeTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="HomeScreen" component={HomeScreen} />
//       <Tab.Screen name="EntryMapScreen" component={EntryMapScreen} />
//     </Tab.Navigator>
//   );
// }
const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TabScreen"
          component={TabScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EntryMapScreen"
          component={EntryMapScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
