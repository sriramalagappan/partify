/*
 * host.js
 * Actions used by host-level users in room to send messages and update inforamtion on Firebase
*/

import checkTokenFirebase from '../../authentication/firebase_check'
import checkToken from '../../authentication/spotify_check'
import getUserData from '../../misc/getUserData'

export const sendPause = async (roomID) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: 'EVERYONE', from: 'HOST', type: 'PAUSE', body: 'none' })
    });
}

export const sendPlayback = async (roomID, data) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: 'EVERYONE', from: 'HOST', type: 'CUR_PLAYBACK', body: data })
    });
}

export const sendCurPlayback = async (customer, roomID, index) => {
    await checkTokenFirebase()
    await checkToken()
    const spotifyToken = await getUserData('accessToken')
    const auth = 'Bearer ' + spotifyToken
    const response = await fetch(`https://api.spotify.com/v1/me/player`, {
        method: 'GET',
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json'
        }
    });

    const resData = await response.json()

    //console.log(resData)

    // get playlist songs
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/7BH0i51DYInHLiI4LFJAE4/tracks`, {
        method: 'GET',
        headers: {
            'Authorization': auth,
        },
    });
    const playlistData = await playlistResponse.json()
    const playlist = playlistData.items

    //console.log(playlistData)

    let i;
    for (i = index; i < playlist.length; i++) {
        if (resData.item.uri === playlist[i].track.uri) {
            // song found: send data to customer
            const curPlayback = {
                playbackURI: resData.context.uri,
                is_playing: resData.is_playing,
                position_ms: resData.progress_ms,
                index: i,
            }

            const fbToken = await getUserData('fb_accessToken')
            await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ to: customer, from: 'HOST', type: 'CUR_PLAYBACK', body: curPlayback })
            });

            // we are finished, return
            return;
        }
    }
}

export const successResponse = async (customer, roomID) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: customer, from: 'HOST', type: 'SUCCESS', body: null })
    });
}

export const failureResponse = async (customer, errMessage, roomID) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: customer, from: 'HOST', type: 'ERROR', body: errMessage })
    });
}

export const updateResponse = async (roomID) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: 'EVERYONE', from: 'HOST', type: 'UPDATE', body: 'sent' })
    });
}

// export const nextSongResponse = async (roomID, ) => {
//     await checkTokenFirebase()

//     curPlayback = {

//     }

//     const fbToken = await getUserData('fb_accessToken')
//     await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ to: 'EVERYONE', from: 'HOST', type: 'UPDATE', body: curPlayback })
//     });
// }

export const updateResponseFromCustomer = async (roomID, customer) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: 'EVERYONE', from: 'HOST', type: 'UPDATE', body: customer })
    });
}

export const updateRoomTime = async (roomID) => {
    const currentTime = Date.now()
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentTime })
    });
}

/**
 * Clear the message folder in Firebase
 * @param {*} roomID Firebase ID of the room to post the request to
 */
export const clearMessage = async (roomID) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from: null, to: null, type: null, body: null })
    });
}
