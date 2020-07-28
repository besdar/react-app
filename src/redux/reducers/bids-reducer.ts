import { BidsAPI } from "../../api/bids-api";
import { BaseThunkType, InferActionsTypes } from '../store/redux-store';
import { setBidData } from "./bid-reducer";
import TreeNode from "primereact/components/treenode/TreeNode";

// модуль объективно перегружен, слишком много методов и свойств
// но заявка находится в одном модуле со списком заявки т.к. при открытии завки/списка
// инициализируется и заявка и список и методанные для заявки (если мы на форме списка или форме новой заявки - 
// инициализируется всё 1 запросом к 1С)

type attachementItemType = {
    link: string,
    value: string
}

type BidSpecType = {
    value: string,
    weight: number
}

type connectedBidsItem = {
    number: string,
    name: string,
    project: string,
    author: string,
    time: string,
    type: string,
    basement: string,
    status: string,
    childrens: Array<string>
}

export type projectSelectType = {
    label: string,
    value: projectSelectTypeValue
}

export type projectSelectTypeValue = {
    id: string,
    filterArray: Array<string>
}

type initialStateKeysType = keyof typeof initialState;

const initialState = {
    bidsList: [] as Array<TreeNode>, //данные для списка сделок
    styleDisplayOfMessages: "none" as "none" | "flex", // открытие/закрытие столбца обсуждений
    messagesList: [] as Array<TreeNode>, // список сообщений в обсуждении
    current_reply_id: "", // id в 1С к какому родителю прикрепляется новый ответ
    current_reply_text: "", // текст ответа
    projectSelectItems: [] as Array<projectSelectType>,
    selectedProjectSelectItems: [] as Array<projectSelectType>,
    // -------------------- конец данных для формы списка
    NowMessage: '' // текущее отображаемое сообщение
};

export const BidsReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SET_BIDS_LIST':
            return {
                ...state,
                bidsList: action.bidsList,
                messagesList: action.messagesList.map((x) => { //сообщения не в том порядке. сделано тут т.к. в js это тупо проще реализуется. надо переделать чтоб приходило правильно из 1С
                    if ((x.children !== undefined)) { x.children[0].data.childs.reverse() }
                    return x;
                }),
                projectSelectItems: action.projectSelectItems
            };
        case 'SET_CURRENT_STATE':
            return {
                ...state,
                bidsList: [...state.bidsList],
                messagesList: [...state.messagesList],
                [action.name]: action.data
            };
        case 'DELETE_REPLY_MESSAGE':
            // удаление происходит из массива таблицы при отправке ответа на вопрос обсуждения
            return {
                ...state,
                bidsList: [...state.bidsList],
                current_reply_text: "",
                current_reply_id: "",
                // eslint-disable-next-line
                messagesList: state.messagesList.filter(function (obj) { return obj.data.id != action.current_reply_id; })
            };
        default: return state;
    }
}

const actions = {
    setCurrentState: (name: initialStateKeysType, data: any) => ({ type: 'SET_CURRENT_STATE', name: name, data: data } as const),
    setBidsList: (bidsList: Array<TreeNode>, messagesList: Array<TreeNode>, projectSelectItems: Array<projectSelectType>) => ({ type: 'SET_BIDS_LIST', bidsList: bidsList, messagesList: messagesList, projectSelectItems: projectSelectItems} as const),
    deleteReplyMessage: (current_reply_id: string) => ({ type: 'DELETE_REPLY_MESSAGE', current_reply_id: current_reply_id } as const),
    setBidSpec: (id: string, value: string, name: string) => ({ type: 'SET_BID_SPEC', id: id, value: value, name: name } as const),
    setUserStory: (id: string, value: string) => ({ type: 'SET_BID_US', id: id, value: value } as const),
    setBidProp: (property: string, value: any) => ({ type: 'SET_BID_PROP', property: property, value: value } as const),
    addAttachement: (attachement: attachementItemType, attachement_link: attachementItemType) => ({ type: 'ADD_ATTACHEMENT', attachement: attachement, attachement_link: attachement_link } as const)
}

export const setBidsCurrentState = (name: initialStateKeysType, data: any): ThunkType => async (dispatch) => { dispatch(actions.setCurrentState(name, data)) }
export const setBidsSpec = (id = '', value = '', name = 'none'): ThunkType => async (dispatch) => { dispatch(actions.setBidSpec(id, value, name)) }
export const setBidsUserStory = (id = '', value = ''): ThunkType => async (dispatch) => { dispatch(actions.setUserStory(id, value )) }
export const setBidsProp = (property: string, value: any): ThunkType => async (dispatch) => { dispatch(actions.setBidProp(property, value)) }

export const getBidsList = (): ThunkType => async (dispatch) => {
    const response = await BidsAPI.getBidsList();
    if (typeof response === 'string') {alert(response)}
    else {
        dispatch(actions.setBidsList(response.bidsList, response.messagesList, response.bidMetadata.projectSelectItems));
        setBidData(response.bid, response.bidMetadata);
    }
}

export const sendBidsReply = (id: string, text: string): ThunkType => async (dispatch) => {
    if (id !== '') {
        BidsAPI.sendCurrentReply(id, text, 'null');
        dispatch(actions.deleteReplyMessage(id));
        alert("Успешно!");
    }
    else { alert("Что-то пошло не так :(") }
}

export const setBidsNewAttachement = (attachement: attachementItemType, attachement_link: attachementItemType): ThunkType=> async (dispatch) => { dispatch(actions.addAttachement(attachement, attachement_link)); }

export default BidsReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

// thunk types //
// нужно заменить на typeof
export type setBidsCurrentStateType = (name: initialStateKeysType, data: any) => void;
export type setBidsSpecType = (id?: string, value?: string, name?: string) => void;
export type setBidsPropType = (property: string, value: any) => void;
export type setBidsUserStoryType = (id?: string, value?: string) => void;
export type getBidsListType = () => void;
export type sendBidsReplyType = (id: string, text: string) => void;
export type setBidsNewAttachementType = (attachement: attachementItemType, attachement_link: attachementItemType) => void;