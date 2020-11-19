import { ParadocsAPI } from "../../api/paradocs-api";
import { BaseThunkType, InferActionsTypes } from '../store/redux-store';
import TreeNode from "primereact/components/treenode/TreeNode";

export type Editor = {
    text: string,
    heading?: string,
    id: number
}

const initialState = {
    items: [] as Array<TreeNode>, // список навигации парадокса 
    editors: [] as Array<Editor>, // тексты конкретной выбранной темы парадокса
    uid: "" as string, // уид отправляемого на сохранение
    editorModified: false as boolean, // для вопроса сохранения текста при сходе со страницы
    showPopup: false as boolean // отображение вопроса
};

export const ParadocsReducer = (state = initialState, action: ActionsType): ParadocsInitialStateType => {
    switch (action.type) {
        case 'SET_PARADOCS_MENU':
            return {
                ...state,
                ...state.editors,
                items: action.items
            };
        case 'SET_PARADOCS_EDITORS':
            return {
                ...state,
                ...state.items,
                editors: action.editors,
                uid: action.uid,
                editorModified: false, //при вставке текста через апи работает стандартный механизм редактирования (будто пользователь нажал контрл+с и контрл+в) и устанавливается признак редактирования текста в истину
                showPopup: false
            };
        case 'SET_EDITOR_STATE':
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

const actions = {
    setEditorState: (editorModified: boolean, showPopup: boolean) => ({ type: 'SET_EDITOR_STATE', editorModified: editorModified, showPopup: showPopup } as const),
    setParadocsMenu: (items: Array<TreeNode>) => ({ type: 'SET_PARADOCS_MENU', items: items } as const),
    setParadocsEditors: (editors: Array<Editor>, uid: string) => ({ type: 'SET_PARADOCS_EDITORS', editors: editors, uid: uid } as const)
}

export const setEditorState = (editorModified: boolean, showPopup: boolean): ThunkType => async (dispatch) => { dispatch(actions.setEditorState(editorModified, showPopup)) }

export const getParadocsMenu = (): ThunkType => async (dispatch) => {
    const response = await ParadocsAPI.GetPanelMenu();
    if (typeof response === 'string') {
        if (response === 'Истек срок действия авторизации. Необходимо авторизоваться.') { window.location.href = 'login' }
        else { alert(response) }
    }
    else { dispatch(actions.setParadocsMenu(response)); }
}

export const getParadocsEditors = (uid: string): ThunkType => async (dispatch) => {
    const response = await ParadocsAPI.getParadocsTexts(uid);
    if (typeof response === 'string') {
        if (response === 'Истек срок действия авторизации. Необходимо авторизоваться.') { window.location.href = 'login' }
        else { alert(response) }
    }
    else { dispatch(actions.setParadocsEditors(response, uid)); }
}

export const SaveCurrentEditor = (LineNumber: number, uid: string, text: string): void => { ParadocsAPI.SaveCurrentEditor(LineNumber, uid, text) }
export const SaveCurrentEditors = (ArrayOfEditors: Array<Editor>, uid: string): void => { ParadocsAPI.SaveCurrentEditors(ArrayOfEditors, uid) }
export const DialogOnExit = (isModified = false): ThunkType => async (dispatch) => { dispatch(actions.setEditorState(isModified, isModified)) }

export default ParadocsReducer;

export type ParadocsInitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

// thunk types //
export type setEditorStateType = typeof setEditorState;
export type getParadocsMenuType = typeof getParadocsMenu;
export type getParadocsEditorsType = typeof getParadocsEditors;
export type SaveCurrentEditorType = typeof SaveCurrentEditor;
export type SaveCurrentEditorsType = typeof SaveCurrentEditors;
export type DialogOnExitType = typeof DialogOnExit;