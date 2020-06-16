import { INIT_ROOM, RESET_ROOM, GET_ROOMS, SET_INDEX, SEARCH_ROOMS } from '../actions/room'

const initialState = {
    roomID: null,
    roomName: '',
    device: null,
    uri: null,
    playlistID: null,
    userType: '',
    userRooms: [],
    fetchedRooms: false,
    index: 0,
    matches: [],
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
                index: action.index
            }
        }
        case GET_ROOMS: {
            return {
                ...state,
                userRooms: action.userRooms,
                fetchedRooms: true,
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
            }
        }
        default: {
            return state
        }
    }
}

export default roomReducer