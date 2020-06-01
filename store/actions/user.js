/*
 * user.js
 * Manages personal user information from spotify
*/

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
 * @param {string} userID The Spotify user ID for this user
 * @param {string} display_name The name displayed on the user profile. Null if not available
 * @param {Object} followers Object containing info of the user's Spotify followers
 */ 
export const initUser = (userID, display_name, followers) => {
    return { type: INIT_USER, userID, display_name, followers}
}