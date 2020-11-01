/*
 * player.js
 * Actions used by hosts to control Spotify playblack
*/

import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'
import * as hostActions from './host'

export const SET_POSITION = 'SET_POSITION'
export const RESET_POSITION = 'RESET_POSITION'
export const PAUSE = 'PAUSE'

/**
 * Starts playback on the user's selected device (host)
 * @param {*} deviceID Device ID to play song on 
 * @param {*} playlistURI Spotify URI of the playlist to play from
 * @param {*} position Time in ms to start playback of song at
 * @param {*} index Position in playlist to begin playback
 */
export const startPlayback = (deviceID, playlistURI, position, index, roomID) => {
    return async dispatch => {
        try {
            //console.log(deviceID, playlistURI, position, index)
            await checkToken()
            const accessToken = await getUserData('accessToken')
            const auth = 'Bearer ' + accessToken
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': auth,
                },
                body: JSON.stringify({
                    "context_uri": playlistURI,
                    "offset": {
                        "position": index
                    },
                    "position_ms": position
                })
            });

            // send playback info to everyone else in the room
            const playback = {
                playbackURI: playlistURI,
                is_playing: true,
                position_ms: position,
                index,
            }

            await hostActions.sendPlayback(roomID, playback)

            dispatch({ type: RESET_POSITION })
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Starts playback on the user's selected device (admin)
 * @param {*} deviceID Device ID to play song on 
 * @param {*} playlistURI Spotify URI of the playlist to play from
 * @param {*} position Time in ms to start playback of song at
 * @param {*} index Position in playlist to begin playback
 */
export const startPlaybackAdmin = async (deviceID, playlistURI, position, index) => {
    try {
        await checkToken()
        const accessToken = await getUserData('accessToken')
        const auth = 'Bearer ' + accessToken
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
            method: 'PUT',
            headers: {
                'Authorization': auth,
            },
            body: JSON.stringify({
                "context_uri": playlistURI,
                "offset": {
                    "position": index
                },
                "position_ms": position
            })
        });
    } catch (err) {
        console.log(err)
    }
}

/**
 * Pauses the user's playback (host)
 * @param {*} deviceID Device ID to target action
 */
export const pausePlayback = (deviceID, roomID) => {
    return async dispatch => {
        try {
            await checkToken()
            const accessToken = await getUserData('accessToken')
            const auth = 'Bearer ' + accessToken

            const response = await fetch('https://api.spotify.com/v1/me/player', {
                method: 'GET',
                headers: {
                    'Authorization': auth,
                },
            });

            const resData = await response.json()
            const position_ms = resData.progress_ms

            await silentPlayback(deviceID)
            await hostActions.sendPause(roomID)

            dispatch({ type: SET_POSITION, position_ms })
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Pauses the user's playback (admin)
 * @param {*} deviceID Device ID to target action
 */
export const pausePlaybackAdmin = async (deviceID) => {
    try {
        await checkToken()
        const accessToken = await getUserData('accessToken')
        const auth = 'Bearer ' + accessToken

        await fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
                'Authorization': auth,
            },
        });


        await silentPlayback(deviceID)

    } catch (err) {
        console.log(err)
    }
}

/**
 * Keeps Spotify Device active by playing a silent song in the background
 * @param {*} deviceID 
 */
export const silentPlayback = async (deviceID) => {
    await checkToken()
    const accessToken = await getUserData('accessToken')
    const auth = 'Bearer ' + accessToken
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
        method: 'PUT',
        headers: {
            'Authorization': auth,
        },
        body: JSON.stringify({
            "uris": ["spotify:track:5WgA26cAKD4kxZ8JAHDvXe"]
        })
    });
}

export const syncProgress = (position_ms) => {
    return { type: SET_POSITION, position_ms }
}

// /**
//  * Skips to next track in the user’s queue.
//  * @param {*} deviceID Device ID to target action
//  */
// export const skipNextPlayback = (deviceID) => {
//     return async dispatch => {
//         try {
//             await checkToken()
//             const accessToken = await getUserData('accessToken')
//             const auth = 'Bearer ' + accessToken
//             await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceID}`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': auth,
//                 },
//             });

//             dispatch({ type: RESET_POSITION })
//         } catch (err) {
//             console.log(err)
//         }
//     }
// }

// /**
//  * Skips to previous track in the user’s queue.
//  * @param {*} deviceID Device ID to target action
//  */
// export const skipPreviousPlayback = (deviceID) => {
//     return async dispatch => {
//         try {
//             await checkToken()
//             const accessToken = await getUserData('accessToken')
//             const auth = 'Bearer ' + accessToken
//             await fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceID}`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': auth,
//                 },
//             });

//             dispatch({ type: RESET_POSITION })
//         } catch (err) {
//             console.log(err)
//         }
//     }
// }

// export const getUserPlayback = () => {
//     return async dispatch => {
//         await checkToken()
//         const accessToken = await getUserData('accessToken')
//         const auth = 'Bearer ' + accessToken
//         const response = await fetch('https://api.spotify.com/v1/me/player', {
//             method: 'GET',
//             headers: {
//                 'Authorization': auth,
//             },
//         });

//         const resData = await response.json()

//         const position_ms = resData.progress_ms
//         const duration_ms = resData.item.album
//         const isPlaying = resData.is_playing 
//     }
// }