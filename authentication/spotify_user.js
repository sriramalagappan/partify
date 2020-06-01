import getUserData from '../misc/getUserData'
import * as userActions from '../store/actions/user'
import { useDispatch } from 'react-redux'

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
    useDispatch(userActions.initUser(resData.id, resData.display_name, resData.followers))
  } catch (err) {
    console.error(err);
  }
}

export default getUser