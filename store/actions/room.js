/*
 * room.js
 * Functionality for the user's rooms, including the current room, initializing 
 * new rooms, and leaving rooms 
*/

import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'
import checkTokenFirebase from '../../authentication/firebase_check'

export const INIT_ROOM = 'INIT_ROOM'
export const RESET_ROOM = 'RESET_ROOM'

/**
 * Removes room information from the state
 */
export const resetRoom = () => {
    return { type: RESET_ROOM }
}

export const initRoom = (roomName, password, device, userID) => {
    return async dispatch => {
        try {
            // first create a new spotify playlist that will be used for the room
            await checkToken()
            const spotifyToken = await getUserData('accessToken')
            const auth = 'Bearer ' + spotifyToken
            const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: {
                    'Authorization': auth,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Partify: ' + roomName
                })
            });

            const playlistResData = await playlistResponse.json()
            console.log(playlistResData)

            await checkTokenFirebase()
            const fbToken = await getUserData('fb_accessToken')
            const response = await fetch(`https://partify-58cd0.firebaseio.com/rooms.json?auth=${fbToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roomName,
                    password,
                    device,
                    uri: playlistResData.uri,
                    playlistID: playlistResData.id
                })
            })

            const resData = await response.json()
            
            dispatch({
                type: INIT_ROOM,
                roomName,
                device,
                roomID: resData.name
            })
        } catch (err) {
            console.log(err)
        }
    }
}
