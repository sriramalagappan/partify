import { INIT_USER, LOGOUT_USER } from '../actions/user'

const initialState = {
    userID: null,
    displayName: null,
    level: null,
}

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case INIT_USER: {
            return {
                userID: action.userID,
                displayName: action.display_name,
                level: action.level
            }
        }
        case LOGOUT_USER: {
            return initialState
        }
        default: {
            return state
        }
    }
}

export default userReducer