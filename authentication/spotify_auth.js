import * as AuthSession from 'expo-auth-session';
import credentials from '../misc/secrets'
import { Alert } from 'react-native'

const scopesArr = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-playback-state', 'user-library-modify',
  'user-library-read', 'playlist-read-private', 'playlist-modify-public', 'user-read-private',
  'playlist-modify-private', 'user-read-recently-played', 'user-top-read'];
const scopes = scopesArr.join(' ');

const getAuthorizationCode = async () => {
  try {
    const redirectUrl = credentials.redirectUri
    const result = await AuthSession.startAsync({
      authUrl:
        'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
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
      return result.params.code
    }

  } catch (err) {
    console.error(err)
  }
}

export default getAuthorizationCode