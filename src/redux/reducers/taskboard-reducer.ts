import { TaskboardAPI } from "../../api/taskboard-api";
import { TaskAPI, changeStatusResponseType } from "../../api/task-api";
import { BaseThunkType, InferActionsTypes, ReturnObjectValuesType } from '../store/redux-store';

const initialStateCardsItem = {
    header: '',
    lists: [] as Array<CardListsType>,
    additionalInfo: {},
    isCollapse: false as boolean | undefined,
    isAllMaintainersCollapse: false as boolean | undefined
};

const initialState = {
    Cards: {
        waiting: { ...initialStateCardsItem },
        atProgress: { ...initialStateCardsItem },
        testing: { ...initialStateCardsItem },
        currentRelease: { ...initialStateCardsItem },
        cyberTest: { ...initialStateCardsItem },
        implementation: { ...initialStateCardsItem },
        ready: { ...initialStateCardsItem }
    },
    errorMessage: '',
    visibility: {
        showSpinner: false,
        headerVisible: false,
        menuVisible: false
    },
    isAllCollapsed: false,
    isAllCardExpanded: false,
    filters: {
        visibleProject: '',
        invisibleCardNames: [] as Array<CardNames>,
        visibleMaintainer: '',
        searchFilter: {
            inputSelectedCard: '',
            cardsSearchArray: [] as Array<string>,
            FullTextOfSelectedCard: ''
        }
    },
    metadata: {
        Roles: [] as Array<string>
    }
};

export type taskboardVisibilityType = typeof initialState.visibility;
export type searchFilterType = typeof initialState.filters.searchFilter;
export type taskboardMetadataType = typeof initialState.metadata;
export type filtersType = typeof initialState.filters;
type filtersTypeKeys = keyof filtersType;
type stateKeys = keyof TaskboardInitialStateType;
export type CardsType = typeof initialState.Cards;
export type CardNames = 'waiting' | 'atProgress' | 'testing' | 'currentRelease' | 'cyberTest' | 'implementation' | 'ready';
type CardsItemTypeKeys = keyof CardsItemType;
export type CardsItemType = typeof initialStateCardsItem;
type CardKeyType = keyof CardType;
export type CardType = {
    project: string,
    title: string,
    customer: string,
    priority: number,
    allowedStatuses: Array<string>,
    status: string,
    id: string,
    color: string,
    number: string,
    weight: number,
    totalWeight: number,
    isExpanded?: boolean,
    isVisible?: boolean,
    atWork: {
        maintainer: '',
        avatar: ''
    }
}

export type CardListsType = {
    maintainer: string,
    weight: number,
    list: Array<CardType>,
    avatar: string,
    isCollapse?: boolean
}

const TaskboardReducer = (state = initialState, action: ActionsType): TaskboardInitialStateType => {
    switch (action.type) {
        case 'INITIALIZE_TASKBOARD':
            return {
                ...state,
                visibility: { ...state.visibility, showSpinner: false },
                Cards: { ...action.Cards },
                isAllCollapsed: action.isItFirstInit || state.isAllCollapsed,
                metadata: action.metadata
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
                ...state
            };
    }
}

const actions = {
    setTaskboardState: (name: stateKeys, value: ReturnObjectValuesType<TaskboardInitialStateType>) => ({ type: 'SET_TASKBOARD_STATE', name: name, value: value } as const),
    setTaskboardData: (Cards: CardsType, metadata: taskboardMetadataType, isItFirstInit = false) => ({ type: 'INITIALIZE_TASKBOARD', Cards: Cards, isItFirstInit: isItFirstInit, metadata: metadata } as const),
    setPropOfOneOfCardsState: (name: CardsItemTypeKeys, cardsName: CardNames, data: ReturnObjectValuesType<CardsItemType>) => ({ type: 'SET_PROP_STATE_FOR_ONE_STATUS_CARS_LIST', name: name, cardsName: cardsName, data: data } as const),
    setError: (errorText: string) => ({ type: 'SET_ERROR', errorText: errorText } as const),
    setTaskboardExpandedState: (Cards: CardsType, name: 'isAllCollapsed' | 'isAllCardExpanded') => ({ type: 'SET_EXPANDED_STATE_FOR_ALL', Cards: Cards, name: name } as const),
    setStateForOneStatusCardList: (cardsName: CardNames, data: CardsItemType) => ({ type: 'SET_STATE_FOR_ONE_STATUS_CARS_LIST', cardsName: cardsName, data: data } as const)
}

