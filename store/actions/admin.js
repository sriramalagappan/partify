/*
 * admin.js
 * Actions used by admin-level users in room to send messages and update inforamtion on Firebase
*/

import checkTokenFirebase from '../../authentication/firebase_check'
import getUserData from '../../misc/getUserData'

export const SENT_REQUEST = 'SENT_REQUEST'
export const CLEAR_REQUEST = 'CLEAR_REQUEST'

/**
 * Send a message to the host phone through Firebase asking to add the given song
 * @param {*} songID Spotify ID of the song to add
 * @param {*} roomID Firebase ID of the room to post the request to
 * @param {*} userID The user ID of the person sending the request
 * @param {*} position Position in the playlist to insert the song
 */
export const sendAddSongRequest = (songID, roomID, userID) => {
    return async dispatch => {
        await checkTokenFirebase()
        const fbToken = await getUserData('fb_accessToken')
        await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: userID, to: 'HOST', type: 'ADD_SONG', body: { songID } })
        });

        dispatch({ type: SENT_REQUEST })
    }
}

/**
 * Clear the message folder in Firebase
 * @param {*} roomID Firebase ID of the room to post the request to
 */
export const clearMessage = (roomID) => {
    return async dispatch => {
        await checkTokenFirebase()
        const fbToken = await getUserData('fb_accessToken')
        await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: null, to: null, type: null, body: null })
        });

        dispatch({ type: CLEAR_REQUEST })
    }
}

/**
 * Send an update response to all phones in the room
 * @param {*} roomID Firebase ID of the room to post the request to
 * @param {*} userID The user ID of the person sending the request
 */
export const updateResponse = async (roomID, userID) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: 'EVERYONE', from: userID, type: 'UPDATE', body: 'sent' })
    });
}

/**
 * Clear just the body of the sent message (this is to allow a phone to send the same request twice)
 * 
 * @param {*} roomID Firebase ID of the room to post the request to
 */
export const clearBody = async (roomID) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: null })
    });
}

/**
 * Send a request to the host phone through Firebase asking to delete the given song
 * @param {*} songID Spotify ID of the song to add
 * @param {*} playlistID Spotify playlist ID
 * @param {*} position Position in the playlist to insert the song
 * @param {*} userID The user ID of the person sending the request
 * @param {*} roomID Firebase ID of the room to post the request to
 */
export const sendDeleteRequest = (songID, playlistID, position, userID, roomID) => {
    return async dispatch => {
        await checkTokenFirebase()
        const fbToken = await getUserData('fb_accessToken')
        await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: userID, to: 'HOST', type: 'DELETE_SONG', body: { songID, position, playlistID } })
        });

        dispatch({ type: SENT_REQUEST })
    }
}

/**
 * Check if the userID's request was recieved by the host or not
 * @param {*} roomID Firebase ID of the room to post the request to
 * @param {*} userID The user ID of the person sending the request
 */
export const checkRequest = async (roomID, userID) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    const response = await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`)
    const resData = await response.json()
    const { from } = resData
    if (from === userID) {
        return false;
    }
    return true;
}