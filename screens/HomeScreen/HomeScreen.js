import React, { useEffect, useState } from 'react'
import { AsyncStorage } from 'react-native'
import HeaderButton from '../../components/HeaderButton'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HomeScreenUI from './HomeScreenUI'
import { useDispatch, useSelector } from 'react-redux'
import getUserData from '../../misc/getUserData'
import * as userActions from '../../store/actions/user'
import firebase from 'firebase';

const HomeScreen = props => {

    // Stateful Variables
    const [roomName, setRoomName] = useState('')

    // Redux Store State Variables
    const display_name = useSelector(state => state.user.display_name)

    // save dispatch function in variable to use in hooks
    const dispatch = useDispatch()

    // Search input handler that updates roomName state
    const searchInputHandler = input => {
        setRoomName(input)
    }

    // Delete all data in async storage, delete state data, logout user from firebase, and route to auth screen
    const logoutHandler = async () => {
        // Delete async data
        const keys = await AsyncStorage.getAllKeys()
        let i;
        for (i = 0; i < keys.length; i++) {
            await AsyncStorage.removeItem(keys[i])
        }

        // Delete state data
        dispatch(userActions.logoutUser())

        // logout user from firebase
        await firebase.auth().signOut()

        // route to auth
        props.navigation.replace('Auth')
    }

    useEffect(() => {
        //componentDidMount
        // exmaple feth with token: const response = await fetch(`https://partify-ec534.firebaseio.com/test.json?auth=${token}`
    }, [])

    return (
        <HomeScreenUI
            display_name={(display_name) ? display_name : ''}
            roomName={roomName}
            searchInputHandler={searchInputHandler}
            logoutHandler={logoutHandler}
        />
    )
}

export default HomeScreen