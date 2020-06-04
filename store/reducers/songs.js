import { PLAYLIST_SONGS, RESET_SONGS, SEARCH, KEEP } from '../actions/songs'

const initialState = {
    tracks: null,
    searchResults: null,
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
        default: {
            return state
        }
        case RESET_SONGS: {
            return initialState
        }
    }
}

export default deviceReducer