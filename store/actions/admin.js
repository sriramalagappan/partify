import checkTokenFirebase from '../../authentication/firebase_check'
import getUserData from '../../misc/getUserData'

export const SENT_REQUEST = 'SENT_REQUEST'

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