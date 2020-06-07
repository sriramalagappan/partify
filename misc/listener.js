import firebase from 'firebase'; // 4.8.1
import checkTokenFirebase from '../authentication/firebase_check'

export const startListener = (roomID, callback) => {
    checkTokenFirebase()
    const location = '/rooms/' + roomID + '/message'
    const ref = firebase.database().ref(location)
    ref.on('value', snapshot => callback(snapshot))
}

export const stopListener = (roomID) => {
    checkTokenFirebase()
    const location = '/rooms' + roomID
    const ref = firebase.database().ref(location)
    ref.off()
}