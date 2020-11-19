import React, { useLayoutEffect } from "react";
import Taskboard from "./Taskboard";
import { connect } from "react-redux";
import {
    getTaskboardData,
    setCurrentStateOfCards,
    changeTaskStatus,
    setError,
    setCurrentStateOfCardsList,
    setHeaderVisibility,
    setCardState,
    expandAllCards,
    collapseAllMaintainerTabs,
    collapseAllMaintainerStatusesByTab,
    changeTaskPriority,
    getTaskboardDataType,
    changeTaskStatusType,
    setCurrentStateOfCardsType,
    setCurrentStateOfCardsListType,
    setErrorType,
    setHeaderVisibilityType,
    setCardStateType,
    expandAllCardsType,
    collapseAllMaintainerTabsType,
    collapseAllMaintainerStatusesByTabType,
    changeTaskPriorityType,
    setTaskboardFilterType,
    setTaskboardFilter,
    CardsType,
    CardListsType,
    CardType,
    filtersType
} from "../../../redux/reducers/taskboard-reducer";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { compose } from "redux";
import { AppStateType } from '../../../redux/store/redux-store';
import queryString from 'query-string';

const cardListsFilter = (lists: Array<CardListsType>, filters: filtersType) => {
    return lists.reduce((acc, element) => {
        if (!filters.visibleMaintainer || filters.visibleMaintainer === element.maintainer) { // отсортируем исполнителя
            acc.push({
                ...element, list: element.list.reduce((accumulator, elem) => {
                    if (!filters.visibleProject || filters.visibleProject === elem.project) { // фильтрация пректа. Если фильтр пуст или в этом элементе нужный проект
                        if ((elem.number + ', ' + elem.title).toUpperCase().includes(filters.searchFilter.inputSelectedCard.toUpperCase())) { accumulator.push(elem) } // если в тексте карточки есть нужныые слова
                    }
                    return accumulator;
                }, [] as Array<CardType>)
            });
        }
        return acc;
    }, [] as Array<CardListsType>);
}

const filterCards = (Cards: CardsType, filters: filtersType): CardsType => {
    return {
        waiting: { ...Cards.waiting, lists: cardListsFilter(Cards.waiting.lists, filters) },
        atProgress: { ...Cards.atProgress, lists: cardListsFilter(Cards.atProgress.lists, filters) },
        testing: { ...Cards.testing, lists: cardListsFilter(Cards.testing.lists, filters) },
        currentRelease: { ...Cards.currentRelease, lists: cardListsFilter(Cards.currentRelease.lists, filters) },
        cyberTest: { ...Cards.cyberTest, lists: cardListsFilter(Cards.cyberTest.lists, filters) },
        implementation: { ...Cards.implementation, lists: cardListsFilter(Cards.implementation.lists, filters) },
        ready: { ...Cards.ready, lists: cardListsFilter(Cards.ready.lists, filters) }
    }
}

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    getTaskboardData: getTaskboardDataType,
    changeTaskStatus: changeTaskStatusType,
    setCurrentStateOfCards: setCurrentStateOfCardsType,
    setCurrentStateOfCardsList: setCurrentStateOfCardsListType,
    setError: setErrorType,
    setHeaderVisibility: setHeaderVisibilityType,
    setCardState: setCardStateType,
    expandAllCards: expandAllCardsType,
    collapseAllMaintainerTabs: collapseAllMaintainerTabsType,
    collapseAllMaintainerStatusesByTab: collapseAllMaintainerStatusesByTabType,
    changeTaskPriority: changeTaskPriorityType,
    setTaskboardFilter: setTaskboardFilterType
}

type PropsType = MapPropsType & DispatchPropsType & RouteComponentProps;

const TaskboardContainer: React.FC<PropsType> = (props) => {
    useLayoutEffect(() => {
        props.getTaskboardData(true);
        // ошибка что мы передаем не пропсы а пустой массив. Намеренно, чтобы сработало аналогично ComponentDidMount
        // eslint-disable-next-line 
    }, []);

    return <Taskboard {...props.Taskboard}
        changeTaskStatus={props.changeTaskStatus}
        getTaskboardData={props.getTaskboardData}
        setCurrentStateOfCards={props.setCurrentStateOfCards}
        setCurrentStateOfCardsList={props.setCurrentStateOfCardsList}
        setError={props.setError}
        setHeaderVisibility={props.setHeaderVisibility}
        setCardState={props.setCardState}
        expandAllCards={props.expandAllCards}
        collapseAllMaintainerTabs={props.collapseAllMaintainerTabs}
        collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab}
        changeTaskPriority={props.changeTaskPriority}
        setTaskboardFilter={props.setTaskboardFilter}
        queryParams={queryString.parse(props.location.search)}
        Cards={filterCards(props.Taskboard.Cards, props.Taskboard.filters)} // мутация данных. Но это фильтр и в теории данные сами по себе не меняются
    />;
}

const mapStateToProps = (state: AppStateType) => ({ Taskboard: state.TaskboardPage })

export default compose<React.ComponentType>(
    connect(mapStateToProps, {
        getTaskboardData,
        setCurrentStateOfCards,
        changeTaskStatus,
        setCurrentStateOfCardsList,
        setError,
        setHeaderVisibility,
        setCardState,
        expandAllCards,
        collapseAllMaintainerTabs,
        collapseAllMaintainerStatusesByTab,
        changeTaskPriority,
        setTaskboardFilter
    }),
    withRouter
)(TaskboardContainer);
