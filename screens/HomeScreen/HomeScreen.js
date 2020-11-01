import React, { useEffect, useState, useCallback } from 'react'
import { Alert, AsyncStorage } from 'react-native'
import HomeScreenUI from './HomeScreenUI'
import { useDispatch, useSelector } from 'react-redux'
import * as userActions from '../../store/actions/user'
import * as roomActions from '../../store/actions/room'
import * as songActions from '../../store/actions/songs'
import * as playerActions from '../../store/actions/player'
import * as deviceActions from '../../store/actions/devices'
import firebase from 'firebase';
import setUserData from '../../misc/setUserData'

const HomeScreen = props => {

    // Stateful Variables
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [timer, setTimer] = useState(null)

    // Modal Stateful Variables
    const [visible, setVisible] = useState(false)
    const [password, setPassword] = useState('')
    const [roomPassword, setRoomPassword] = useState('')
    const [roomKey, setRoomKey] = useState('')
    const [userDevice, setUserDevice] = useState(null)
    const [isRejoin, setIsRejoin] = useState(false)
    const [uType, setUType] = useState(null)

    // Redux Store State Variables
    const displayName = useSelector(state => state.user.displayName)
    const userID = useSelector(state => state.user.userID)
    const roomID = useSelector(state => state.room.roomID)
    const userType = useSelector(state => state.room.userType)
    const playlistID = useSelector(state => state.room.playlistID)
    const userRooms = useSelector(state => state.room.userRooms)
    const level = useSelector(state => state.user.level)
    const matches = useSelector(state => state.room.matches)
    const device = useSelector(state => state.room.device)
    let devices = useSelector(state => state.devices.devices)

    // falsey check for devices
    if (devices == false) {
        devices = null
    }

    // save dispatch function in variable to use in hooks
    const dispatch = useDispatch()

    // componentDidMount
    useEffect(() => {
        // reset previous room information to null if it exists
        dispatch(roomActions.resetRoom())

        // get all the current active Spotify devices
        dispatch(deviceActions.getDevices())

        // start a timer to update room Data from Firebase every 5 seconds
        const interval = setInterval(() => {
            dispatch(roomActions.getUserRooms(userID, false))
        }, 5000)

        // componentWillUnmount
        return () => {
            // clear all timers to ensure timer is closed
            for (var i = interval; i > 0; --i) {
                clearInterval(i)
            }
        }
    }, [])

    // if roomID and userType are initialized, user joined a room: route them
    useEffect(() => {
        const joinedRoom = async () => {
            if (roomID && playlistID) {
                // reset name
                await dispatch(songActions.getPlaylistSongs(playlistID))
                if (userType === 'host') {
                    // start silent playback on device
                    await playerActions.silentPlayback(device.id)
                    props.navigation.navigate('Host')
                } else if (userType === 'admin') {
                    props.navigation.navigate('Admin')
                }
                setTimeout(() => { setName('') }, 500)
            }
        }
        joinedRoom()
    }, [roomID, userType, playlistID])

    /**
     * update device when available device is selected
     * @param {*} index location of the device in the array of devices
     */
    const deviceHandler = index => {
        // if device is already checked, uncheck it 
        if (userDevice && userDevice.id === devices[index].id) {
            setUserDevice(null)
        } else {
            setUserDevice(devices[index])
        }
    }

    /**
     * get active Spotify devices again when refresh button in modal is clicked
     */
    const refreshDeviceHandler = async () => {
        await dispatch(deviceActions.getDevices())
    }

    /**
     * search through Firebase for room names that match the given input 
     * @param name a string
     */
    const toggleRoomSearch = useCallback(async (name) => {
        try {
            await dispatch(roomActions.searchRooms(name, userID))
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }, [dispatch])

    /**
     * Search input handler that updates name state and sends search request after user is done typing
     * @param {*} input a string
     */
    const searchInputHandler = input => {
        setName(input)
        if (timer) { clearTimeout(timer) }
        // dont make a search request if input is reset/blank
        if (input) {
            setIsLoading(true)
            // replace space with %20 to allow for correct url format when sending request after user stops typing
            setTimer(setTimeout(() => { toggleRoomSearch(input) }, 500))
        } else {
            setIsLoading(false)
        }
    }

    /**
     * navigate user to create room screen when button is pressed
     */
    const createRoomHandler = () => {
        // Verify that user has a premium account
        if (level === 'premium') {
            props.navigation.navigate('Create')
        } else {
            Alert.alert('Premium Account Required', 'Sorry, creating a room is a Spotify premium feature. Please upgrade or change accounts', [{ text: 'Okay' }])
        }
    }

    /**
     * Get room information to allow user to join the given room
     * @param {*} password password for the room
     * @param {*} key Firebase ID of the room
     */
    const joinRoomHandler = (password, key) => {
        setIsRejoin(false)
        // display modal for password if password is required
        if (password) {
            setRoomPassword(password)
            setRoomKey(key)
            setVisible(true)
        } else {
            try {
                dispatch(roomActions.joinRoom(key, userID, displayName))
            } catch (err) {
                console.log(err)
            }
        }
    }

    /**
     * Send request to rejoin the room
     *
     * @param roomID Firebase ID of the room
     * @param userType a string (user level in the room the user is joining)
     */
    const toggleRejoinRoom = useCallback((roomID, userType, userDevice) => {
        dispatch(roomActions.rejoinRoom(roomID, userType, userDevice))
    })

    /**
     * Rejoin a room
     */
    const rejoinRoom = () => {
        if (!userDevice) {
            Alert.alert('No Device Selected', 'Please select a device', [{ text: 'Okay' }])
            return;
        }
        setVisible(false);
        toggleRejoinRoom(roomKey, uType, userDevice);
    }

    /**
     * Open modal to rejoin a room
     * @param {*} roomID Firebase ID of the room
     * @param {*} userType a string (user level in the room the user is joining)
     */
    const rejoinRoomHandler = (roomID, userType, time) => {
        if (userType === 'host') {
            toggleRejoinRoom(roomID, userType);
        }
        else if ((Date.now() - time) > 43000) {
            Alert.alert('Room is offline', 'Please wait for the host to join the room', [{ text: 'Okay' }])
        } else {
            setRoomKey(roomID)
            setUType(userType)
            setIsRejoin(true)
            setVisible(true)
        }
    }

    /**
     * Log the user out
     */
    const logoutHandler = async () => {
        // Delete async data
        const keys = await AsyncStorage.getAllKeys()
        let i;
        for (i = 0; i < keys.length; i++) {
            await AsyncStorage.removeItem(keys[i])
        }

        // Delete state data
        dispatch(userActions.logoutUser())

        // Delete room data
        await dispatch(roomActions.resetRoom())

        const user = firebase.auth().currentUser

        // logout user from firebase
        await firebase.auth().signOut()

        // delete user from firebase
        user.delete().then(() => {
        }).catch((err) => {
            Alert.alert('An Error Occurred', 'Please try again or restart the app', [{ text: 'Okay' }])
        })

        // save logout parameter on device so login screen is prompted again on next sign in atempt
        await setUserData('logout', true)

        // route to auth
        props.navigation.replace('Auth')
    }

    /**
     * Send request to get all the user rooms when user refreshes manually 
     */
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

    /**
     * update password state
     * @param {*} input a string
     */
    const passwordHandler = (input) => {
        setPassword(input)
    }

    /**
     * handler when user touches outside of modal
     */
    const closeHandler = () => {
        setVisible(false)
        setIsRejoin(false)
        setPassword('')
    }

    /**
     * Check if passwords match and route if true, otherwise send alert
     */
    const submitPasswordHandler = () => {
        if (password === roomPassword) {
            try {
                setVisible(false)
                dispatch(roomActions.joinRoom(roomKey, userID, displayName))
            } catch (err) {
                console.log(err)
            }
        } else {
            Alert.alert('Incorrect Password', 'The password did not match. Please try again', [{ text: 'Okay' }])
        }
    }

    return (
        <HomeScreenUI
            display_name={(displayName) ? displayName : ''}
            name={name}
            searchInputHandler={searchInputHandler}
            logoutHandler={logoutHandler}
            createRoomHandler={createRoomHandler}
            joinRoomHandler={joinRoomHandler}
            isLoading={isLoading}
            userRooms={userRooms}
            rejoinRoomHandler={rejoinRoomHandler}
            refreshHandler={refreshHandler}
            refreshing={refreshing}
            matches={matches}
            visible={visible}
            closeHandler={closeHandler}
            password={password}
            passwordHandler={passwordHandler}
            submitPasswordHandler={submitPasswordHandler}
            devices={devices}
            refreshDeviceHandler={refreshDeviceHandler}
            deviceHandler={deviceHandler}
            userDevice={userDevice}
            isRejoin={isRejoin}
            rejoinRoom={rejoinRoom}
        />
    )
}

export default HomeScreen