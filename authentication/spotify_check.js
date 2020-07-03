import getUserData from '../misc/getUserData'
import refreshTokens from './spotify_refresh'
import checkTokenFirebase from './firebase_check'

const checkToken = async () => {
  const tokenExpirationTime = await getUserData('expirationTime');
  if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
    // access token has expired, so we need to use the refresh token

    // get credentials
    await checkTokenFirebase()
    const fbToken = await getUserData('fb_accessToken')
    const response = await fetch(`https://us-central1-partify-58cd0.cloudfunctions.net/message?auth=${fbToken}`)
    const credentials = await response.json()

    await refreshTokens(credentials);
  }
}

export default checkToken