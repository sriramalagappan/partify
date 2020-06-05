import { INIT_ROOM, RESET_ROOM } from '../actions/room'

const initialState = {
    roomID: null,
    roomName: '',
    device: null,
    uri: null,
    playlistID: null,
    userType: '',
}

const roomReducer = (state = initialState, action) => {
    switch(action.type) {
        case INIT_ROOM: {
            return {
                roomName: action.roomName,
                device: action.device,
                roomID: action.roomID,
                uid: action.uri,
                playlistID: action.playlistID,
                userType: action.userType
            }
        }
        case RESET_ROOM: {
            return initialState
        }
        default: {
            return state
        }
    }
}

export default roomReducer