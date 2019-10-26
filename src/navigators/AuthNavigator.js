import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { View } from 'react-native';
import { Icon } from 'native-base';
import CheckinScreen from '../screens/CheckinScreen';
import RoomScreen from '../screens/RoomScreen';
import CustomerScreen from '../screens/CustomerScreen';
import SettingScreen from '../screens/SettingScreen';
import CustomerAddScreen from '../screens/CustomerAddScreen';

  
const StackCustomer = createStackNavigator({
    Customer: {
        screen: CustomerScreen,
        navigationOptions: {
            header: null,
        },
    },
    CustomerAdd: {
        screen: CustomerAddScreen,
        navigationOptions: {
            header: null,
        },
    },
})

const TabNavigator = createMaterialBottomTabNavigator({
    Checkin: { 
        screen: CheckinScreen ,
        navigationOptions: {
            tabBarLabel : 'Checkin',
            tabBarIcon : ({tintColor}) =>(
                <View>
                    <Icon style={[{color: tintColor}]} size={25} name={'md-checkmark-circle'}/>
                </View>
            )
        }
    },
    Room: { 
        screen: RoomScreen ,
        navigationOptions: {
            tabBarLabel : 'Room',
            tabBarIcon : ({tintColor}) =>(
                <View>
                    <Icon style={[{color: tintColor}]} size={25} name={'ios-bed'}/>
                </View>
            )
        }
    },
    Customer: { 
        screen: StackCustomer,
        navigationOptions: {
            tabBarLabel : 'Customer',
            tabBarIcon : ({tintColor}) =>(
                <View>
                    <Icon style={[{color: tintColor}]} size={25} name='person'/>
                </View>
            ),
            activeTintColor: '#0652DD',
            inactiveTintColor: '#222f3e',
        }
    },
    Setting: { 
        screen: SettingScreen,
        navigationOptions: {
            tabBarLabel : 'Setting',
            tabBarIcon : ({tintColor}) =>(
                <View>
                    <Icon style={[{color: tintColor}]} size={25} name='ios-settings'/>
                </View>
            ),
            activeTintColor: '#0652DD',
            inactiveTintColor: '#222f3e',
        }
    },
},
{
    initialRouteName:'Room',
    inactiveColor: '#222f3e',
    activeColor: '#0652DD',
    barStyle: {backgroundColor:'#a5b1c2'}
});


  const Auth = createStackNavigator(
    {    
        BottomStack:TabNavigator,
        Checkin:CheckinScreen,
        Room: RoomScreen,
        Cutomer: CustomerScreen,
        Setting: SettingScreen,

    },
    {
      initialRouteName: 'BottomStack',
      headerMode: 'none'
    }
  );

  export default createAppContainer(Auth);