import * as axios from "axios";

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const DataAPI = {
    GetPanelMenu() {return axios.post(window.location.origin + '/GetParadocsMenu')},
    getBidsList() {return axios.post(window.location.origin + '/GetBidsList')},
    getParadocsTexts(uid) {return axios.post(window.location.origin + '/getParadocsTexts', {uid: uid})},
    SaveCurrentEditor(LineNumber, uid, text) {return axios.post(window.location.origin + '/SaveCurrentEditor', {number: LineNumber, uid: uid, text: text})},
    SaveCurrentEditors(ArrayOfEditors, uid) {return axios.post(window.location.origin + '/SaveCurrentEditors', {ArrayOfEditors: ArrayOfEditors, uid: uid})},
    sendCurrentReply(current_reply_id, current_reply_text) {return axios.post(window.location.origin + '/sendCurrentReply', {CurrentReplyId: current_reply_id, CurrentReplyText: current_reply_text})},
    pushButton(BidObject) {return axios.post(window.location.origin + '/pushButton', {BidObject: BidObject})},
    getBidData(number) {return axios.post(window.location.origin + '/GetBidData', {number: number})}
}
