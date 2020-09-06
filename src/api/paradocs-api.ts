import axios from "axios";
import { Editor } from "../redux/reducers/paradocs-reducer";
import TreeNode from "primereact/components/treenode/TreeNode";
//import config from '../clientConfig';

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const ParadocsAPI = {
    GetPanelMenu(): Promise<Array<TreeNode> | string> {return axios.post('/GetParadocsMenu').then(res => res.data).catch((error) => (error.message))},
    getParadocsTexts(uid: string): Promise<Array<Editor> | string> {return axios.post('/getParadocsTexts', {uid: uid}).then(res => res.data).catch((error) => (error.message))},
    SaveCurrentEditor(LineNumber: number, uid: string, text: string) {axios.post('/SaveCurrentEditor', {number: LineNumber, uid: uid, text: text}).catch((error) => (error.message))},
    SaveCurrentEditors(ArrayOfEditors: Array<Editor>, uid: string) {axios.post('/SaveCurrentEditors', {ArrayOfEditors: ArrayOfEditors, uid: uid}).catch((error) => (error.message))}
}