import { PLAYLIST_SONGS, RESET_SONGS, SEARCH, RECENT } from '../actions/songs'

const initialState = {
    tracks: null,
    searchResults: null,
    recentTracks: null,
}

const deviceReducer = (state = initialState, action) => {
    switch(action.type) {
        case PLAYLIST_SONGS: {
            return {
                ...state,
                tracks: action.tracks
            }
        }
        case SEARCH: {
            return {
                ...state,
                searchResults: action.search
            }
        }
        case RECENT: {
            return {
                ...state,
                recentTracks: action.songs
            }
        }
        case RESET_SONGS: {
            return initialState
        }
        default: {
            return state
        }
    }
}

export default deviceReducer