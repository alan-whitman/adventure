const USER_LOGGED_IN = 'USER_LOGGED_IN';
const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
const CREATE_ALERT_MESSAGE = 'CREATE_ALERT_MESSAGE';
const SET_GAME = 'SET_GAME';

const initialState = {
    user: {},
    isAuthenticated: false,
    alertMessage: {},
    currentGame: {}
}

let alertCount = 0;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGGED_IN:
            return { ...state, isAuthenticated: true, user: action.payload };
        case USER_LOGGED_OUT:
            return { ...state, isAuthenticated: false, user: {} };
        case CREATE_ALERT_MESSAGE:
            alertCount = alertCount > 999 ? 0 : alertCount + 1;
            return {...state, alertMessage: {message: action.payload, alertCount}};
        case SET_GAME:
            return {...state, currentGame: action.payload};
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

const createAlertMessage = message =>  {
    return {
        type: CREATE_ALERT_MESSAGE,
        payload: message
    }
}

const setGame = game => {
    return {
        type: SET_GAME,
        payload: game
    }
}

export { userLoggedIn, userLoggedOut, createAlertMessage, setGame };
export default reducer;
