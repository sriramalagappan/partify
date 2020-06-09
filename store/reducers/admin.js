import { SENT_REQUEST, CLEAR_REQUEST } from '../actions/admin'

const initialState = {
    sentRequest: false,
}

const adminReducer = (state = initialState, action) => {
    switch(action.type) {
        case SENT_REQUEST: {
            return {
                sentRequest: true,
            }
        }
        case CLEAR_REQUEST: {
            return {
                sentRequest: false,
            }
        }
        default: {
            return state
        }
    }
}

export default adminReducer