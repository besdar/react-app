import axios from "axios";
import { CardsType } from "../redux/reducers/taskboard-reducer";
//import config from '../clientConfig';

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const TaskboardAPI = {
    getTaskboardData(): Promise<string | {Cards: CardsType}> {return axios.post<string | {Cards: CardsType}>('/GetTaskboardData').then(res => res.data).catch((error) => (error.message))}
}