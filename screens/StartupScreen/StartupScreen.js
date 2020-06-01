import React, { useEffect } from 'react'
import { AsyncStorage } from 'react-native' 
import StartupScreenUI from './StartupScreenUI'
import { useDispatch, useSelector } from 'react-redux'


const StartupScreen = props => {
    // save dispatch function in variable to use in hooks
    const dispatch = useDispatch()

    // Redux Store State Variables

    useEffect(() => {
        
    }, [dispatch])

    return (
        <StartupScreenUI />
    )
}

export default StartupScreen