import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthScreenUI from './AuthScreenUI'
import getAuthorizationCode from '../../authentication/spotify_auth'
import getTokens from '../../authentication/spotify_token'
import * as userActions from '../../store/actions/user'

const AuthScreen = props => {

    // Redux Store State Variables
    const userID = useSelector(state => state.user.userID)
    console.log(userID)

    const dispatch = useDispatch()

    // route to home screen (done when user data is initalized)
    useEffect(() => {
        if (userID) {
            props.navigation.navigate('Home')
        }
    }, [userID])

    // login handler (attempt to login to spotify)
    const loginHandler = async () => {
        const authCode = await getAuthorizationCode()
        if (authCode) {
            try {
                await getTokens(authCode)
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

// AuthScreen.navigationOptions = navData => {
//     return {
//         headerTitle: 'Login',
//     }
// }

export default AuthScreen