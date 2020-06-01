import React from 'react'
import { Platform } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';
import { Entypo } from '@expo/vector-icons'

import StartupScreen from '../screens/StartupScreen/StartupScreen'
import AuthScreen from '../screens/AuthScreen/AuthScreen'
import HomeScreen from '../screens/HomeScreen/HomeScreen'

import colors from '../constants/Colors'
import device from '../misc/device'

const defaultNavOptions = {
    headerTintColor: (Platform.OS === 'android') ? 'white' : 'black',
    headerTitleStyle: {
        fontFamily: 'bold',
        fontWeight: '200',
        marginTop: (Platform.OS === 'android' || device()) ? 30 : 20,
    },
    headerStyle: {
        backgroundColor: (Platform.OS === 'android') ? colors.primary : '',
        height: (Platform.OS === 'android' || device()) ? 75 : 65,
    },
    safeAreaInsets: {top: 0 , bottom: 0},
};


// Create Stack navigator for home screen just to create a default header
const HomeNavigator = createStackNavigator(
    {
        Home: HomeScreen
    },
    {
        defaultNavigationOptions: defaultNavOptions,
    }
)

// Create Stack navigator for login screen just to create a default header
const AuthNavigator = createStackNavigator(
    {
        Auth: AuthScreen
    },
    {
        defaultNavigationOptions: defaultNavOptions,
    }
)

/*  Combine all the screens under one navigator to switch between auth screens and the
    main app

    - Startup:  Blank screen which does background work before
                forwarding user to login screen or the home page
    - Auth:     Login screen
    - Main:     Main screens
*/

const MainNavigator = createAnimatedSwitchNavigator(
    {
        Startup: StartupScreen,
        Auth: AuthNavigator,
        Main: HomeNavigator,
    },
    {
        // The previous screen will slide to the left while the next screen will fade in
        transition: (
            <Transition.Together>
                <Transition.Out
                    type='slide-left'
                    durationMs={400}
                    interpolation='easeIn'
                />
                <Transition.In
                    type="fade"
                    durationMs={500}
                />
            </Transition.Together>
        ),
    }
)

export default createAppContainer(MainNavigator)