export const setError = (errorMessage = ''): ThunkType => async (dispatch) => { dispatch(actions.setError(errorMessage)) }
export const setHeaderVisibility = (headerVisible = false, menuVisible = false): ThunkType => async (dispatch) => { dispatch(actions.setTaskboardState('visibility', { menuVisible: menuVisible, headerVisible: headerVisible, showSpinner: false })); }
export const setCardState = (id: string, cardName: CardNames, PropName: CardKeyType, value: boolean): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskboardPage.Cards[cardName].lists;
    outerLoop: for (let i = 0; i < nowState.length; i++) {
        for (let j = 0; j < nowState[i].list.length; j++) {
            const element = nowState[i].list[j];
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

export const setTaskboardFilter = (filterName: filtersTypeKeys, filterValue: ReturnObjectValuesType<filtersType>): ThunkType => async (dispatch, getState) => {
    const nowState = JSON.parse(JSON.stringify(getState().TaskboardPage.filters));
    if (filterName === 'visibleProject' || filterName === 'visibleMaintainer') {
        nowState[filterName] = (!nowState[filterName] ? filterValue : '');
    } else if (filterName === 'searchFilter') {
        nowState[filterName] = filterValue;
    } else {
        if (nowState[filterName].includes(filterValue)) { nowState[filterName] = nowState[filterName].filter((el: ReturnObjectValuesType<filtersType>) => (el !== filterValue)) }
        else { nowState[filterName] = [...nowState[filterName], filterValue] }
    }
    dispatch(actions.setTaskboardState('filters', nowState));
}

export const collapseAllMaintainerTabs = (): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskboardPage;
    const CollapsedState = !nowState.isAllCollapsed;
    const Cards = JSON.parse(JSON.stringify(nowState.Cards)); // deep copy
    Cards.atProgress.isCollapse = CollapsedState; // collapse by status
    Object.keys(Cards).filter(e => e !== 'atProgress').forEach((element) => {
        Cards[element as CardNames].isAllMaintainersCollapse = CollapsedState;
        Cards[element as CardNames].lists.forEach((elemen: never, index: number) => {
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
    const nowState = getState().TaskboardPage;
    dispatch(actions.setTaskboardState('visibility', { ...nowState.visibility, showSpinner: true }));
    const response = await TaskboardAPI.getTaskboardData();
    if (typeof response === "string") {
        if (response === 'Истек срок действия авторизации. Необходимо авторизоваться.') { window.location.href = 'login' }
        else { dispatch(setError(response)); }
    } else {
        const TaskboardData = response;
        if (!(isItFirstInit && window.innerWidth > 425)) {
            Object.keys(TaskboardData.Cards).forEach((key) => {
                // set the start collapse status
                TaskboardData.Cards[key as CardNames].isCollapse = isItFirstInit ? (window.innerWidth < 425) : nowState.Cards[key as CardNames].isCollapse;
            });
        }

        const newSearchArray = [] as Array<string>;
        // get the array of cards context
        Object.keys(TaskboardData.Cards).forEach((key) => {
            TaskboardData.Cards[key as CardNames].lists.forEach((elem, index) => {
                elem.list.forEach((element, index) => {
                    newSearchArray.push(element.number + ', ' + element.title);
                    elem.list[index] = {
                        ...element,
                        isExpanded: nowState.isAllCardExpanded
                    }
                });
                TaskboardData.Cards[key as CardNames].lists[index] = {
                    ...elem,
                    isCollapse: TaskboardData.Cards[key as CardNames].isAllMaintainersCollapse
                }
            });
        });

        dispatch(actions.setTaskboardData(TaskboardData.Cards, TaskboardData.Metadata, isItFirstInit));
        dispatch(actions.setTaskboardState('filters', {
            ...nowState.filters,
            searchFilter: {
                cardsSearchArray: newSearchArray,
                inputSelectedCard: '',
                FullTextOfSelectedCard: ''
            },
            invisibleCardNames: isItFirstInit && (TaskboardData.Metadata.Roles.includes('Руководитель') || TaskboardData.Metadata.Roles.includes('РуководительПроектов')) ? ['ready'] : [...nowState.filters.invisibleCardNames]
        }));
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

export const changeTaskStatus = (number: string, status: string): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskboardPage;
    dispatch(actions.setTaskboardState('visibility', { ...nowState.visibility, showSpinner: true }));
    const nowCatdsState = JSON.parse(JSON.stringify(nowState.Cards)) as CardsType;
    const response = await TaskAPI.pushTaskButton({
        status: status,
        type: "СменитьСтатусЗадачи"
    }, number);
    if (typeof response === "string") { dispatch(actions.setError(response)); }
    else if ((response as changeStatusResponseType).newStatus !== status) { // if task do not already had work status because of testing
        const changedStatusCard = response as changeStatusResponseType;
        const changedCardInfo = {
            card: {} as CardType,
            listsObj: {
                maintainer: '',
                list: [],
                weight: 0,
                avatar: ''
            } as CardListsType,
            listsIndex: 0,
            cardPreviousCardName: '' as CardNames
        };

        const cardsNamesKeys = Object.keys(nowCatdsState) as Array<CardNames>;
        outerLoop: for (let i = 0; i < cardsNamesKeys.length; i++) { //deletion and getting info
            let key = cardsNamesKeys[i];
            for (let j = 0; j < nowCatdsState[key].lists.length; j++) {
                const element = nowCatdsState[key].lists[j];
                nowCatdsState[key].lists[j].list = element.list.reduce((accumulator, elem) => {
                    if (elem.number === number) {
                        changedCardInfo.card = { ...elem };
                        if (elem.atWork.maintainer) {
                            accumulator.push({ ...elem, status: changedStatusCard.data.status, allowedStatuses: changedStatusCard.data.allowedStatuses });
                        }
                    } else { accumulator.push(elem) }
                    return accumulator;
                }, [] as Array<CardType>);
                if (JSON.stringify(changedCardInfo.card) !== '{}') {
                    changedCardInfo.listsObj.maintainer = nowCatdsState[key].lists[j].maintainer;
                    changedCardInfo.listsObj.avatar = nowCatdsState[key].lists[j].avatar;
                    changedCardInfo.listsIndex = j;
                    changedCardInfo.cardPreviousCardName = key;
                    break outerLoop;
                }
            };
        };

        if (!nowCatdsState[changedCardInfo.cardPreviousCardName].lists[changedCardInfo.listsIndex].list.length) { // this maintainer is empty now
            // delete maintainer array
            if (changedCardInfo.cardPreviousCardName === 'atProgress' && nowCatdsState[changedCardInfo.cardPreviousCardName].lists.length <= 1) {
                // we need only delete info about maintainer
                nowCatdsState[changedCardInfo.cardPreviousCardName].lists[changedCardInfo.listsIndex].avatar = '';
                nowCatdsState[changedCardInfo.cardPreviousCardName].lists[changedCardInfo.listsIndex].isCollapse = false;
                nowCatdsState[changedCardInfo.cardPreviousCardName].lists[changedCardInfo.listsIndex].maintainer = '';
                nowCatdsState[changedCardInfo.cardPreviousCardName].lists[changedCardInfo.listsIndex].weight = 0;
                nowCatdsState[changedCardInfo.cardPreviousCardName].lists[changedCardInfo.listsIndex].list.push({
                    allowedStatuses: [],
                    color: 'white',
                    customer: '',
                    id: '',
                    number: '',
                    priority: 0,
                    status: '',
                    project: '',
                    title: '',
                    weight: 0,
                    totalWeight: 0,
                    atWork: {
                        avatar: '',
                        maintainer: ''
                    }
                });
            }
            else {
                nowCatdsState[changedCardInfo.cardPreviousCardName].lists.splice(changedCardInfo.listsIndex, 1);
            }
        }

        if (changedStatusCard.newStatus && !changedCardInfo.card.atWork.maintainer) { // card can get such status that get no appearance on the screen
            let maintainerFound = false;
            for (let j = 0; j < nowCatdsState[changedStatusCard.newStatus].lists.length; j++) { // do maintainer already exist in CardsList with this status?
                const element = nowCatdsState[changedStatusCard.newStatus].lists[j];
                if (element.maintainer === changedCardInfo.listsObj.maintainer) {
                    maintainerFound = true;
                    element.list.push({ ...changedCardInfo.card, ...changedStatusCard.data });
                    element.weight = element.weight + changedStatusCard.data.weight;
                    break;
                }
            };

            if (!maintainerFound) { // we need to add lists with this maintainer
                nowCatdsState[changedStatusCard.newStatus].lists.push({
                    avatar: changedCardInfo.listsObj.avatar,
                    list: [{ ...changedCardInfo.card, ...changedStatusCard.data }],
                    maintainer: changedCardInfo.listsObj.maintainer,
                    weight: changedStatusCard.data.weight
                });
            }
        }


        // const nowState = response.Cards;

        dispatch(actions.setTaskboardData(nowCatdsState, nowState.metadata));
        dispatch(actions.setTaskboardState('visibility', { ...nowState.visibility, showSpinner: false }));
    }
}

export const changeTaskPriority = (number: string, status: CardNames): ThunkType => async (dispatch, getState) => {
    const nowState = getState().TaskboardPage
    dispatch(actions.setTaskboardState('visibility', { ...nowState.visibility, showSpinner: true }));
    const response = await TaskAPI.pushTaskButton({
        type: "СменитьПриоритетЗадачи"
    }, number);
    if (typeof response === "string") {
        if (response === 'Истек срок действия авторизации. Необходимо авторизоваться.') { window.location.href = 'login' }
        else { dispatch(actions.setError(response)); }
    }
    else {
        const nowCardsListsState = nowState.Cards[status].lists;
        outerLoop: for (let i = 0; i < nowCardsListsState.length; i++) {
            for (let j = 0; j < nowCardsListsState[i].list.length; j++) {
                const element = nowCardsListsState[i].list[j];
                if (element.number === number) {
                    nowCardsListsState[i].list[j] = {
                        ...element,
                        priority: +!element.priority
                    }
                    break outerLoop;
                }
            }
        }
        dispatch(actions.setPropOfOneOfCardsState('lists', status, nowState));
        dispatch(actions.setTaskboardState('visibility', { ...nowState.visibility, showSpinner: false }));
    }
}

export default TaskboardReducer;

export type TaskboardInitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;

// thunk types //
export type setErrorType = typeof setError;
export type setHeaderVisibilityType = typeof setHeaderVisibility;
export type setCardStateType = typeof setCardState;
export type collapseAllMaintainerTabsType = typeof collapseAllMaintainerTabs;
export type collapseAllMaintainerStatusesByTabType = typeof collapseAllMaintainerStatusesByTab;
export type getTaskboardDataType = typeof getTaskboardData;
export type expandAllCardsType = typeof expandAllCards;
export type setCurrentStateOfCardsType = typeof setCurrentStateOfCards;
export type setCurrentStateOfCardsListType = typeof setCurrentStateOfCardsList;
export type changeTaskStatusType = typeof changeTaskStatus;
export type changeTaskPriorityType = typeof changeTaskPriority;
export type setTaskboardFilterType = typeof setTaskboardFilter;