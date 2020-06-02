import firebase from 'firebase';
import setUserData from '../misc/setUserData'
import firebaseConfig from '../constants/firebaseConfig'

class FirebaseAuth {
    constructor() {
        this.init();
        this.listener();
        this.login();
    }

    init = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            firebase.analytics;
        }
    };

    login = () => {
        firebase.auth().signInAnonymously().catch((err) => {
            console.log(err.message)
        });
    }

    listener = () => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                // User signed in
                const data = user.toJSON()
                const fb_accessToken = data.stsTokenManager.accessToken
                const fb_expirationTime = data.stsTokenManager.expirationTime
                const fb_refreshToken = user.refreshToken
                const uid = user.uid
                await setUserData('fb_accessToken', fb_accessToken);
                await setUserData('fb_refreshToken', fb_refreshToken);
                await setUserData('fb_expirationTime', fb_expirationTime);
                await setUserData('uid', uid)
            } else {

            }
        });
    }
}

export default FirebaseAuth;
