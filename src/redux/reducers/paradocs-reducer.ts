import { ParadocsAPI } from "../../api/paradocs-api";
import { BaseThunkType, InferActionsTypes } from '../store/redux-store';
import TreeNode from "primereact/components/treenode/TreeNode";
import { openLoginPage } from "../../commonFunctions";

export type ParadocsEditorType = {
    text: string,
    heading: string,
    id: number, 
    isEditable?: boolean
}

const initialState = {
    items: [] as Array<TreeNode>, // список навигации парадокса 
    editors: [] as Array<ParadocsEditorType>, // тексты конкретной выбранной темы парадокса
    uid: "", // уид отправляемого на сохранение (элемент меню дерева)
    whichEditorsModified: [] as Array<number>, // для вопроса сохранения текста при сходе со страницы. номера страниц в которых есть изменения текста
    showPopup: false // отображение вопроса
};

export const ParadocsReducer = (state = initialState, action: ActionsType): ParadocsInitialStateType => {
    switch (action.type) {
        case 'SET_PARADOCS_MENU':
            return {
                ...state,
                items: action.items
            };
        case 'SET_PARADOCS_EDITORS':
            return {
                ...state,
                editors: action.editors,
                uid: action.uid === undefined ? state.uid : action.uid,
                whichEditorsModified: action.editorModified, //при вставке текста через апи работает стандартный механизм редактирования (будто пользователь нажал контрл+с и контрл+в) и устанавливается признак редактирования текста в истину
                showPopup: action.showPopup
            };
        case 'SET_EDITOR_EDITING_STATE':
            return {
                ...state,
                whichEditorsModified: action.editorModified, //при вставке текста через апи работает стандартный механизм редактирования (будто пользователь нажал контрл+с и контрл+в) и устанавливается признак редактирования текста в истину
                showPopup: action.showPopup
            };
        default:
            return state;
    }
}

const actions = {
    setEditorState: (editorModified = [] as Array<number>, showPopup = false) => ({ type: 'SET_EDITOR_EDITING_STATE', editorModified, showPopup } as const),
    setParadocsMenu: (items: Array<TreeNode>) => ({ type: 'SET_PARADOCS_MENU', items: items } as const),
    setParadocsEditors: (editors: Array<ParadocsEditorType>, uid?: string, editorModified = [] as Array<number>, showPopup = false) => ({ type: 'SET_PARADOCS_EDITORS', editors, uid, editorModified, showPopup } as const)
}

export const setEditorEditableState = (id: number, value: boolean): ThunkType => async (dispatch, getState) => {
    const nowState = getState().ParadocsPage;
    const nowStateEditors = [...nowState.editors];

    nowStateEditors[id - 1].isEditable = value;
    
    dispatch(actions.setParadocsEditors(nowStateEditors, nowState.uid, nowState.whichEditorsModified, nowState.showPopup));
}

export const setEditorState = (showPopup: boolean, text: string, id: number, isHeader = false): ThunkType => async (dispatch, getState) => {
    const nowState = getState().ParadocsPage;
    const nowStateModifiedEditors = [...nowState.whichEditorsModified];
    const nowStateEditors = [...nowState.editors];

    if (isHeader) { nowStateEditors[id - 1].heading = text }
    else { nowStateEditors[id - 1].text = text }

    if (!nowStateModifiedEditors.includes(id)) { nowStateModifiedEditors.push(id) }

    dispatch(actions.setParadocsEditors(nowStateEditors, undefined, nowStateModifiedEditors, showPopup));
}

export const getParadocsMenu = (): ThunkType => async (dispatch) => {
    const response = await ParadocsAPI.GetPanelMenu();
    if (typeof response === 'string') {
        if (response === 'Истек срок действия авторизации. Необходимо авторизоваться.') { openLoginPage() }
        else { alert(response) }
    }
    else { dispatch(actions.setParadocsMenu(response)); }
}

export const getParadocsEditors = (uid: string): ThunkType => async (dispatch) => {
    const response = await ParadocsAPI.getParadocsTexts(uid);
    if (typeof response === 'string') {
        if (response === 'Истек срок действия авторизации. Необходимо авторизоваться.') { openLoginPage() }
        else { alert(response) }
    }
    else { dispatch(actions.setParadocsEditors(response, uid)); }
}

export const SaveEditorsOnClick = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState().ParadocsPage;
    if (nowState.uid !== '' && nowState.editors.length) {
        ParadocsAPI.SaveCurrentEditors(nowState.editors, nowState.uid);
        dispatch(actions.setEditorState());
        alert('Сохранено');
    }
}

export const SaveCurrentEditor = (id: number):ThunkType => async (dispatch, getState) => {
    const nowState = getState().ParadocsPage;
    const nowStateModifiedEditors = [...nowState.whichEditorsModified];
    const editor = nowState.editors.find((elem) => {
        return elem.id === id
    });

    const index = nowStateModifiedEditors.indexOf(id);
    if (index !== -1) { nowStateModifiedEditors.splice(index, 1) }

    if (nowState.uid !== '' && editor !== undefined) {
        ParadocsAPI.SaveCurrentEditor(nowState.uid, editor);
        dispatch(actions.setParadocsEditors(nowState.editors, nowState.uid, nowStateModifiedEditors));
    }
}

export const DialogOnExit = (isModified = false): ThunkType => async (dispatch) => { dispatch(actions.setEditorState([], isModified)) }

export default ParadocsReducer;

export type ParadocsInitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

// thunk types //
export type setEditorStateType = typeof setEditorState;
export type getParadocsMenuType = typeof getParadocsMenu;
export type getParadocsEditorsType = typeof getParadocsEditors;
export type DialogOnExitType = typeof DialogOnExit;
export type SaveEditorsOnClickType = typeof SaveEditorsOnClick;
export type SaveCurrentEditorType = typeof SaveCurrentEditor;
export type setEditorEditableStateType = typeof setEditorEditableState;