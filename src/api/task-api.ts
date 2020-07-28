import axios from "axios";
import { CardsType } from "../redux/reducers/taskboard-reducer";

// используется в доске и непонятно что имеется ввиду под TaskObject
type taskObjectType = {
    status?: string,
    type: 'СменитьСтатусЗадачи' | 'СменитьПриоритетЗадачи'
}

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const TaskAPI = {
    getTaskData(number: string) {return axios.post('/GetTaskData', {number: number}).then(res => res.data).catch((error) => (error.message))},
    pushTaskButton(TaskObject: taskObjectType, number: string) {return axios.post<string | {Cards: CardsType}>('/pushTaskButton', {TaskObject: TaskObject, number: number}).then(res => res.data).catch((error) => (error.message))}
}