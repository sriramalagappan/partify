import { encode as btoa } from 'base-64';
import credentials from '../misc/secrets'
import setUserData from '../misc/setUserData'

const getTokens = async (authCode) => {
  try {
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${
        credentials.redirectUri
      }`,
    });
    const responseJson = await response.json();
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = responseJson;

    console.log(accessToken)

    const expirationTime = new Date().getTime() + expiresIn * 1000;
    
    await setUserData('accessToken', accessToken);
    await setUserData('refreshToken', refreshToken);
    await setUserData('expirationTime', expirationTime);
  } catch (err) {
    console.error(err);
  }
}

export default getTokens