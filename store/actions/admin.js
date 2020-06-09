import checkTokenFirebase from '../../authentication/firebase_check'
import getUserData from '../../misc/getUserData'

export const SENT_REQUEST = 'SENT_REQUEST'
export const CLEAR_REQUEST = 'CLEAR_REQUEST'

export const sendAddSongRequest = (songID, roomID, userID, position) => {
    return async dispatch => {
        await checkTokenFirebase()
        const fbToken = await getUserData('fb_accessToken')
        await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: userID, to: 'host', type: 'ADD_SONG', body: { songID, position } })
        });

        dispatch({ type: SENT_REQUEST })
    }
}

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

export const sendDeleteRequest = (songID, playlistID, position, userID, roomID) => {
    return async dispatch => {
        await checkTokenFirebase()
        const fbToken = await getUserData('fb_accessToken')
        await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ from: userID, to: 'host', type: 'DELETE_SONG', body: { songID, position, playlistID } })
        });

        dispatch({ type: SENT_REQUEST })
    }
}

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