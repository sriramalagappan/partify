import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'

export const SET_POSITION = 'SET_POSITION'
export const RESET_POSITION = 'RESET_POSITION'


/**
 * Starts playback on the user's selected device
 * @param {*} deviceID Device ID to play song on 
 * @param {*} playlistURI Spotify URI of the playlist to play from
 * @param {*} position Time in ms to start playback of song at
 * @param {*} index Position in playlist to begin playback
 */
export const startPlayback = (deviceID, playlistURI, position, index) => {
    return async dispatch => {
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

            dispatch({ type: RESET_POSITION })
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Pauses the user's playback
 * @param {*} deviceID Device ID to target action
 */
export const pausePlayback = (deviceID) => {
    return async dispatch => {
        try {
            await checkToken()
            const accessToken = await getUserData('accessToken')
            const auth = 'Bearer ' + accessToken
            await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': auth,
                },
            });

            const response = await fetch('https://api.spotify.com/v1/me/player', {
                method: 'GET',
                headers: {
                    'Authorization': auth,
                },
            });

            const resData = await response.json()
            const position_ms = resData.progress_ms

            dispatch({ type: SET_POSITION, position_ms })
        } catch (err) {
            console.log(err)
        }
    }
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