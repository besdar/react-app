import { BidsAPI, pushBidButtonObjectType } from "../../api/bids-api";
import { BaseThunkType, InferActionsTypes, ReturnObjectValuesType } from '../store/redux-store';

export type attachementItemType = {
    link: string,
    value: string
}

export type BidSpecType = {
    value: string,
    weight: number,
    number: number
}

export type BidSpecUsersType = BidSpecType & {
    discussionData: discussionSpecUsersType
}

type discussionSpecUsersType = {
    id: string, // uid in 1C of discussion link. if empty then it's new line, that isn't in 1C yet
    value: string,
    count: number // count of discussions for table row 
}

type BidSpecTypeKeys = keyof BidSpecType | 'none';

type EnumBidType = {
    label: string, // отображение на фронте
    value: string | number // уид или индекс перечисления
}

type projectSelectType = {
    label: string,
    value: projectValueType
}

type projectValueType = typeof initialState.Bid.project;

type discussionDataItem = {
    id: string,
    dateString: string,
    text: string,
    title: string,
    type: string,
    position: 'left' | 'right',
    titleColor: string,
    isActual: boolean
}

export type connectedBidsItem = {
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

const initialState = {
    Bid: {
        specifications: [], // тех задание
        userStory: [], // задание заказчика
        attachement: [], // вложения ввиде бинарных строк
        attachement_links: [], // те же самые вложения но в виде ссылок для отображения, служит для подсчета количества
        number: "",
        name: "",
        customer: "",
        author: "",
        date: '',
        duration: 0,
        status: 'Заявка',
        project: {
            id: '',
            filterArray: []
        },
        priority: 1,
        mode: 0,
        type: 0,
        attachement_count: 0,
        paid_off: false,
        analisysStatus: 0,
        source: {
            number: "",
            value: ""
        },
        VisibilityAvailability: {
            invisible: ["Решение"],
            unavailable: []
        },
        solving: "",
        discussionData: {
            id: "",
            childs: []
        },
        nowReplyMessageId: "",
        connectedBids: [],
        linkedPeople: [],
        fistInit: false,
        loaded: false, // отвечает за отображение заглушки загрузки
        DialogDiscussionData: {
            isVisible: false,
            index: 0,
            DiscussionData: {
                id: '',
                value: '',
                count: 0 // we do not need it here, but it necessary in the type
            }
        },
        OpenTime: new Date(),
        expandedRows: []
    } as BidType,
    BidMetadata: {
        projectSelectItems: [] as Array<projectSelectType>,
        prioritySelectItems: [] as Array<EnumBidType>,
        typeSelectItems: [] as Array<EnumBidType>,
        modeSelectItems: [] as Array<EnumBidType>,
        statusSelectItems: [] as Array<EnumBidType>,
        customerSelectItems: [] as Array<EnumBidType>,
        initialNewBid: {} as BidType
    }, // возможные значения перечислений. загружаем 1 раз при старте приложения
    NowMessage: { life: 5000, severity: 'error' as 'success' | 'info' | 'warn' | 'error', summary: 'Ошибка', detail: '' } // текущее отображаемое сообщение
};

type initialStateKeys = keyof typeof initialState;
type BidKeysType = keyof BidType;
export type ErrorType = typeof initialState.NowMessage;
export type BidType = {
    specifications: Array<BidSpecType>, // тех задание
    userStory: Array<BidSpecUsersType>, // задание заказчика
    attachement: Array<attachementItemType>, // вложения ввиде бинарных строк
    attachement_links: Array<attachementItemType>, // те же самые вложения но в виде ссылок для отображения, служит для подсчета количества
    number: string,
    name: string,
    customer: string,
    author: string,
    date: string,
    duration: number,
    status: string,
    project: {
        id: string,
        filterArray: Array<string>
    },
    priority: number,
    mode: number,
    type: number,
    attachement_count: number,
    paid_off: boolean,
    analisysStatus: number,
    source: {
        number: string,
        value: string
    },
    VisibilityAvailability: {
        invisible: Array<string>,
        unavailable: Array<string>
    },
    solving: string,
    discussionData: {
        id: string,
        childs: Array<discussionDataItem>
    },
    nowReplyMessageId: string,
    connectedBids: Array<connectedBidsItem>,
    linkedPeople: Array<attachementItemType>,
    fistInit?: boolean,
    loaded: boolean, // отвечает за отображение заглушки загрузки
    DialogDiscussionData: {
        isVisible: boolean,
        index: number,
        DiscussionData: discussionSpecUsersType
    },
    OpenTime?: Date,
    expandedRows?: Array<any>
};
export type BidMetadataType = typeof initialState.BidMetadata;
export type discussionDataType = typeof initialState.Bid.discussionData;
export type bidTableNametype = 'specifications' | 'userStory';

export const BidReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SET_BID_DATA':
            return {
                ...state,
                BidMetadata: action.BidMetadata,
                Bid: { ...state.Bid, ...action.Bid, fistInit: action.firstInit, OpenTime: action.firstInit ? new Date(Date.now()) : state.Bid.OpenTime, loaded: true }, // дата открытия заявки для подсчета времени анализа (сервер)
                NowMessage: action.NowMessage
            };
        case 'SET_CURRENT_STATE':
            return {
                ...state,
                Bid: { ...state.Bid },
                BidMetadata: { ...state.BidMetadata },
                [action.name]: action.data
            };
        case 'SET_BID_PROP':
            return {
                ...state,
                BidMetadata: { ...state.BidMetadata },
                Bid: { ...state.Bid, [action.property]: action.value }
            };
        case 'SET_BID_SPEC':
            return {
                ...state,
                BidMetadata: { ...state.BidMetadata },
                Bid: {
                    // если id пустой то это новая строка ТЗ иначе это редактирование существующей
                    ...state.Bid, [action.tableName]: (
                        (action.id === '') ? 
                            // we will add new items
                            [...state.Bid[action.tableName], (action.tableName === 'specifications' ? 
                                // add new specification item
                                { weight: 0, value: '', number: state.Bid[action.tableName].length + 1, isItNew: true } : 
                                // add new UserStory item
                                { weight: 0, value: '', number: state.Bid[action.tableName].length + 1, isItNew: true, discussionData: {count: 0, id: '', value: ''}})] : 
                            // we'll change existing item
                            (state.Bid[action.tableName] as Array<BidSpecType | BidSpecUsersType>).map((el, index: number) => {
                                if (parseInt(action.id) === index + 1) { return { ...el, [action.name]: action.value } }
                                return el;
                            }))
                }
            };
        case 'ADD_ATTACHEMENT':
            return {
                ...state,
                BidMetadata: state.BidMetadata,
                Bid: { ...state.Bid, attachement: [...state.Bid.attachement, action.attachement], attachement_links: [...state.Bid.attachement_links, action.attachement_link] }
            };
        case 'SET_DISCUSSION_DATA':
            return {
                ...state,
                BidMetadata: state.BidMetadata,
                Bid: {
                    ...state.Bid,
                    discussionData: action.data
                }
            }
        default: return state;
    }
}

