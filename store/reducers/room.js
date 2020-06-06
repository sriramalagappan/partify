import { INIT_ROOM, RESET_ROOM, GET_ROOMS, SET_INDEX } from '../actions/room'

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
        case SET_INDEX: {
            return {
                ...state,
                index: action.index
            }
        }
        default: {
            return state
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
    }
}

export default roomReducer