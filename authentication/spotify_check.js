import getUserData from '../misc/getUserData'
import refreshTokens from './spotify_refresh'

const checkToken = async () => {
  const tokenExpirationTime = await getUserData('expirationTime');
  if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
    // access token has expired, so we need to use the refresh token
    await refreshTokens();
  }
}

export default checkToken