const actions = {
    setCurrentBidState: (name: initialStateKeys, data: ReturnObjectValuesType<InitialStateType>) => ({ type: 'SET_CURRENT_STATE', name: name, data: data } as const),
    setBidSpec: (id: string, value: ReturnObjectValuesType<BidSpecType>, name: keyof BidSpecUsersType | 'none', tableName: bidTableNametype) => ({ type: 'SET_BID_SPEC', id: id, value: value, name: name, tableName: tableName } as const),
    setBidProp: (property: BidKeysType, value: ReturnObjectValuesType<BidType>) => ({ type: 'SET_BID_PROP', property: property, value: value } as const),
    addAttachement: (attachement: attachementItemType, attachement_link: attachementItemType) => ({ type: 'ADD_ATTACHEMENT', attachement: attachement, attachement_link: attachement_link } as const),
    setBidData: (Bid: BidType, BidMetadata: BidMetadataType, firstInit = false, NowMessage = initialState.NowMessage) => ({ type: 'SET_BID_DATA', Bid: Bid, BidMetadata: BidMetadata, firstInit: firstInit, NowMessage: NowMessage } as const),
    setDiscussionData: (data: discussionDataType) => ({ type: 'SET_DISCUSSION_DATA', data: data } as const)
}

export const setCurrentBidState = (name: initialStateKeys, data: ReturnObjectValuesType<InitialStateType>): ThunkType => async (dispatch) => { dispatch(actions.setCurrentBidState(name, data)) }
export const showBidDiscussionDialog = (index: number): ThunkType => async (dispatch, getState) => { dispatch(actions.setBidProp('DialogDiscussionData', { isVisible: true, index: index - 1, DiscussionData: getState().BidPage.Bid.userStory[index - 1].discussionData}))}
export const setBidSpec = (tableName: bidTableNametype, id = '', value = '', name = 'none' as BidSpecTypeKeys): ThunkType => async (dispatch) => { dispatch(actions.setBidSpec(id, value, name, tableName)) }

export const setBidProp = (property: BidKeysType, value: ReturnObjectValuesType<BidType>): ThunkType => async (dispatch) => { dispatch(actions.setBidProp(property, value)) }
export const getBidData = (number: string): ThunkType => async (dispatch) => {
    dispatch(actions.setBidProp('loaded', false)); //надо сразу установить экран загрузки
    const response = await BidsAPI.getBidData(number);
    if (typeof response === 'string') { alert(response) }
    else {
        response.bidMetadata.projectSelectItems.forEach((element: projectSelectType, index: number) => {
            if (element.value.id === response.bid.project.id) {
                // value - object, so: 
                // response.data.bid.project == response.data.bidMetadata.projectSelectItems[index].value 
                // returns false if we do not update object ref
                response.bid.project = response.bidMetadata.projectSelectItems[index].value;
            }
        });
        dispatch(actions.setBidData(response.bid, response.bidMetadata, true));
    }
}

