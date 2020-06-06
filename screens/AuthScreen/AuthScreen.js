import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthScreenUI from './AuthScreenUI'
import getAuthorizationCode from '../../authentication/spotify_auth'
import getTokens from '../../authentication/spotify_token'
import * as userActions from '../../store/actions/user'
import * as roomActions from '../../store/actions/room'
import FirebaseAuth from '../../authentication/firebase_auth'

const AuthScreen = props => {

    // Redux Store State Variables
    const userID = useSelector(state => state.user.userID)
    const fetchedRooms = useSelector(state => state.room.fetchedRooms)

    const dispatch = useDispatch()

    // route to home screen (done when user data is initalized)
    useEffect(() => {
        if (fetchedRooms) {
            props.navigation.replace('Home')
        }
    }, [fetchedRooms])

    // fetch rooms
    useEffect(() => {
        if (userID) {
            dispatch(roomActions.getUserRooms(userID))
        }
    }, [userID])

    // login handler (attempt to login to spotify)
    const loginHandler = async () => {
        const authCode = await getAuthorizationCode()
        if (authCode) {
            try {
                await getTokens(authCode)
                dispatch(userActions.initUser())
                FirebaseAuth.shared = new FirebaseAuth()
            } catch (err) {
                console.log(err.message)
            }
        }
    }

    return (
        <AuthScreenUI
            loginHandler={loginHandler}
        />
    )
}

export default AuthScreen