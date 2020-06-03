/*
 * devices.js
 * Manages the user's active Spotify devices
*/

import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'

export const GET_DEVICES = 'GET_DEVICES'
export const RESET_DEVICES = 'RESET_DEVICES'

/**
 * Removes all devices from the state
 */
export const resetDevices = () => {
    return { type: RESET_DEVICES }
}

/** 
 * Gets the user's active Spotify devices and saves them to the state
 */
export const getDevices = () => {
    return async dispatch => {
        try {
            await checkToken()
            const accessToken = await getUserData('accessToken')
            const auth = 'Bearer ' + accessToken
            const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
                method: 'GET',
                headers: {
                    'Authorization': auth,
                },
            });
            const resData = await response.json()
            dispatch({ type: GET_DEVICES, devices: resData.devices })
        } catch (err) {
            console.error(err);
        }
    }
}