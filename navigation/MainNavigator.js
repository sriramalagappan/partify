import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Entypo } from '@expo/vector-icons'

import StartupScreen from '../screens/StartupScreen/StartupScreen'
import AuthScreen from '../screens/AuthScreen/AuthScreen'
import HomeScreen from '../screens/HomeScreen/HomeScreen'


// // Create Stack navigator for home screen
// const HomeNavigator = createStackNavigator(
//     {
//         Main: HomeScreen
//     },
//     {
//         defaultNavigationOptions: defaultNavOptions,
//         headerMode:'none'
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
                gesturesEnabled: false,
            },
        },
        Home: {
            name: 'Home', screen: HomeScreen, navigationOptions: {
                gesturesEnabled: false,
            },
        }
    },
    {
        cardStyle: {
            opacity: 1,
        },
        headerMode: 'none',
        initialRouteName: 'Startup',
    }
)

export default createAppContainer(MainNavigator)
