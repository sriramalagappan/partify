
import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'

export const PLAYLIST_SONGS = 'PLAYLIST_SONGS'
export const RESET_SONGS = 'RESET_SONGS'
export const SEARCH = 'SEARCH'

export const resetSongs = () => {
    return { type: RESET_SONGS }
}

export const findSongs = (songName) => {
    return async dispatch => {
        try {
            await checkToken()
            const accessToken = await getUserData('accessToken')
            const auth = 'Bearer ' + accessToken
            const response = await fetch(`https://api.spotify.com/v1/search?q=${songName}&type=track`, {
                method: 'GET',
                headers: {
                    'Authorization': auth,
                },
            });
            const resData = await response.json()
            dispatch({ type: SEARCH, search: resData.tracks.items})
        } catch (err) {
            console.log(err)
        }
    }
}

export const getPlaylistSongs = (playlistID) => {
    return async dispatch => {
        try {
            await checkToken()
            const accessToken = await getUserData('accessToken')
            const auth = 'Bearer ' + accessToken
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: 'GET',
                headers: {
                    'Authorization': auth,
                },
            });
            const resData = await response.json()
            dispatch({ type: PLAYLIST_SONGS, tracks: resData.items})
        } catch (err) {
            console.log(err)
        }
    }
}