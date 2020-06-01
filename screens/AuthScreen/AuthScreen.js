import React, { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import AuthScreenUI from './AuthScreenUI'
import { Alert } from 'react-native'
import getAuthorizationCode from '../../authentication/spotify_auth'
import getTokens from '../../authentication/spotify_token'
import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'
import SpotifyWebApi from 'spotify-web-api-js'
import getUser from '../../authentication/spotify_user'

const AuthScreen = props => {
    // Stateful Variables and update functions 

    // Redux Store State Variables

    // save dispatch function in variable to use in hooks
    // const dispatch = useDispatch()

    const getUserPlaylists = async () => {
        const accessToken = await getUserData('accessToken')
        const auth = 'Bearer ' + accessToken
        const response = await fetch('https://api.spotify.com/v1/users/f0d6ot7pszg1ebwxy8gdqptz9/playlists?limit=3', {
          headers: {
            'Authorization': auth,
          },
        });
        const resData = await response.json()
        console.log(resData)
    };

    // login handler (attempt to login to spotify)
    const loginHandler = async () => {
        const authCode = await getAuthorizationCode()
        if (authCode) {
            await getTokens(authCode)
        }
    }

    const test = async () => {
        await checkToken()
        await getUserPlaylists()
    }

    return (
        <AuthScreenUI
            loginHandler={loginHandler}
            test={test}
        />
    )
}

AuthScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Login',
    }
}

export default AuthScreen