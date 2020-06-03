import { GET_DEVICES, RESET_DEVICES } from '../actions/devices'

const initialState = {
    devices: null,
}

const deviceReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_DEVICES: {
            return {
                devices: action.devices
            }
        }
        case RESET_DEVICES: {
            return initialState
        }
        default: {
            return state
        }
    }
}

export default deviceReducer