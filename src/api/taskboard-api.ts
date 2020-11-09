import axios from "axios";
import { CardsType, taskboardMetadataType } from "../redux/reducers/taskboard-reducer";
//import config from '../clientConfig';

type returnTaskboradDataType = {
    Cards: CardsType,
    Metadata: taskboardMetadataType
}

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const TaskboardAPI = {
    getTaskboardData(): Promise<string | returnTaskboradDataType> {return axios.post<string | returnTaskboradDataType>('/GetTaskboardData').then(res => res.data).catch((error) => (error.message))}
}