export const pushBidButton = (type: pushBidButtonObjectType): ThunkType => async (dispatch, getState) => {
    const nowState = getState().BidPage;
    const response = await BidsAPI.pushBidButton({ type: type, bidPage: nowState.Bid}, nowState.Bid.number);
    if (typeof response === "string") { dispatch(actions.setCurrentBidState('NowMessage', { ...nowState.NowMessage, detail: response })) }
    else { dispatch(actions.setBidData({ ...response, loaded: true }, nowState.BidMetadata, false, { life: 5000, severity: 'success', detail: 'Всё хорошо!', summary: 'Замечательно!' })) }
}

export const setNewBidData = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState().BidPage;
    // если это переход по ссылке внутри реакта, а не ввод в адресную строку ссылки, сбросим данные заявки
    if (nowState.BidMetadata.modeSelectItems.length) { dispatch(actions.setBidData(nowState.BidMetadata.initialNewBid, nowState.BidMetadata)) }
    else {
        const response = await BidsAPI.getBidData("NewBid");
        if (typeof response === 'string') { alert(response) }
        else { dispatch(actions.setBidData(response.bidMetadata.initialNewBid, response.bidMetadata)) }
    }
}
export const setBidData = (Bid: BidType, BidMetadata: BidMetadataType): ThunkType => async (dispatch, getState) => {
    const nowState = getState();
    dispatch(actions.setBidData((nowState.BidPage.Bid.loaded ? nowState.BidPage.Bid : { ...Bid, loaded: true }), BidMetadata));
}

export const sendBidReply = (id: string, text: string): ThunkType => async (dispatch, getState) => {
    const nowState = getState().BidPage;
    if (nowState.Bid.number !== '') {
        const response = await BidsAPI.sendCurrentReply(id, text, nowState.Bid.number);
        if (typeof response === "string") { dispatch(actions.setCurrentBidState('NowMessage', { ...nowState.NowMessage, detail: response })) }
        else {
            dispatch(actions.setDiscussionData(response));
            alert("Успешно!");
        }
    }
    else { alert("Обсуждения будут доступны только после сохранения заявки.") }
}

export const setNewBidAttachement = (attachement: attachementItemType, attachement_link: attachementItemType): ThunkType => async (dispatch) => { dispatch(actions.addAttachement(attachement, attachement_link)); }
export const createNewBidBaseOnThisBid = (type: 'СоздатьНаОснованииЗаявку' | 'СоздатьНаОснованииЗадачу'):ThunkType => async (dispatch, getState) => {
    const nowState = getState().BidPage;
    const response = await BidsAPI.pushBidButton({ type: type, bidPage: nowState.Bid }, nowState.Bid.number);
    if (typeof response === "string") { dispatch(actions.setCurrentBidState('NowMessage', { ...nowState.NowMessage, detail: response })) }
    else { 
        if (type === 'СоздатьНаОснованииЗаявку') { window.open(window.location.host + '/bids/' + response.number) }
        else {window.open(window.location.host + '/tasks/' + response.number)}
    }
}

export const sendBidDiscussionForUSLine = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState().BidPage;
    const response = await BidsAPI.pushBidButton({ type: 'ЗаписатьКомментарийПоСтрокеЗадания', bidPage: nowState.Bid}, nowState.Bid.number);
    if (typeof response === "string") { dispatch(actions.setCurrentBidState('NowMessage', { ...nowState.NowMessage, detail: response })) }
    else { dispatch(actions.setBidProp('DialogDiscussionData', initialState.Bid.DialogDiscussionData)) }
}

export default BidReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

// thunk types //
export type setCurrentBidStateType = typeof setCurrentBidState;
export type showBidDiscussionDialogType = typeof showBidDiscussionDialog;
export type setBidSpecType = typeof setBidSpec;
export type setBidPropType = typeof setBidProp;
export type getBidDataType = typeof getBidData;
export type pushBidButtonType = typeof pushBidButton;
export type setNewBidDataType = typeof setNewBidData;
export type setBidDataType = typeof setBidData;
export type setNewBidAttachementType = typeof setNewBidAttachement;
export type createNewBidBaseOnThisBidType = typeof createNewBidBaseOnThisBid;
export type sendBidDiscussionForUSLineType = typeof sendBidDiscussionForUSLine;
export type sendBidReplyType = typeof sendBidReply;