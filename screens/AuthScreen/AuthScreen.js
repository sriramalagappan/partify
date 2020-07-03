import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthScreenUI from './AuthScreenUI'
import getAuthorizationCode from '../../authentication/spotify_auth'
import getTokens from '../../authentication/spotify_token'
import * as userActions from '../../store/actions/user'
import * as roomActions from '../../store/actions/room'
import FirebaseAuth from '../../authentication/firebase_auth'
import checkTokenFirebase from '../../authentication/firebase_check'
import getUserData from '../../misc/getUserData'

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

    /**
     * login handler (attempt to login to spotify)
     */
    const loginHandler = async () => {

        FirebaseAuth.shared = new FirebaseAuth()

        // get spotify credentials first
        await checkTokenFirebase()
        const fbToken = await getUserData('fb_accessToken')
        const response = await fetch(`https://us-central1-partify-58cd0.cloudfunctions.net/message?auth=${fbToken}`)
        const credentials = await response.json()

        const authCode = await getAuthorizationCode(credentials)
        if (authCode) {
            try {
                await getTokens(authCode, credentials)
                dispatch(userActions.initUser())
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