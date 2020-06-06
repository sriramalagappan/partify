import { SET_POSITION, RESET_POSITION } from '../actions/player'

const initialState = {
    position_ms: 0
}

const playerReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_POSITION: {
            return {
                position_ms: action.position_ms
            }
        }
        case RESET_POSITION: {
            return {
                position_ms: 0
            }
        }
        default: {
            return state
        }
    }
}

export default playerReducer