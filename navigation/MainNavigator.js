import { Platform } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Entypo } from '@expo/vector-icons'

import StartupScreen from '../screens/StartupScreen/StartupScreen'
import AuthScreen from '../screens/AuthScreen/AuthScreen'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import CreateRoomScreen from '../screens/CreateRoomScreen/CreateRoomScreen'
import HostPlayerScreen from '../screens/HostPlayerScreen/HostPlayerScreen'

import device from '../misc/device'

const defaultNavOptions = {
    headerTintColor: 'white',
    headerTitleStyle: {
        fontFamily: 'bold',
        fontWeight: '200',
        marginTop: (Platform.OS === 'android' || device()) ? 30 : 20,
        fontSize: 20,
    },
    headerStyle: {
        backgroundColor: 'black',
        height: (Platform.OS === 'android' || device()) ? 75 : 65,
    },
    safeAreaInsets: {top: 0 , bottom: 0},
};

// // Create Stack navigator for home screen
// const HomeNavigator = createStackNavigator(
//     {
//         Main: HomeScreen
//     },
//     {
//         defaultNavigationOptions: defaultNavOptions,
//     }
// )

/*  Combine all the screens under one navigator to switch between auth screens and the
    main app

    - Startup:  Blank screen which does background work before
                forwarding user to login screen or the home page
    - Auth:     Login screen
    - Home:     Defualt home screen
*/

const MainNavigator = createStackNavigator(
    {
        Startup: StartupScreen,
        Auth: {
            name: 'Auth', screen: AuthScreen, navigationOptions: {
                gestureEnabled: false,
            },
        },
        Home: {
            name: 'Home', screen: HomeScreen, navigationOptions: {
                gestureEnabled: false,
            },
        },
        Create: CreateRoomScreen,
        Host: HostPlayerScreen,
    },
    {
        headerMode: 'none',
        initialRouteName: 'Startup',
        navigationOptions: {
            cardStyle: {
                opacity: 1,
            },
        }
    }
)

export default createAppContainer(MainNavigator)
