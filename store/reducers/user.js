import { INIT_USER, LOGOUT_USER } from '../actions/user'

const initialState = {
    userID: null,
    display_name: null,
    followers: null,
}

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case INIT_USER: {
            return {
                userID: action.userID,
                display_name: action.display_name,
                followers: action.followers
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