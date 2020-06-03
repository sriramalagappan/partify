import fbConfig from '../constants/firebaseConfig'
import getUserData from '../misc/getUserData'
import setUserData from '../misc/setUserData'

const refreshTokensFirebase = async () => {
    try {
        const refreshToken = await getUserData('fb_refreshToken')
        const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${fbConfig.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`
        })
        const resData = await response.json();
        const newExpirationTime = new Date().getTime() + parseInt(resData.expires_in) * 1000;
        await setUserData('fb_accessToken', resData.access_token);
        await setUserData('fb_refreshToken', resData.refresh_token);
        await setUserData('fb_expirationTime', newExpirationTime);
    } catch (err) {
        console.log(err.message)
    }
}

export default refreshTokensFirebase