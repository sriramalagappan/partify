import getUserData from '../misc/getUserData'
import refreshTokensFirebase from './firebase_refresh'
import FirebaseAuth from './firebase_auth'


const checkTokenFirebase = async () => {
  const tokenExpirationTime = await getUserData('fb_expirationTime');
  if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
    // access token has expired, so we need to use the refresh token if its available, otherwise get new token
    const refreshToken = await getUserData('fb_refreshToken')
    if (refreshToken) {
      await refreshTokensFirebase();
    } else {
      // get user data
      FirebaseAuth.shared = new FirebaseAuth()
    }
  }
}

export default checkTokenFirebase