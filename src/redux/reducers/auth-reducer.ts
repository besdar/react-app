import { AuthAPI } from "../../api/auth-api";
import { BaseThunkType, InferActionsTypes } from '../store/redux-store';
import NodeRSA from 'node-rsa';
import { FormAction } from 'redux-form/lib/actions';

let initialState = {
    token: '',
    isAuth: false,
    open_security_key: '',
    secret_key: '',
    formData: {
        username: '',
        passwd: '',
        NotTrustedDevice: false
    },
    message: '',
    authCount: 0
};

export type formType = typeof initialState.formData;
type formKeysType = keyof formType;

const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SET_AUTH_USER_DATA':
            return {
                ...state,
                isAuth: action.isAuth,
                token: action.token,
                formData: {
                    ...initialState.formData
                }
            }
        case 'SET_AUTH_KEY':
            return {
                ...state,
                open_security_key: action.open_security_key,
                secret_key: action.secret_key,
                isAuth: action.isAuth
            }
        case 'SET_STATE':
            return {
                ...state,
                [action.name]: action.data
            }
        case 'SET_FORM_STATE':
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [action.name]: action.data
                }
            }
        case 'SET_ERROR_MESSAGE':
            return {
                ...state,
                formData: {
                    ...state.formData,
                    passwd: ''
                },
                message: action.message,
                authCount: state.authCount + 1
            }
        default:
            return state;
    }
}

const actions = {
    setAuthUserData: (token: string, isAuth: boolean) => ({ type: 'SET_AUTH_USER_DATA', token: token, isAuth: isAuth } as const),
    setAuthSecurityKey: (open_security_key: string, secret_key: string, isAuth = false) => ({ type: 'SET_AUTH_KEY', open_security_key: open_security_key, secret_key: secret_key, isAuth: isAuth } as const),
    setCurrentState: (name: keyof typeof initialState, data: string | boolean | number) => ({ type: 'SET_STATE', name: name, data: data } as const),
    setFormData: (name: formKeysType, data: string | boolean) => ({ type: 'SET_FORM_STATE', name: name, data: data } as const),
    setErrorMessage: (message = '') => ({type: 'SET_ERROR_MESSAGE', message: message} as const)
}

// const setCurrentState = (name: "message", data: string): ThunkType => async (dispatch) => { dispatch(actions.setCurrentState(name, data)) }
export const setFormData = (name: formKeysType, data: string | boolean): ThunkType => async (dispatch) => { dispatch(actions.setFormData(name, data)) }

export const getAuthUserData = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState();
    if (!nowState.AuthReducer.isAuth) {
        const response = await AuthAPI.checkToken(nowState.AuthReducer.token);
        if (typeof response === "string") { dispatch(actions.setErrorMessage(response)) }
        else if (response.valid !== true) { dispatch(actions.setAuthSecurityKey(response.open_key, response.secret_key)) } // secret_key is encrypted
        else { dispatch(actions.setAuthSecurityKey(response.open_key, response.secret_key, true)) }
    }
}

export const login = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState();

    let key = new NodeRSA();
    key.importKey(nowState.AuthReducer.open_security_key, 'pkcs8-public-pem');
    
    const response = await AuthAPI.login({ credentials: key.encrypt(nowState.AuthReducer.formData, 'base64'), secret_key: nowState.AuthReducer.secret_key });
    
    if (typeof response === "string") { dispatch(actions.setErrorMessage(response)) }
    else { dispatch(actions.setAuthUserData(response.token, true)) }
}

export const logout = (): ThunkType => async (dispatch) => {
    AuthAPI.logout();
    dispatch(actions.setAuthUserData('', false));
}

export default authReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;

// thunk types //
// нужно заменить на typeof
export type setFormDataType = (name: formKeysType, data: string | boolean) => void;
export type getAuthUserDataType = () => void;
export type loginType = () => void;
export type logoutType = () => void;