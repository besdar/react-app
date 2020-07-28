import axios from "axios";
import { BidType, BidMetadataType, discussionDataType } from '../redux/reducers/bid-reducer';
import TreeNode from "primereact/components/treenode/TreeNode";
//import config from '../clientConfig';

type bidObjectType = {
    bidPage: BidType,
    type: string
}

type getBidsListResponseType = {
    bidsList: Array<TreeNode>,
    messagesList: Array<TreeNode>, 
    bidMetadata: BidMetadataType,
    bid: BidType
}

type getBidDataResponseType = {
    bid: BidType,
    bidMetadata: BidMetadataType
}

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const BidsAPI = {
    getBidsList() {return axios.post<getBidsListResponseType | string>('/GetBidsList').then(res => res.data).catch((error) => (error.message))},
    sendCurrentReply(current_reply_id: string, current_reply_text: string, bidNumber: string) {return axios.post<discussionDataType | string>('/pushBidButton', {BidObject: {CurrentReplyId: current_reply_id, CurrentReplyText: current_reply_text, bidNumber: bidNumber, type: 'ОтветОбсуждения'}}).then(res => res.data).catch((error) => (error.message))},
    pushBidButton(BidObject: bidObjectType, number: string) {return axios.post<BidType | string>('/pushBidButton', {BidObject: BidObject, number: number}).then(res => res.data).catch((error) => (error.message))},
    getBidData(number: string) {return axios.post<getBidDataResponseType | string>('/GetBidData', {number: number}).then(res => res.data).catch((error) => (error.message))}
}