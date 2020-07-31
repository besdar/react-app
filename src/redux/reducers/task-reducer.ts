import { TaskAPI } from "../../api/task-api";
import { BaseThunkType, InferActionsTypes } from '../store/redux-store';
import { GrowlMessage } from "primereact/growl";

export type attachementItemType = {
    link: string,
    value: string
}

export type commentsItemType = {
    isActive: boolean,
    value: string,
    header: string
}

type TaskSpecTypeKeys = keyof TaskSpecType;
export type TaskSpecType = {
    value: string,
    number: number,
    isReady: boolean,
    testStatus: number,
    comments: Array<commentsItemType>
}

export type connectedTasksItem = {
    number: string,
    name: string,
    project: string,
    author: string,
    weight: number,
    type: string,
    basement: string,
    status: string
}

type EnumTaskType = {
    label: string, // отображение на фронте
    value: string | number // уид или индекс перечисления
}

type projectSelectType = {
    label: string,
    value: projectValueType
}

const initialState = {
    Task: {
        specification: {
            specifications: [] as Array<TaskSpecType>,
            selectedLineNumber: 0,
            commentFilters: {
                isActive: true as boolean | undefined
            }
        }, // тех задание
        attachement: [] as Array<attachementItemType>, // вложения ввиде бинарных строк
        attachement_links: [] as Array<attachementItemType>, // те же самые вложения но в виде ссылок для отображения, служит для подсчета количества
        number: "",
        name: "",
        customer: "",
        author: "",
        date: '',
        duration: 0,
        status: 0,
        project: {
            id: '',
            filterArray: [] as Array<string>
        },
        priority: 0,
        mode: 0,
        type: 0,
        attachement_count: 0,
        analisysStatus: 0,
        source: {
            number: "",
            value: ""
        },
        VisibilityAvailability: {
            invisible: [] as Array<string>,
            unavailable: [] as Array<string>
        },
        solving: "",
        nowReplyMessageId: "",
        connectedTasks: [] as Array<connectedTasksItem>,
        linkedPeople: [] as Array<attachementItemType>,
        fistInit: false as boolean | undefined,
        loaded: false, // отвечает за отображение заглушки загрузки
        OpenTime: new Date() as Date | undefined,
        maintainer: '',
        specificationWriter: '',
        designer: '',
        tester: '',
        expandedRows: [] as Array<any> | undefined,
        isNeedTest: true,
        weight: 0
    },
    TaskMetadata: {
        projectSelectItems: [] as Array<projectSelectType>,
        prioritySelectItems: [] as Array<EnumTaskType>,
        typeSelectItems: [] as Array<EnumTaskType>,
        modeSelectItems: [] as Array<EnumTaskType>,
        statusSelectItems: [] as Array<EnumTaskType>,
        customerSelectItems: [] as Array<EnumTaskType>,
        userSelectItems: [] as Array<EnumTaskType>
    }, // возможные значения перечислений. загружаем 1 раз при старте приложения
    NowMessage: { life: 5000, severity: 'error' as NowMessageSeverityType, summary: 'Ошибка', detail: '' } as GrowlMessage // текущее отображаемое сообщение
};

type initialStateKeys = keyof typeof initialState;
type TaskKeysType = keyof TaskType;
type projectValueType = typeof initialState.Task.project;
export type TaskType = typeof initialState.Task;
export type TaskMetadataType = typeof initialState.TaskMetadata;
export type specificationType = typeof initialState.Task.specification;
type specificationKeystype = keyof specificationType;
export type ErrorType = typeof initialState.NowMessage;
type NowMessageSeverityType = 'success' | 'info' | 'warn' | 'error';

export const TaskReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SET_TASK_DATA':
            return {
                ...state,
                TaskMetadata: action.TaskMetadata,
                Task: { ...state.Task, ...action.Task, fistInit: action.firstInit, OpenTime: action.firstInit ? new Date(Date.now()) : state.Task.OpenTime, loaded: true }, // дата открытия заявки для подсчета времени анализа (сервер)
                NowMessage: action.NowMessage
            };
        case 'SET_CURRENT_STATE':
            return {
                ...state,
                [action.name]: action.data
            };
        case 'SET_TASK_PROP':
            return {
                ...state,
                Task: { ...state.Task, [action.property]: action.value }
            };
        case 'SET_TASK_SPEC':
            return {
                ...state,
                Task: {
                    // если id пустой то это новая строка ТЗ иначе это редактирование существующей
                    ...state.Task, specification: {
                        ...state.Task.specification,
                        selectedLineNumber: (action.id === '') ? state.Task.specification.specifications.length + 1 : parseInt(action.id) - 1,
                        specifications: (
                            (action.id === '') ?
                                // we will add new items
                                [...state.Task.specification.specifications, { value: '', number: state.Task.specification.specifications.length + 1, isReady: false, testStatus: 0, comments: [] }] :

                                // we'll change existing item
                                (state.Task.specification.specifications).map((el, index: number) => {
                                    if (parseInt(action.id) === index + 1) { return { ...el, [action.name]: action.value } }
                                    return el;
                                }))
                    }
                }
            };
        case 'ADD_ATTACHEMENT':
            return {
                ...state,
                Task: { ...state.Task, attachement: [...state.Task.attachement, action.attachement], attachement_links: [...state.Task.attachement_links, action.attachement_link] }
            };
        case 'SET_SPECIFICATION_CONTEXT':
            return {
                ...state,
                Task: {
                    ...state.Task,
                    specification: {
                        ...state.Task.specification,
                        [action.name]: action.value
                    }
                }
            }
        default: return state;
    }
}

