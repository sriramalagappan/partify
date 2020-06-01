import React, { useEffect } from 'react'
import StartupScreenUI from './StartupScreenUI'
import { useDispatch, useSelector } from 'react-redux'
import getUserData from '../../misc/getUserData'
import * as userActions from '../../store/actions/user'

const StartupScreen = props => {

    // Redux Store State Variables
    const userID = useSelector(state => state.user.userID)

    const dispatch = useDispatch()

    // route to home screen (done when user data is initalized)
    useEffect(() => {
        if (userID) {
            props.navigation.navigate('Home')
        }
    }, [userID])

    // See if the user's token is still valid. If so, get user data, otherwise route them
    // to auth screen
    useEffect(() => {
        const init = async () => {
            const tokenExpirationTime = await getUserData('expirationTime');
            const accessToken = await getUserData('accessToken');
            if (!tokenExpirationTime || !accessToken || new Date().getTime() > tokenExpirationTime) {
                props.navigation.navigate('Auth')
            } else {
                // get user data
                dispatch(userActions.initUser())
            }
        }
        init()
    }, [])

    return (
        <StartupScreenUI />
    )
}

export default StartupScreen