const USER_LOGGED_IN = 'USER_LOGGED_IN';
const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

const initialState = {
    user: {},
    isAuthenticated: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGGED_IN:
            return { ...state, isAuthenticated: true, user: action.payload };
        case USER_LOGGED_OUT:
            return { ...state, isAuthenticated: false, user: {} };
        default:
            return state;
    }
}

const userLoggedIn = user => {
    return {
        type: USER_LOGGED_IN,
        payload: user
    }
}

const userLoggedOut = () => {
    return {
        type: USER_LOGGED_OUT,
    }
}

export { userLoggedIn, userLoggedOut };
export default reducer;
