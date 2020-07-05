import { SET_POSITION, RESET_POSITION, PAUSE } from '../actions/player'

const initialState = {
    position_ms: 0,
    isPaused: true,
}

const playerReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_POSITION: {
            return {
                ...state,
                position_ms: action.position_ms
            }
        }
        case RESET_POSITION: {
            return {
                ...state,
                position_ms: 0
            }
        }
        default: {
            return state
        }
    }
}

export default playerReducer