import axios from "axios";

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const TasksAPI = {
    getSomeDataList(where: string, what: Array<string>, condition: Array<string>, order: Array<string>, page = 1, potionCount = 9999): Promise<string | Array<{[keys: string]: string | number}>> {return axios.post('/GetDataList', {dataReqObject: {what, where, condition, order, page, potionCount, type: 'getDynamicData'}}).then(res => res.data).catch((error) => (error.message))}
}