const actions = {
    setCurrentTaskState: (name: initialStateKeys, data: any) => ({ type: 'SET_CURRENT_STATE', name: name, data: data } as const),
    setTaskSpec: (id: string, value: any, name: keyof TaskSpecType | 'none') => ({ type: 'SET_TASK_SPEC', id: id, value: value, name: name } as const),
    setTaskProp: (property: TaskKeysType, value: any) => ({ type: 'SET_TASK_PROP', property: property, value: value } as const),
    addAttachement: (attachement: attachementItemType, attachement_link: attachementItemType) => ({ type: 'ADD_ATTACHEMENT', attachement: attachement, attachement_link: attachement_link } as const),
    setTaskData: (Task: TaskType, TaskMetadata: TaskMetadataType, firstInit = false, NowMessage = initialState.NowMessage) => ({ type: 'SET_TASK_DATA', Task: Task, TaskMetadata: TaskMetadata, firstInit: firstInit, NowMessage: NowMessage } as const),
    setSpecificationContext: (name: specificationKeystype, value: any) => ({ type: 'SET_SPECIFICATION_CONTEXT', name: name, value: value } as const)
}

export const setCurrentTaskState = (name: initialStateKeys, data: any): ThunkType => async (dispatch) => { dispatch(actions.setCurrentTaskState(name, data)) }
export const setTaskSpec = (id = '', name = 'none' as TaskSpecTypeKeys | 'none', value = '' as any): ThunkType => async (dispatch) => { dispatch(actions.setTaskSpec(id, value, name)) }
export const setSpecificationContext = (name: specificationKeystype, value: any): ThunkType => async (dispatch) => { dispatch(actions.setSpecificationContext(name, value)) }

export const setTaskProp = (property: TaskKeysType, value: any): ThunkType => async (dispatch) => { dispatch(actions.setTaskProp(property, value)) }
export const getTaskData = (number: string): ThunkType => async (dispatch) => {
    dispatch(actions.setTaskProp('loaded', false)); //надо сразу установить экран загрузки
    const response = await TaskAPI.getTaskData(number);
    if (typeof response === 'string') { alert(response) }
    else {
        response.taskMetadata.projectSelectItems.forEach((element: projectSelectType, index: number) => {
            if (element.value.id === response.task.project.id) {
                // value - object, so: 
                // response.data.task.project == response.data.taskMetadata.projectSelectItems[index].value 
                // returns false if we do not update object ref
                response.task.project = response.taskMetadata.projectSelectItems[index].value;
            }
        });
        dispatch(actions.setTaskData(response.task, response.taskMetadata, true));
    }
}

export const pushTaskButton = (type: string): ThunkType => async (dispatch, getState) => {
    // const nowState = getState().TaskPage;
    // const response = await TasksAPI.pushTaskButton({ type: type, taskPage: nowState.Task}, nowState.Task.number);
    // if (typeof response === "string") { dispatch(actions.setCurrentTaskState('NowMessage', { ...nowState.NowMessage, detail: response })) }
    // else { dispatch(actions.setTaskData({ ...response, loaded: true }, nowState.TaskMetadata, false, { life: 5000, severity: 'success', detail: 'Всё хорошо!', summary: 'Замечательно!' })) }
}

export const setNewTaskData = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskPage;
    // если это переход по ссылке внутри реакта, а не ввод в адресную строку ссылки, сбросим данные заявки
    if (nowState.TaskMetadata.modeSelectItems.length) { dispatch(actions.setTaskData(initialState.Task, nowState.TaskMetadata)) }
    else {
        const response = await TaskAPI.getTaskData("NewTask");
        if (typeof response === 'string') { alert(response) }
        else { dispatch(actions.setTaskData(initialState.Task, response.taskMetadata)) }
    }
}
export const setTaskData = (Task: TaskType, TaskMetadata: TaskMetadataType): ThunkType => async (dispatch, getState) => {
    const nowState = getState();
    dispatch(actions.setTaskData((nowState.TaskPage.Task.loaded ? nowState.TaskPage.Task : { ...Task, loaded: true }), TaskMetadata));
}

export const setNewTaskAttachement = (attachement: attachementItemType, attachement_link: attachementItemType): ThunkType => async (dispatch) => { dispatch(actions.addAttachement(attachement, attachement_link)); }

export default TaskReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

// thunk types //
export type setCurrentTaskStateType = typeof setCurrentTaskState;
export type setTaskSpecType = typeof setTaskSpec;
export type setTaskPropType = typeof setTaskProp;
export type getTaskDataType = typeof getTaskData;
export type pushTaskButtonType = typeof pushTaskButton;
export type setNewTaskDataType = typeof setNewTaskData;
export type setTaskDataType = typeof setTaskData;
export type setNewTaskAttachementType = typeof setNewTaskAttachement;
export type setSpecificationContextType = typeof setSpecificationContext;