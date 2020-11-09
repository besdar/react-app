import React from "react";
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

class TaskboardContainer extends React.Component<PropsType> {
    componentDidMount() {
        document.title = "Taskboard";
        this.props.getTaskboardData(true);
    }

    render() {
        return (
            <Taskboard {...this.props.Taskboard}
                changeTaskStatus={this.props.changeTaskStatus}
                getTaskboardData={this.props.getTaskboardData}
                setCurrentStateOfCards={this.props.setCurrentStateOfCards}
                setCurrentStateOfCardsList={this.props.setCurrentStateOfCardsList}
                setError={this.props.setError}
                setHeaderVisibility={this.props.setHeaderVisibility}
                setCardState={this.props.setCardState}
                expandAllCards={this.props.expandAllCards}
                collapseAllMaintainerTabs={this.props.collapseAllMaintainerTabs}
                collapseAllMaintainerStatusesByTab={this.props.collapseAllMaintainerStatusesByTab}
                changeTaskPriority={this.props.changeTaskPriority}
                setTaskboardFilter={this.props.setTaskboardFilter}
                queryParams={queryString.parse(this.props.location.search)}
                Cards={filterCards(this.props.Taskboard.Cards, this.props.Taskboard.filters)} // мутация данных. Но это фильтр и в теории данные сами по себе не меняются
            />
        );
    }
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
