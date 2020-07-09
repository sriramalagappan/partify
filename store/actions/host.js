/*
 * host.js
 * Actions used by host-level users in room to send messages and update inforamtion on Firebase
*/

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
