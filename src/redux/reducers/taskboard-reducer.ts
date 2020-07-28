import { TaskboardAPI } from "../../api/taskboard-api";
import { TasksAPI } from "../../api/tasks-api";
import { BaseThunkType, InferActionsTypes } from '../store/redux-store';

export type CardType = {
    taskInfo: string,
    title: string,
    customer: string,
    priority: number,
    allowedStatuses: Array<string>,
    status: string,
    id: string,
    color: string,
    number: string,
    weight: number,
    isExpanded?: boolean
}

type CardKeyType = keyof CardType;

export type CardListsType = {
    maintainer: string,
    weight: number,
    list: Array<CardType>,
    avatar: string,
    isCollapse?: boolean
}

export type CardsItemType = {
    header: string,
    isCollapse?: boolean,
    lists: Array<CardListsType>,
    additionalInfo: {},
    isAllMaintainersCollapse?: boolean
}

type CardsItemTypeKeys = keyof CardsItemType;

let initialState = {
    Cards: {
        waiting: {
            header: '',
            lists: [] as Array<CardListsType>,
            additionalInfo: {}
        } as CardsItemType,
        atProgress: {
            header: '',
            lists: [] as Array<CardListsType>,
            additionalInfo: {}
        } as CardsItemType,
        testing: {
            header: '',
            lists: [] as Array<CardListsType>,
            additionalInfo: {}
        } as CardsItemType,
        currentRelease: {
            header: '',
            lists: [] as Array<CardListsType>,
            additionalInfo: {}
        } as CardsItemType,
        cyberTest: {
            header: '',
            lists: [] as Array<CardListsType>,
            additionalInfo: {}
        } as CardsItemType,
        implementation: {
            header: '',
            lists: [] as Array<CardListsType>,
            additionalInfo: {}
        } as CardsItemType,
        ready: {
            header: '',
            lists: [] as Array<CardListsType>,
            additionalInfo: {}
        } as CardsItemType
    },
    errorMessage: '',
    showSpinner: false,
    headerVisible: false,
    isAllCollapsed: false,
    isAllCardExpanded: false
};

type stateKeys = keyof typeof initialState;
export type CardsType = typeof initialState.Cards;
export type CardNames = keyof CardsType;

const TaskboardReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'INITIALIZE_TASKBOARD':
            return {
                ...state,
                Cards: { ...action.Cards },
                isAllCollapsed: (action.isItFirstInit ? true : state.isAllCollapsed),
                showSpinner: false
            };
        case 'SET_PROP_STATE_FOR_ONE_STATUS_CARS_LIST':
            return {
                ...state,
                Cards: {
                    ...state.Cards,
                    [action.cardsName]: {
                        ...state.Cards[action.cardsName],
                        [action.name]: action.data
                    }
                }
            };
        case 'SET_STATE_FOR_ONE_STATUS_CARS_LIST':
            return {
                ...state,
                Cards: {
                    ...state.Cards,
                    [action.cardsName]: { ...action.data }
                }
            }
        case 'SET_TASKBOARD_STATE':
            return {
                ...state,
                [action.name]: action.value
            };
        case 'SET_ERROR':
            return {
                ...state,
                showSpinner: false,
                errorMessage: action.errorText
            };
        case 'SET_EXPANDED_STATE_FOR_ALL':
            return {
                ...state,
                Cards: { ...action.Cards },
                [action.name]: !state[action.name]
            };
        default:
            return {
                ...state,
                showSpinner: true
            };

    }
}

