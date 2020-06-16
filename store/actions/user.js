/*
 * user.js
 * Manages personal user information from spotify
*/

import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'

export const INIT_USER = 'INIT_USER'
export const LOGOUT_USER = 'LOG_OUT_USER'

/** 
 * Removes the user's information (called when logging out of the application)
 * 
 * Post: Reset the users's state to the initial state
 *
*/
export const logoutUser = () => {
    return { type: LOGOUT_USER }
}

/** 
 * Initialize the user with information provided from Spotify's API
 *
 * userID: The Spotify user ID for this user
 * 
 * display_name: The name displayed on the user profile. Null if not available
 * 
 * level: The users Spotify subscription level
 */
export const initUser = () => {
    return async dispatch => {
        try {
            await checkToken()
            const accessToken = await getUserData('accessToken')
            const auth = 'Bearer ' + accessToken
            const response = await fetch('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: {
                    'Authorization': auth,
                },
            });
            const resData = await response.json()
            dispatch({ type: INIT_USER, userID: resData.id, display_name: resData.display_name, level: resData.product })
        } catch (err) {
            console.error(err);
        }
    }
}