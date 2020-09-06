import axios from "axios";
import { CardNames, CardType } from "../redux/reducers/taskboard-reducer";
import { TaskType, TaskMetadataType } from "../redux/reducers/task-reducer";

export type pushTaskButtonObjectType = 'Сохранить' | 'СменитьСтатусЗадачи' | 'СменитьПриоритетЗадачи';
type taskObjectType = {
    status?: string,
    taskPage?: TaskType,
    type: pushTaskButtonObjectType
}

export type changeStatusResponseType = {
    newStatus: CardNames | '',
    data: CardType
}

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const TaskAPI = {
    getTaskData(number: string): Promise<string | {task: TaskType, taskMetadata: TaskMetadataType}> {return axios.post('/GetTaskData', {number: number}).then(res => res.data).catch((error) => (error.message))},
    pushTaskButton(TaskObject: taskObjectType, number: string): Promise<string | changeStatusResponseType | {Task: TaskType}> {return axios.post('/pushTaskButton', {TaskObject: TaskObject, number: number}).then(res => res.data).catch((error) => (error.message))}
}