import { INIT_ROOM, RESET_ROOM, GET_ROOMS, SET_INDEX, SEARCH_ROOMS, SYNC, RESET_SYNC } from '../actions/room'

const initialState = {
    roomID: null,
    roomName: '',
    device: null,
    uri: null,
    playlistID: null,
    userType: '',
    userRooms: [],
    fetchedRooms: false,
    index: -1,
    matches: [],
    syncData: false,
    position_ms: 0,
    duration: 0,
    is_playing: false,
    userDevice: null,
    playbackURI: null,
}

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_ROOM: {
            return {
                ...state,
                roomName: action.roomName,
                device: action.device,
                roomID: action.roomID,
                uri: action.uri,
                playlistID: action.playlistID,
                userType: action.userType,
                index: action.index,
                userDevice: action.userDevice
            }
        }
        case GET_ROOMS: {
            return {
                ...state,
                userRooms: action.userRooms,
                fetchedRooms: action.shouldUpdate,
            }
        }
        case SEARCH_ROOMS: {
            return {
                ...state,
                matches: action.matches
            }
        }
        case SET_INDEX: {
            return {
                ...state,
                index: action.index
            }
        }
        case SYNC: {
            return {
                ...state,
                index: action.index,
                position_ms: action.position_ms,
                duration: action.duration,
                is_playing: action.is_playing,
                playbackURI: action.playbackURI,
                syncData: true,
            }
        }
        case RESET_SYNC: {
            return {
                ...state,
                syncData: false,
                is_playing: false,
                duration: 0,
                position_ms: 0,
                playbackURI: null,
            }
        }
        case RESET_ROOM: {
            return {
                ...state,
                roomID: null,
                roomName: '',
                device: null,
                uri: null,
                playlistID: null,
                userType: '',
                fetchedRooms: false,
                index: 0,
                matches: [],
            }
        }
        default: {
            return state
        }
    }
}

export default roomReducer