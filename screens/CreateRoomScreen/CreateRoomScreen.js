import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as deviceActions from '../../store/actions/devices'
import * as roomActions from '../../store/actions/room'

import CreateRoomScreenUI from './CreateRoomScreenUI'

const CreateRoomScreen = props => {

    // Stateful Variables
    const [roomName, setRoomName] = useState('')
    const [password, setPassword] = useState('')
    const [device, setDevice] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [nameError, setNameError] = useState('')
    const [passError, setPassError] = useState('')
    const [deviceError, setDeviceError] = useState('')

    // Redux Store State Variables
    let devices = useSelector(state => state.devices.devices)
    const roomID = useSelector(state => state.room.roomID)
    const userID = useSelector(state => state.user.userID)

    // falsey check for devices
    if (devices == false) {
        devices = null
    }

    const dispatch = useDispatch()

    // componentDidMount
    useEffect(() => {
        const init = async () => {
            setIsLoading(true)
            // get all the current active Spotify devices
            await dispatch(deviceActions.getDevices())
            setIsLoading(false)
        }
        init()
    }, [])

    // If roomID is created successfully, replace screen with host player screen
    useEffect(() => {
        if(roomID) {
            props.navigation.replace('Host')
        }
    }, [roomID])

    /**
     * Update room name state
     * @param {*} input text from input field
     */
    const roomNameHandler = input => {
        setRoomName(input)
    }

    /**
     * Update the password state
     * @param {*} input text from input field
     */
    const passwordHandler = input => {
        setPassword(input)
    }

    /**
     * update device when available device is selected
     * @param {*} index location of the device in the array of devices
     */
    const deviceHandler = index => {
        // if device is already checked, uncheck it 
        if (device && device.id === devices[index].id) {
            setDevice(null)
        } else {
            setDevice(devices[index])
        }
    }

    /**
     * get active Spotify devices again when refresh button is clicked
     */
    const refreshHandler = async () => {
        setIsLoading(true)
        await dispatch(deviceActions.getDevices())
        setIsLoading(false)
    }

    /**
     * verify that all the required fields are filled and then send create room request
     */
    const createHandler = () => {
        let isValid = true

        // verify room name
        if (!roomName) {
            setNameError('Please enter a room name above')
            isValid = false
        } else {
            setNameError('')
        }

        // verify device
        if (!device) {
            setDeviceError('Please make sure a device is selected')
            isValid = false
        } else {
            setDeviceError('')
        }

        if (isValid) {
            dispatch(roomActions.initRoom(roomName, password, device, userID))
        }
    }

    /**
     * Navigate the user back to the home screen
     */
    const homeHandler = () => {
        props.navigation.pop()
    }

    return (
        <CreateRoomScreenUI
            roomName={roomName}
            password={password}
            device={device}
            roomNameHandler={roomNameHandler}
            passwordHandler={passwordHandler}
            devices={devices}
            refreshHandler={refreshHandler}
            deviceHandler={deviceHandler}
            isLoading={isLoading}
            nameError={nameError}
            passError={passError}
            deviceError={deviceError}
            createHandler={createHandler}
            homeHandler={homeHandler}
        />
    )
}

export default CreateRoomScreen