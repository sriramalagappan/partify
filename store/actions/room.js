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
export const SEARCH_ROOMS = 'SEARCH_ROOMS'

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
export const initRoom = (roomName, password, device, userID, displayName) => {
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
                    name: 'Partify: ' + roomName,
                    description: 'Playlist used by Partify. Please do not delete this room manually'
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
                    hostUsername: displayName,
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
 * @param {*} key Firebase key of the room to join
 * @param {*} userID Spotify user ID of the person joining
 */
export const joinRoom = (key, userID, name) => {
    return async dispatch => {
        try {
            await checkTokenFirebase()
            const fbToken = await getUserData('fb_accessToken')
            const response = await fetch(`https://partify-58cd0.firebaseio.com/rooms/${key}.json?auth=${fbToken}`)
            const roomData = await response.json()

            const { roomName, device, uri, playlistID, index } = roomData

            // add user as member of the room
            const users = (roomData.users) ? roomData.users : []
            users.push({id: userID, name, userType: 'member' })
            await fetch(`https://partify-58cd0.firebaseio.com/rooms/${key}.json?auth=${fbToken}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ users })
            });


            dispatch({
                type: INIT_ROOM,
                roomName,
                device,
                roomID: key,
                uri: uri,
                playlistID: playlistID,
                userType: 'member',
                index: index,
            })  
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
 * Search for rooms in the database that match the given parameter (name)
 * @param {*} name User provided name of a room they're searching for
 * @param {*} userID Spotify user ID
 */
export const searchRooms = (name, userID) => {
    return async dispatch => {
        try {
            await checkTokenFirebase()
            const fbToken = await getUserData('fb_accessToken')
            const rooms = await fetch(`https://partify-58cd0.firebaseio.com/rooms.json?auth=${fbToken}`)
            const roomData = await rooms.json()

            const matches = []

            for (const key in roomData) {
                if (roomData[key].roomName.includes(name)) {
                    // check if user is already in the room (then dont store in matches)
                    let valid = true;
                    // check if user isn't host
                    if (roomData[key].hostID === userID) {
                        valid = false;
                    }

                    // check if user isn't admin of the room
                    if (valid) {
                        const { admins } = roomData[key]
                        if (admins) {
                            if (admins.indexOf(userID) !== -1) {
                                valid = false;
                            }
                        }
                    }

                    if (valid) {
                        matches.push({ name: roomData[key].roomName, time: roomData[key].currentTime, hostUsername: roomData[key].hostUsername, password: roomData[key].password, id: key })
                    }
                }
            }

            dispatch({ type: SEARCH_ROOMS, matches })
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