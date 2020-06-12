import React, { useEffect, useState, useCallback } from 'react'
import { Alert, AsyncStorage } from 'react-native'
import HomeScreenUI from './HomeScreenUI'
import { useDispatch, useSelector } from 'react-redux'
import * as userActions from '../../store/actions/user'
import * as roomActions from '../../store/actions/room'
import * as songActions from '../../store/actions/songs'
import firebase from 'firebase';

const HomeScreen = props => {

    // Stateful Variables
    const [roomName, setRoomName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    // Redux Store State Variables
    const display_name = useSelector(state => state.user.display_name)
    const userID = useSelector(state => state.user.userID)
    const roomID = useSelector(state => state.room.roomID)
    const userType = useSelector(state => state.room.userType)
    const playlistID = useSelector(state => state.room.playlistID)
    const userRooms = useSelector(state => state.room.userRooms)
    

    // save dispatch function in variable to use in hooks
    const dispatch = useDispatch()

    // componentDidMount
    useEffect(() => {
        dispatch(roomActions.resetRoom())
    }, [])

    // if roomID and userType are initialized, user joined a room: route them
    useEffect(() => {
        const joinedRoom = async () => {
            if (roomID && playlistID) {
                await dispatch(songActions.getPlaylistSongs(playlistID))
                if (userType === 'host') {
                    props.navigation.navigate('Host')
                } else if (userType === 'admin') {
                    props.navigation.navigate('Admin')
                }
            }
        }
        joinedRoom()
    }, [roomID, userType, playlistID])

    // Search input handler that updates roomName state
    const searchInputHandler = input => {
        setRoomName(input)
    }

    // navigate user to create room screen when button is pressed
    const createRoomHandler = () => {
        props.navigation.navigate('Create')
    }

    // attempt to join a room given roomName in searchbar
    const joinRoomHandler = useCallback(async () => {
        setIsLoading(true)
        try {
            await dispatch(roomActions.joinRoom(roomName, userID))
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }, [dispatch, isLoading])

    const toggleRejoinRoom = useCallback((roomID, userType) => {
        dispatch(roomActions.rejoinRoom(roomID, userType))
    })

    // attempt to rejoin a room
    const rejoinRoomHandler = (roomID, userType, time) => {
        if (Date.now() - time < 63000 || userType === 'host') {
            toggleRejoinRoom(roomID, userType)
        } else {
            Alert.alert('Room is Offline', 'The room is currently offline. Please refresh by swiping down and try to join the room again', [{ text: 'Okay' }])
        }
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

    const refreshHandler = useCallback(async () => {
        setRefreshing(true)
        try {
            await dispatch(roomActions.getUserRooms(userID))
        } catch (err) {
            // TODO
            console.log(err)
        }
        setRefreshing(false)
    }, [dispatch, refreshing])

    return (
        <HomeScreenUI
            display_name={(display_name) ? display_name : ''}
            roomName={roomName}
            searchInputHandler={searchInputHandler}
            logoutHandler={logoutHandler}
            createRoomHandler={createRoomHandler}
            joinRoomHandler={joinRoomHandler}
            isLoading={isLoading}
            userRooms={userRooms}
            rejoinRoomHandler={rejoinRoomHandler}
            refreshHandler={refreshHandler}
            refreshing={refreshing}
        />
    )
}

export default HomeScreen