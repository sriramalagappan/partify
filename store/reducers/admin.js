import { SENT_REQUEST } from '../actions/admin'

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
        default: {
            return state
        }
    }
}

export default adminReducer