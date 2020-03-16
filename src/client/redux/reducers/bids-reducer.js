import { DataAPI } from "../../api/index";

const SET_BIDS_LIST = 'SET_BIDS_LIST';
const DELETE_REPLY_MESSAGE = 'DELETE_REPLY_MESSAGE';
const SET_CURRENT_STATE = 'SET_CURRENT_STATE';
// ------
const SET_BID_PROP = 'SET_BID_PROP';
const SET_BID_SPEC = 'SET_BID_SPEC';
const SET_BID_DATA = 'SET_BID_DATA';
const SET_NEW_BID = 'SET_NEW_BID';
const ADD_ATTACHEMENT = 'ADD_ATTACHEMENT';
const SET_BID_US = 'SET_BID_US';

let initialState = {
    bidsList: [],
    styleDisplayOfMessages: "none",
    messagesList: [],
    current_reply_id: "",
    current_reply_text: "",
    // --------------------
    Bid: {
        specifications: [],
        userStory: [],
        loaded: false,
        attachement: [],
        attachement_count: 0
    },
    innerBid: {},
    BidMetadata: {},
    NowMessage: ''
};

export const BidsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BIDS_LIST:
            return {
                ...state,
                BidMetadata: action.BidMetadata,
                bidsList: action.bidsList,
                Bid: { ...action.Bid },
                innerBid: { ...action.innerBid },
                messagesList: action.messagesList.map((x) => { //сообщения не в том порядке. сделано тут т.к. в js это тупо проще реализуется
                    if ((x.children != undefined)) { x.children[0].data.childs.reverse() }
                    return x;
                })
            };
        case SET_NEW_BID:
            return {
                ...state,
                BidMetadata: { ...state.BidMetadata },
                bidsList: [...state.bidsList],
                innerBid: { ...state.innerBid },
                messagesList: [...state.messagesList],
                Bid: { ...state.innerBid }
            };
        case SET_CURRENT_STATE:
            return {
                ...state,
                Bid: { ...state.Bid, userStory: [...state.Bid.userStory], specifications: [...state.Bid.specifications] },
                BidMetadata: { ...state.BidMetadata },
                innerBid: { ...state.innerBid },
                bidsList: [...state.bidsList],
                messagesList: [...state.messagesList],
                [action.name]: action.data
            };
        case DELETE_REPLY_MESSAGE:
            return {
                ...state,
                Bid: { ...state.Bid, userStory: [...state.Bid.userStory], specifications: [...state.Bid.specifications] },
                BidMetadata: { ...state.BidMetadata },
                innerBid: { ...state.innerBid },
                bidsList: [...state.bidsList],
                current_reply_text: "",
                current_reply_id: "",
                messagesList: state.messagesList.filter(function (obj) { return obj.data.id != action.current_reply_id; })
            };
        case SET_BID_PROP:
            return {
                ...state,
                BidMetadata: { ...state.BidMetadata },
                messagesList: [...state.messagesList],
                innerBid: { ...state.innerBid },
                bidsList: [...state.bidsList],
                messagesList: [...state.messagesList],
                Bid: { ...state.Bid, userStory: [...state.Bid.userStory], specifications: [...state.Bid.specifications], [action.property]: action.value }
            };
        case SET_BID_SPEC:
            return {
                ...state,
                BidMetadata: { ...state.BidMetadata },
                bidsList: [...state.bidsList],
                innerBid: { ...state.innerBid },
                messagesList: [...state.messagesList],
                Bid: {
                    ...state.Bid, userStory: [...state.Bid.userStory], specifications: ((action.id == '') ? [...state.Bid.specifications, action.value] : state.Bid.specifications.map((el, index) => {
                        if (action.id == index) { return action.value }
                        return el;
                    }))
                }
            };
        case SET_BID_DATA:
            return {
                ...state,
                BidMetadata: action.BidMetadata,
                bidsList: [...state.bidsList],
                innerBid: { ...state.innerBid },
                messagesList: [...state.messagesList],
                Bid: { ...action.Bid, loaded: true, fistInit: true }
            };
        case ADD_ATTACHEMENT:
            return {
                ...state,
                BidMetadata: state.BidMetadata,
                bidsList: [...state.bidsList],
                innerBid: { ...state.innerBid },
                messagesList: [...state.messagesList],
                Bid: { ...state.Bid, specifications: [...state.Bid.specifications], userStory: [...state.Bid.userStory], attachement: [...state.Bid.attachement, action.attachement], attachement_count: state.Bid.attachement_count + 1 }
            };
        case SET_BID_US:
            return {
                ...state,
                BidMetadata: { ...state.BidMetadata },
                bidsList: [...state.bidsList],
                innerBid: { ...state.innerBid },
                messagesList: [...state.messagesList],
                Bid: {
                    ...state.Bid, specifications: [...state.Bid.specifications], userStory: ((action.id == '') ? [...state.Bid.userStory, action.value] : state.Bid.userStory.map((el, index) => {
                        if (action.id == index) { return action.value }
                        return el;
                    }))
                }
            };
        default: return state;
    }
}

