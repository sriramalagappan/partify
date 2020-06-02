import getUserData from '../misc/getUserData'
import refreshTokensFirebase from './firebase_refresh'

const checkTokenFirebase = async () => {
  const tokenExpirationTime = await getUserData('fb_expirationTime');
  if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
    // access token has expired, so we need to use the refresh token
    await refreshTokensFirebase();
  }
}

export default checkTokenFirebase