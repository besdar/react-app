import { TasksAPI } from "../../api/tasks-api";
import { BaseThunkType, InferActionsTypes, ReturnObjectValuesType } from '../store/redux-store';
//import { setTaskData } from "./task-reducer";
import TreeNode from "primereact/components/treenode/TreeNode";
import { MenuItem } from "primereact/components/menuitem/MenuItem";
import { openLoginPage } from "../../commonFunctions";

type initialStateKeysType = keyof typeof initialState;
type ListOfAllowedItemsType = {
    currentStatus: string, 
    allowedStatuses: Array<string>
}

const initialState = {
    tasksList: [] as Array<TreeNode>, //данные для списка сделок
    NowMessage: '', // текущее отображаемое сообщение
    AllowedItems: [] as Array<MenuItem>, // строки в контекстном меню
    ListOfAllowedItems: [] as Array<ListOfAllowedItemsType>
};

export const TasksReducer = (state = initialState, action: ActionsType): TasksInitialStateType => {
    switch (action.type) {
        case 'SET_TASKS_LIST':
            return {
                ...state,
                tasksList: action.tasksList
            };
        case 'SET_CURRENT_STATE':
            return {
                ...state,
                tasksList: [...state.tasksList],
                [action.name]: action.data
            };
        default: return state;
    }
}

const actions = {
    setTasksCurrentState: (name: initialStateKeysType, data: ReturnObjectValuesType<TasksInitialStateType>) => ({ type: 'SET_CURRENT_STATE', name: name, data: data } as const),
    setTasksList: (tasksList: Array<TreeNode>) => ({ type: 'SET_TASKS_LIST', tasksList: tasksList} as const)
}

export const setTasksCurrentState = (name: initialStateKeysType, data: ReturnObjectValuesType<TasksInitialStateType>): ThunkType => async (dispatch) => { dispatch(actions.setTasksCurrentState(name, data)) }

export const getTasksList = (): ThunkType => async (dispatch) => {
    const response = await TasksAPI.getTasksList();
    if (typeof response === 'string') {
        if (response === 'Истек срок действия авторизации. Необходимо авторизоваться.') { openLoginPage() }
        else {alert(response)}
    } else {
        dispatch(actions.setTasksList(response.tasksList));
        //setTaskData(response.task, response.taskMetadata);
    }
}

export const setTasksContextMenu = (number: string, status: string): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TasksPage.ListOfAllowedItems;
    let foundedArray = [] as Array<string>;
    for (let i = 0; i < nowState.length; i++) {
        if (nowState[i].currentStatus === status) {
            foundedArray = nowState[i].allowedStatuses;
            break;
        }
    }
    
    dispatch(actions.setTasksCurrentState('AllowedItems', foundedArray.map((elem) => {
        return {
            label: elem,
            command: (event) => {
                //props???
            }
        }
    })));
}

export default TasksReducer;

export type TasksInitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

// thunk types //
export type setTasksCurrentStateType = typeof setTasksCurrentState;
export type getTasksListType = typeof getTasksList;
export type setTasksContextMenuType = typeof setTasksContextMenu;