export const setCurrentState = (name, data) => (dispatch) => { dispatch({ type: SET_CURRENT_STATE, name: name, data: data }) }

export const getBidsList = () => async (dispatch, getState) => {
    const response = await DataAPI.getBidsList();
    // let NowPath = location.pathname.replace('/bids/', '');
    const nowState = getState();
    dispatch({
        type: SET_BIDS_LIST,
        bidsList: response.data.bidsList,
        messagesList: response.data.messagesList,
        BidMetadata: response.data.bidMetadata,
        Bid: (nowState.BidsPage.Bid.loaded ? nowState.BidsPage.Bid : { ...response.data.bid, loaded: true }),
        innerBid: { ...response.data.bid, loaded: true }
    });
}

export const sendReply = (id, text) => (dispatch) => {
    DataAPI.sendCurrentReply(id, text);
    dispatch({ type: DELETE_REPLY_MESSAGE, current_reply_id: id });
    alert("Успешно!");
}

export const pushButton = (type) => async (dispatch, getState) => {
    const nowState = getState();
    const response = await DataAPI.pushButton({ type: type, bidPage: nowState.BidsPage.Bid, bidNumber: nowState.BidsPage.Bid.number });
    if (response.data.error) { dispatch({ type: SET_CURRENT_STATE, name: 'NowMessage', data: response.data.message }) }
    else { dispatch({ type: SET_CURRENT_STATE, name: 'Bid', data: { ...response.data.bid, loaded: true } }) }
}

export const setBidSpec = (id = '', value = '') => (dispatch) => { dispatch({ type: SET_BID_SPEC, id: id, value: value }) }
export const setUserStory = (id = '', value = '') => (dispatch) => { dispatch({ type: SET_BID_US, id: id, value: value }) }
export const setBidProp = (property, value) => (dispatch) => { dispatch({ type: SET_BID_PROP, property: property, value: value }) }
export const getBidData = (number) => async (dispatch) => {
    dispatch({ type: SET_BID_PROP, property: 'loaded', value: false });
    const response = await DataAPI.getBidData(number);
    dispatch({ type: SET_BID_DATA, Bid: response.data.bid, BidMetadata: response.data.bidMetadata });
}
export const setNewBidData = () => (dispatch, getState) => {
    const nowState = getState();
    // если это переход по ссылке внутри реакта, а не ввод в адресную строку ссылки, сбросим данные заявки
    if (JSON.stringify(nowState.BidsPage.BidMetadata) != '{}') { dispatch({ type: SET_NEW_BID }) }
}
export const setNewAttachement = (attachement) => async (dispatch) => {dispatch({ type: ADD_ATTACHEMENT, attachement: attachement }); }

export default BidsReducer;