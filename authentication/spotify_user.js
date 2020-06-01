import setUserData from '../misc/setUserData'
import getUserData from '../misc/getUserData'

const getUser = async () => {
  try {
    const accessToken = await getUserData('accessToken')
    const auth = 'Bearer ' + accessToken
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': auth,
      },
    });
    const resData = await response.json()
  } catch (err) {
    console.error(err);
  }
}

export default getUser