const actions = {
    setTaskboardState: (name: stateKeys, value: boolean | CardsType | string) => ({ type: 'SET_TASKBOARD_STATE', name: name, value: value } as const),
    setTaskboardData: (Cards: CardsType, isItFirstInit = false) => ({ type: 'INITIALIZE_TASKBOARD', Cards: Cards, isItFirstInit: isItFirstInit } as const),
    setPropOfOneOfCardsState: (name: CardsItemTypeKeys, cardsName: CardNames, data: string | Array<CardListsType> | boolean) => ({ type: 'SET_PROP_STATE_FOR_ONE_STATUS_CARS_LIST', name: name, cardsName: cardsName, data: data } as const),
    setError: (errorText: string) => ({ type: 'SET_ERROR', errorText: errorText } as const),
    setTaskboardExpandedState: (Cards: CardsType, name: 'isAllCollapsed' | 'isAllCardExpanded') => ({ type: 'SET_EXPANDED_STATE_FOR_ALL', Cards: Cards, name: name } as const),
    setStateForOneStatusCardList: (cardsName: CardNames, data: CardsItemType) => ({ type: 'SET_STATE_FOR_ONE_STATUS_CARS_LIST', cardsName: cardsName, data: data } as const)
}

export const setError = (errorMessage = ''): ThunkType => async (dispatch) => { dispatch(actions.setError(errorMessage)) }
export const setHeaderVisibility = (headerVisible = false): ThunkType => async (dispatch) => { dispatch(actions.setTaskboardState('headerVisible', headerVisible)) }
export const setCardState = (id: string, cardName: CardNames, PropName: CardKeyType, value: boolean): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskboardPage.Cards[cardName].lists;
    outerLoop: for (let i = 0; i < nowState.length; i++) {
        for (let j = 0; j < nowState[i].list.length; j++) {
            let element = nowState[i].list[j];
            if (element.id === id) {
                nowState[i].list[j] = {
                    ...element,
                    [PropName]: value
                }
                break outerLoop;
            }
        }
    }
    dispatch(actions.setPropOfOneOfCardsState('lists', cardName, nowState));
}

export const collapseAllMaintainerTabs = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskboardPage;
    const CollapsedState = !nowState.isAllCollapsed;
    const Cards = JSON.parse(JSON.stringify(nowState.Cards)); // deep copy
    Cards.atProgress.isCollapse = CollapsedState; // collapse by status
    Object.keys(Cards).filter(e => e !== 'atProgress').forEach((element) => {
        Cards[element as CardNames].isAllMaintainersCollapse = CollapsedState;
        Cards[element as CardNames].lists.forEach((elemen: any, index: any) => {
            Cards[element as CardNames].lists[index].isCollapse = CollapsedState;
        });
    });
    dispatch(actions.setTaskboardExpandedState(Cards, 'isAllCollapsed'));
}

export const collapseAllMaintainerStatusesByTab = (CardName: CardNames): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskboardPage.Cards[CardName];
    const newState = {
        ...nowState,
        isAllMaintainersCollapse: !nowState.isAllMaintainersCollapse,
        lists: nowState.lists.map((element) => ({
            ...element,
            isCollapse: !nowState.isAllMaintainersCollapse
        }))
    }
    dispatch(actions.setStateForOneStatusCardList(CardName, newState));
}

export const getTaskboardData = (isItFirstInit = false): ThunkType => async (dispatch, getState) => {
    dispatch(actions.setTaskboardState('showSpinner', true));
    const response = await TaskboardAPI.getTaskboardData();
    if (typeof response === "string") {
        dispatch(setError(response));
    } else {
        const TaskboardData = response;
        const nowState = getState().TaskboardPage;
        Object.keys(TaskboardData.Cards).forEach((key) => { TaskboardData.Cards[key as CardNames].isCollapse = isItFirstInit ? (window.innerWidth < 320) : nowState.Cards[key as CardNames].isCollapse });
        dispatch(actions.setTaskboardData(TaskboardData.Cards, isItFirstInit));
    }
}

export const expandAllCards = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskboardPage;
    const Cards = nowState.Cards;
    Object.keys(nowState.Cards).forEach((key: string) => (
        Cards[key as CardNames] = {
            ...nowState.Cards[key as CardNames],
            lists: nowState.Cards[key as CardNames].lists.map((element) => (
                {
                    ...element,
                    list: element.list.map((elem) => ({
                        ...elem,
                        isExpanded: !nowState.isAllCardExpanded
                    }))
                }
            ))
        }
    ));
    dispatch(actions.setTaskboardExpandedState(Cards, 'isAllCardExpanded'));
}

