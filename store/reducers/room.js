import { INIT_ROOM, RESET_ROOM } from '../actions/room'

const initialState = {
    roomID: null,
    roomName: '',
    device: null,
}

const roomReducer = (state = initialState, action) => {
    switch(action.type) {
        case INIT_ROOM: {
            return {
                roomName: action.roomName,
                device: action.device,
                roomID: action.roomID
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