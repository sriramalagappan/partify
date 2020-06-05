
import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'

export const startPlayback = async (deviceID, currentURI, position) => {
    await checkToken()
    const accessToken = await getUserData('accessToken')
    const auth = 'Bearer ' + accessToken
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
        method: 'PUT',
        headers: {
            'Authorization': auth,
        },
        body: JSON.stringify({
            "uris": [currentURI],
            "position_ms": position
        })
    });
    // const resData = await response.json()
    // console.log(resData)
}  

export const pausePlayback = async (deviceID) => {
    await checkToken()
    const accessToken = await getUserData('accessToken')
    const auth = 'Bearer ' + accessToken
    await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceID}`, {
        method: 'PUT',
        headers: {
            'Authorization': auth,
        },
    });
    // const resData = await response.json()
    // console.log(resData)
}  