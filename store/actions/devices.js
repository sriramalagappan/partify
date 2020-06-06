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

/**
 * Check that the device provided still has an active Spotify window
 * @param {*} deviceID A Spotify ID of the device that will output the songs
 */
export const checkDevice = async (deviceID) => {
    try {
        // get active devices from Spotify
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

        // loop through the devices searching for an ID match
        let i = 0;
        let deviceFound = false
        if (resData.devices) {
        while (i < resData.devices.length && !deviceFound) {
            if (resData.devices[i].id === deviceID) {
                return true
            }
            i++;
        }
    }

        // if here, device was not found: return false
        return false

    } catch (err) {
        // if error, return false as well
        console.log(err)
        return false
    }
}