export const setCurrentStateOfCards = (cardsName: CardNames, name: "header" | "lists" | "isCollapse", data: string | Array<CardListsType> | boolean): ThunkType => async (dispatch) => { dispatch(actions.setPropOfOneOfCardsState(name, cardsName, data)) }
export const setCurrentStateOfCardsList = (cardsName: CardNames, data: boolean, index: number): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskboardPage;
    const newList = nowState.Cards[cardsName].lists.map((value: CardListsType, ix: number) => {
        if (index === ix) {
            return {
                ...value,
                isCollapse: data
            }
        }
        else { return value }
    })
    dispatch(actions.setPropOfOneOfCardsState('lists', cardsName, newList));
}

export const changeTaskStatus = (number: string, status: string): ThunkType => async (dispatch) => {
    dispatch(actions.setTaskboardState('showSpinner', true));
    const response = await TasksAPI.pushTaskButton({
        status: status,
        type: "СменитьСтатусЗадачи"
    }, number);
    if (typeof response === "string") { dispatch(actions.setError(response)); }
    else {
        // работа в задаче 9765
        // let nowState = getState().TaskboardPage.Cards;
        // const changedStatusCard = response as {
        //     newStatus: CardNames,
        //     data: CardType | CardListsType
        // };
        // Object.keys(nowState).forEach((key) => { //deletion
        //     nowState[key as CardNames].lists.forEach((element, index) => {
        //         nowState[key as CardNames].lists[index].list = element.list.filter((elem) => elem.id !== id);
        //     });
        // });

        // if (isArray(changeTaskStatus)) { // new maintainer at status
        //     nowState[changedStatusCard.newStatus].lists.push(changedStatusCard.data as CardListsType);
        // }
        // else { // Card
        //     nowState[changedStatusCard.newStatus].lists.forEach((element, index) => { //addition
        //         if (nowState[changedStatusCard.newStatus].lists[index].maintainer === element.maintainer) {
        //             nowState[changedStatusCard.newStatus].lists[index].list.push(changedStatusCard.data as CardType)
        //         }
        //     })
        // };

        const nowState = response.Cards;

        dispatch(actions.setTaskboardData(nowState));
        dispatch(actions.setTaskboardState('showSpinner', false));
    }
}

export const changeTaskPriority = (number: string, status: CardNames): ThunkType => async (dispatch, getState) => {
    dispatch(actions.setTaskboardState('showSpinner', true));
    const response = await TasksAPI.pushTaskButton({
        type: "СменитьПриоритетЗадачи"
    }, number);
    if (typeof response === "string") { dispatch(actions.setError(response)); }
    else {
        const nowState = getState().TaskboardPage.Cards[status].lists;
        outerLoop: for (let i = 0; i < nowState.length; i++) {
            for (let j = 0; j < nowState[i].list.length; j++) {
                let element = nowState[i].list[j];
                if (element.number === number) {
                    nowState[i].list[j] = {
                        ...element,
                        priority: +!element.priority
                    }
                    break outerLoop;
                }
            }
        }
        dispatch(actions.setPropOfOneOfCardsState('lists', status, nowState));
        dispatch(actions.setTaskboardState('showSpinner', false));
    }
}

export default TaskboardReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

// thunk types //
// нужно заменить на typeof
export type setErrorType = (errorMessage?: string) => void;
export type setHeaderVisibilityType = (headerVisible?: boolean) => void;
export type setCardStateType = (id: string, cardName: CardNames, PropName: CardKeyType, value: boolean) => void;
export type collapseAllMaintainerTabsType = () => void;
export type collapseAllMaintainerStatusesByTabType = (CardName: CardNames) => void;
export type getTaskboardDataType = (isItFirstInit?: boolean) => void;
export type expandAllCardsType = () => void;
export type setCurrentStateOfCardsType = (cardsName: CardNames, name: "header" | "lists" | "isCollapse", data: string | Array<CardListsType> | boolean) => void;
export type setCurrentStateOfCardsListType = (cardsName: CardNames, data: boolean, index: number) => void;
export type changeTaskStatusType = (number: string, status: string) => void;
export type changeTaskPriorityType = (number: string, status: CardNames) => void;