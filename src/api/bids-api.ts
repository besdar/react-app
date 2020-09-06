import axios from "axios";
import { BidType, BidMetadataType, discussionDataType } from '../redux/reducers/bid-reducer';
import TreeNode from "primereact/components/treenode/TreeNode";
//import config from '../clientConfig';

export type pushBidButtonObjectType = 'Сохранить' | 'Утверждено' | 'ПринятьЗаказчиком' 
| 'ЗапросНаУтверждение' | 'ОтветОбсуждения' | 'СоздатьНаОснованииЗаявку' | 'СоздатьНаОснованииЗадачу'
| 'ЗаписатьКомментарийПоСтрокеЗадания';
type bidObjectType = {
    bidPage: BidType,
    type: pushBidButtonObjectType
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
    getBidsList(): Promise<getBidsListResponseType | string> {return axios.post('/GetBidsList').then(res => res.data).catch((error) => (error.message))},
    sendCurrentReply(current_reply_id: string, current_reply_text: string, bidNumber: string): Promise<discussionDataType | string> {return axios.post('/pushBidButton', {BidObject: {CurrentReplyId: current_reply_id, CurrentReplyText: current_reply_text, bidNumber: bidNumber, type: 'ОтветОбсуждения'}, number: bidNumber}).then(res => res.data).catch((error) => (error.message))},
    pushBidButton(BidObject: bidObjectType, number: string): Promise<BidType | string> {return axios.post('/pushBidButton', {BidObject: BidObject, number: number}).then(res => res.data).catch((error) => (error.message))},
    getBidData(number: string): Promise<getBidDataResponseType | string> {return axios.post('/GetBidData', {number: number}).then(res => res.data).catch((error) => (error.message))}
}