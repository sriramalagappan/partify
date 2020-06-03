import React, { useEffect, useState } from 'react'
import { Alert, AsyncStorage } from 'react-native'
import HomeScreenUI from './HomeScreenUI'
import { useDispatch, useSelector } from 'react-redux'
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

    // navigate user to create room screen when button is pressed
    const createRoomHandler = () => {
        props.navigation.navigate('Create')
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

        const user = firebase.auth().currentUser

        // logout user from firebase
        await firebase.auth().signOut()

        // delete user from firebase
        user.delete().then(() => {
        }).catch((err) => {
            Alert.alert('An Error Occurred', 'Please try again or restart the app', [{ text: 'Okay' }])
        })

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
            createRoomHandler={createRoomHandler}
        />
    )
}

export default HomeScreen