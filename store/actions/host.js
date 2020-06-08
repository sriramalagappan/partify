import checkTokenFirebase from '../../authentication/firebase_check'
import getUserData from '../../misc/getUserData'

export const successResponse = async (customer, roomID) => {
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    await fetch(`https://partify-58cd0.firebaseio.com/rooms/${roomID}/message.json?auth=${fbToken}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: customer, from: 'host', type: 'SUCCESS', body: null })
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
        body: JSON.stringify({ to: customer, from: 'host', type: 'ERROR', body: errMessage })
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
        body: JSON.stringify({ to: 'EVERYONE', from: 'host', type: 'UPDATE', body: 'sent' })
    });
}
