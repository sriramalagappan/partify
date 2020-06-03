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
                    playlistID: playlistResData.id,
                    hostID: userID
                })
            })

            const resData = await response.json()
            
            dispatch({
                type: INIT_ROOM,
                roomName,
                device,
                roomID: resData.name,
                uri: playlistResData.uri,
                playlistID: playlistResData.id,
                userType: 'host',
            })
        } catch (err) {
            console.log(err)
        }
    }
}

export const joinRoom = (roomName, userID) => {
    return async dispatch => {
        try {
            const fbToken = await getUserData('fb_accessToken')
            const rooms = await fetch(`https://partify-58cd0.firebaseio.com/rooms.json?auth=${fbToken}`)
            const roomData = await rooms.json()

            //TODO
            let userType = 'admin';

            for (const key in roomData) {
                if(roomData[key].roomName === roomName) {
                    if (roomData[key].hostID === userID) {  
                        userType = 'host'
                    }

                    dispatch({
                        type: INIT_ROOM,
                        roomName,
                        device: roomData[key].device,
                        roomID: key,
                        uri: roomData[key].uri,
                        playlistID: roomData[key].playlistID,
                        userType,
                    })
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}
