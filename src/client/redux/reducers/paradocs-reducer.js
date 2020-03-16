import { DataAPI } from "../../api/index";

const SET_PARADOCS_MENU = 'SET_PARADOCS_MENU';
const SET_PARADOCS_EDITORS = 'SET_PARADOCS_EDITORS';
const SET_EDITOR_STATE = 'SET_EDITOR_STATE';

let initialState = {
    items: [],
    editors: [],
    uid: "",
    editorModified: false,
    showPopup: false
};

export const ParadocsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PARADOCS_MENU:
            return {
                ...state,
                ...state.editors,
                items: action.items
            };
        case SET_PARADOCS_EDITORS:
            return {
                ...state,
                ...state.items,
                editors: action.editors,
                uid: action.uid
            };
        case SET_EDITOR_STATE:
                return {
                    ...state,
                    ...state.items,
                    ...state.editors,
                    editorModified: action.editorModified,
                    showPopup: action.showPopup
                };
        default:
            return state;
    }
}

export const setParadocsMenu = (items) => ({ type: SET_PARADOCS_MENU, items })
export const setParadocsEditors = (editors, uid) => ({ type: SET_PARADOCS_EDITORS, editors, uid })
export const setEditorState = (editorModified, showPopup) => ({ type: SET_EDITOR_STATE, editorModified, showPopup })


export const getParadocsMenu = () => async (dispatch) => {
    const response = await DataAPI.GetPanelMenu();
    dispatch(setParadocsMenu(response.data));
}

export const getParadocsEditors = (uid) => async (dispatch) => {
    const response = await DataAPI.getParadocsTexts(uid);
    dispatch(setParadocsEditors(response.data, uid));
    dispatch(setEditorState(false, false)); //при вставке текста через апи работает стандартный механизм редактирования (будто пользователь нажал контрл+с и контрл+в) и устанавливается признак редактирования текста в истину
}

export const SaveCurrentEditor = (LineNumber, uid, text) => async (dispatch) => {DataAPI.SaveCurrentEditor(LineNumber, uid, text)}

export const SaveCurrentEditors = (ArrayOfEditors, uid) => async (dispatch) => {DataAPI.SaveCurrentEditors(ArrayOfEditors, uid)}

export const DialogOnExit = (isModified) => async (dispatch) => {
    if (isModified) {dispatch(setEditorState(true, true))}
    else {dispatch(setEditorState(false, false))}
}

export default ParadocsReducer;