import * as AuthSession from 'expo-auth-session';
import { Alert } from 'react-native'
import getUserData from '../misc/getUserData'
import setUserData from '../misc/setUserData'

const scopesArr = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-playback-state', 'playlist-modify-public', 'user-read-private', 'user-read-recently-played'];
const scopes = scopesArr.join(' ');

const getAuthorizationCode = async (credentials) => {
  try {
    const redirectUrl = credentials.redirectUri
    const prompt = await getUserData('logout')
    const result = await AuthSession.startAsync({
      authUrl:
        'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&show_dialog=' +
        prompt +
        '&client_id=' +
        credentials.clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' +
        encodeURIComponent(redirectUrl),
    })

    if (result.type !== 'success') {
      Alert.alert('An Error Occurred', 'Please try again or restart the app to login to Spotify', [{ text: 'Okay' }])
      return null;
    } else {
      // now that user logged in, set logout back to false
      await setUserData('logout', false)
      return result.params.code
    }

  } catch (err) {
    console.error(err)
  }
}

export default getAuthorizationCode