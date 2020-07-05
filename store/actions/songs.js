/*
 * song.js
 * Manages song information, playlist songs, and searching for songs
*/

import getUserData from '../../misc/getUserData'
import checkToken from '../../authentication/spotify_check'

export const PLAYLIST_SONGS = 'PLAYLIST_SONGS'
export const RESET_SONGS = 'RESET_SONGS'
export const SEARCH = 'SEARCH'
export const RECENT = 'RECENT'
export const KEEP = 'KEEP'

/** 
 * Resets all song information
*/
export const resetSongs = () => {
    return { type: RESET_SONGS }
}

/**
 * Get Spotify Catalog information about albums, artists, playlists, tracks, shows or episodes that match a keyword string.
 * @param {*} songName Search query keyword
 */
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
            dispatch({ type: SEARCH, search: resData.tracks.items })
        } catch (err) {
            console.log(err)
        }
    }
}

export const getRecentSongs = () => {
    return async dispatch => {
        try {
            await checkToken()
            const accessToken = await getUserData('accessToken')
            const auth = 'Bearer ' + accessToken
            const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, {
                method: 'GET',
                headers: {
                    'Authorization': auth,
                },
            });
            const resData = await response.json()

            let tracks = resData.items;

            if (tracks) {
                tracks = tracks.filter((track) => {
                    return (track.track.uri !== "spotify:track:5WgA26cAKD4kxZ8JAHDvXe")
                })
            }

            dispatch({ type: RECENT, songs: tracks })
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Get full details of the tracks or episodes of a playlist owned by a Spotify user
 * @param {*} playlistID Spotify ID of the playlist
 */
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
            dispatch({ type: PLAYLIST_SONGS, tracks: resData.items })
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Add one or more items to a user’s playlist
 * @param {*} songID Spotify ID of the song to be added
 * @param {*} playlistID Spotify ID of the playlist
 */
export const addSong = async (songID, playlistID) => {
    try {
        await checkToken()
        const accessToken = await getUserData('accessToken')
        const auth = 'Bearer ' + accessToken

        // get last position to insert
        const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            method: 'GET',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            },
        });

        const playlistData = await playlistResponse.json()

        const length = (playlistData) ? playlistData.items.length : 0

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?uris=${songID}&position=${length}`, {
            method: 'POST',
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/json'
            },
        });
        const resData = await response.json()
        return (resData.error)
    } catch (err) {
        console.log(err)
    }
}

/**
 * Remove an item from a playlist.
 * @param {*} songID Spotify ID of song to be removed
 * @param {*} playlistID Spotify ID of playlist to remove the song from
 * @param {*} index Location of the song in the playlist
 */
export const deleteSong = (songID, playlistID, index) => {
    return async dispatch => {
        try {
            await checkToken()
            const accessToken = await getUserData('accessToken')
            const auth = 'Bearer ' + accessToken
            await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: 'DELETE',
                headers: {
                    'Authorization': auth,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tracks: [{ 'uri': songID, 'positions': [index] }]
                })
            });
            dispatch({ type: KEEP })
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Get the next song in a playlist from the given index if it exists
 * @param {*} playlistID Spotify ID of the playlist
 */
export const getNextSong = async (playlistID, newIndex) => {
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
        const playlist = resData.items
        if (newIndex < playlist.length) {
            return playlist[newIndex]
        } else {
            return null;
        }
    } catch (err) {
        console.log(err)
        return null;
    }
}