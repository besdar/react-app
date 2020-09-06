import axios from "axios";
import TreeNode from "primereact/components/treenode/TreeNode";

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const TasksAPI = {
    getTasksList(): Promise<string | {tasksList: Array<TreeNode>}> {return axios.post('/GetTasksList').then(res => res.data).catch((error) => (error.message))}
}