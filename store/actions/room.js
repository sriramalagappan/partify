/*
 * room.js
 * Functionality for the user's rooms, including the current room, initializing 
 * new rooms, and leaving rooms 
*/

import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'
import checkTokenFirebase from '../../authentication/firebase_check'

export const INIT_ROOM = 'INIT_ROOM'
export const GET_ROOMS = 'GET_ROOMS'
export const RESET_ROOM = 'RESET_ROOM'
export const SET_INDEX = 'SET_INDEX'

/**
 * Removes room information from the state
 */
export const resetRoom = () => {
    return { type: RESET_ROOM }
}

/**
 * Create a new room and save information in Firebase
 * @param {*} roomName Name of the room that other users will use to join
 * @param {*} password (Optional) Password for the room
 * @param {*} device Information about the device used by the room for Spotify playback
 * @param {*} userID Spotify user ID
 */
export const initRoom = (roomName, password, device, userID) => {
    return async dispatch => {
        try {
            // first create a new spotify playlist that will be used for the room
            await checkToken()
            const spotifyToken = await getUserData('accessToken')
            const auth = 'Bearer ' + spotifyToken
            const playlistData = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: {
                    'Authorization': auth,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Partify: ' + roomName
                })
            });

            const playlistResData = await playlistData.json()

            // Post information to Firebase
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
                    hostID: userID,
                    index: 0,
                })
            })

            const resData = await response.json()

            // Update information in state
            dispatch({
                type: INIT_ROOM,
                roomName,
                device,
                roomID: resData.name,
                uri: playlistResData.uri,
                playlistID: playlistResData.id,
                userType: 'host',
                index: 0,
            })
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Join a room for the first time
 * @param {*} roomName Name of the room to join
 * @param {*} userID Spotify user ID of the person joining
 */
export const joinRoom = (roomName, userID) => {
    return async dispatch => {
        try {
            await checkTokenFirebase()
            const fbToken = await getUserData('fb_accessToken')
            const rooms = await fetch(`https://partify-58cd0.firebaseio.com/rooms.json?auth=${fbToken}`)
            const roomData = await rooms.json()

            //TODO
            let userType = 'admin';

            for (const key in roomData) {
                if (roomData[key].roomName === roomName) {
                    if (roomData[key].hostID === userID) {
                        userType = 'host'
                    } else {
                        // add user to the list of admins if they are not already in it
                        const admins = (roomData[key].admins) ? roomData[key].admins : []
                        if (admins.indexOf(userID) === -1) {
                            admins.push(userID)
                            await fetch(`https://partify-58cd0.firebaseio.com/rooms/${key}.json?auth=${fbToken}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ admins })
                            });
                        }
                    }

                    dispatch({
                        type: INIT_ROOM,
                        roomName,
                        device: roomData[key].device,
                        roomID: key,
                        uri: roomData[key].uri,
                        playlistID: roomData[key].playlistID,
                        userType,
                        index: roomData[key].index
                    })
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Rejoin a room
 * @param {*} roomID Firebase ID of the room to join
 * @param {*} userType The elevated status of the user (member, admin, host)
 */
export const rejoinRoom = (roomID, userType) => {
    return async dispatch => {
        await checkTokenFirebase()
        const fbToken = await getUserData('fb_accessToken')
        const response = await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}.json?auth=${fbToken}`)
        const resData = await response.json()

        const { roomName, device, uri, playlistID, index } = resData

        dispatch({
            type: INIT_ROOM,
            roomName,
            device,
            roomID,
            uri,
            playlistID,
            userType,
            index,
        })

    }
}

/**
 * Get all the rooms the user has currently joined and information about them
 * @param {*} userID Spotify user ID
 */
export const getUserRooms = (userID) => {
    return async dispatch => {
        try {
            await checkTokenFirebase()
            const fbToken = await getUserData('fb_accessToken')
            const rooms = await fetch(`https://partify-58cd0.firebaseio.com/rooms.json?auth=${fbToken}`)
            const roomData = await rooms.json()

            const userRooms = []

            for (const key in roomData) {
                let userType = ''
                // check if user is host
                if (roomData[key].hostID === userID) {
                    userType = 'host'
                }
                // otherwise check if user is an admin of the room
                else {
                    const { admins } = roomData[key]
                    if (admins) {
                        if (admins.indexOf(userID) !== -1) {
                            userType = 'admin'
                        }
                    }
                }

                // if user was a member of the room, append their name to the list of all rooms
                if (userType) {
                    userRooms.push({ name: roomData[key].roomName, time: roomData[key].currentTime, userType, roomID: key })
                }
            }
            dispatch({
                type: GET_ROOMS,
                userRooms
            })
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Set the index of the room with the given value.
 * Index is used to determine the position in the Spotify playlist given to the room
 * @param {*} newIndex Value of the new index
 * @param {*} roomID Firebase ID of the room
 */
export const setIndex = (newIndex, roomID) => {
    return async dispatch => {
        await checkTokenFirebase()
        const fbToken = await getUserData('fb_accessToken')
        await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}.json?auth=${fbToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index: newIndex })
        });

        dispatch({
            type: SET_INDEX,
            index: newIndex
        })
    }
}

/**
 * Get the current index of the room
 * @param {*} roomID Firebase ID of the room
 */
export const getIndex = (roomID) => {
    return async dispatch => {
        await checkTokenFirebase()
        const fbToken = await getUserData('fb_accessToken')
        const response = await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}.json?auth=${fbToken}`)
        const resData = await response.json()
        const newIndex = resData.index

        dispatch({
            type: SET_INDEX,
            index: newIndex
        })
    }
}
