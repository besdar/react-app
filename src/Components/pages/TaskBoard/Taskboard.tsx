import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import Cards from './Cards/Cards';
import Header from './Header';

import Loader from '../../common/Loader/Loader';
import { CardsType, getTaskboardDataType, changeTaskStatusType, setCurrentStateOfCardsType, setCurrentStateOfCardsListType, setErrorType, setHeaderVisibilityType, setCardStateType, expandAllCardsType, collapseAllMaintainerTabsType, collapseAllMaintainerStatusesByTabType, changeTaskPriorityType, setTaskboardFilterType, filtersType, CardListsType, CardType } from '../../../redux/reducers/taskboard-reducer';
import './Taskboard.css';

type PropsType = {
    Cards: CardsType,
    showSpinner: boolean,
    getTaskboardData: getTaskboardDataType,
    changeTaskStatus: changeTaskStatusType,
    setCurrentStateOfCards: setCurrentStateOfCardsType,
    setCurrentStateOfCardsList: setCurrentStateOfCardsListType,
    setError: setErrorType,
    errorMessage: string,
    headerVisible: boolean,
    setHeaderVisibility: setHeaderVisibilityType,
    setCardState: setCardStateType,
    expandAllCards: expandAllCardsType,
    collapseAllMaintainerTabs: collapseAllMaintainerTabsType,
    isAllCollapsed: boolean,
    isAllCardExpanded: boolean,
    collapseAllMaintainerStatusesByTab: collapseAllMaintainerStatusesByTabType,
    changeTaskPriority: changeTaskPriorityType,
    setTaskboardFilter: setTaskboardFilterType,
    filters: filtersType
}

const cardListsFilter = (lists: Array<CardListsType>, filters: filtersType) => {
    return lists.reduce((acc, element) => {
        if (!filters.visibleMaintainer || filters.visibleMaintainer === element.maintainer) {
            acc.push({
                ...element, list: element.list.reduce((accumulator, elem) => {
                    if (!filters.visibleProject || filters.visibleProject === elem.project) { 
                        if ((elem.number + ', ' + elem.title).toUpperCase().includes(filters.searchFilter.selectedCard.toUpperCase())) {accumulator.push(elem) }
                    }
                    return accumulator;
                }, [] as Array<CardType>)
            });
        }
        return acc;
    }, [] as Array<CardListsType>);
}

const Taskboard: React.FC<PropsType> = (props) => {

    let toast = useRef<any>(null);

    if (props.Cards === undefined) { return <Loader nameOfProcess="загружаем данные доски" /> }

    if (props.errorMessage !== '') {
        toast.current.show({ severity: 'error', summary: 'Ошибка', detail: props.errorMessage, life: 10000 });
        props.setError();
    }

    const CardsFilteredData = {
        waiting: { ...props.Cards.waiting, lists: cardListsFilter(props.Cards.waiting.lists, props.filters) },
        atProgress: { ...props.Cards.atProgress, lists: cardListsFilter(props.Cards.atProgress.lists, props.filters) },
        testing: { ...props.Cards.testing, lists: cardListsFilter(props.Cards.testing.lists, props.filters) },
        currentRelease: { ...props.Cards.currentRelease, lists: cardListsFilter(props.Cards.currentRelease.lists, props.filters) },
        cyberTest: { ...props.Cards.cyberTest, lists: cardListsFilter(props.Cards.cyberTest.lists, props.filters) },
        implementation: { ...props.Cards.implementation, lists: cardListsFilter(props.Cards.implementation.lists, props.filters) },
        ready: { ...props.Cards.ready, lists: cardListsFilter(props.Cards.ready.lists, props.filters) }
    }

    const isReadyVisible = !props.filters.invisibleCardNames.includes('ready') && CardsFilteredData.ready.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0;

    const isAnyOfCardsFilteredDataCommonColumnFilled = CardsFilteredData.atProgress.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0 ||
    CardsFilteredData.cyberTest.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0 ||
    CardsFilteredData.currentRelease.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0 ||
    CardsFilteredData.implementation.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0;

    return (<React.Fragment>
        <Toast ref={toast} position='bottomright' />
        <Header searchFilter={props.filters.searchFilter}  isReadyVisible={isReadyVisible} setTaskboardFilter={props.setTaskboardFilter} isAllCollapsed={props.isAllCollapsed} isAllCardExpanded={props.isAllCardExpanded} collapseAllMaintainerTabs={props.collapseAllMaintainerTabs} expandAllCards={props.expandAllCards} setHeaderVisibility={props.setHeaderVisibility} headerVisible={props.headerVisible} showSpinner={props.showSpinner} getTaskboardData={props.getTaskboardData} />
        <div className={window.innerWidth > 425 ? "p-grid" : "p-grid-col"} style={{ marginRight: '0' }}>
            {CardsFilteredData.waiting.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0 && <div className='p-col' style={{ flexGrow: isReadyVisible ? 2 : 3 }}>
                <Cards
                    changeTaskPriority={props.changeTaskPriority}
                    collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab}
                    setCardState={props.setCardState}
                    setCurrentStateOfCardsList={props.setCurrentStateOfCardsList}
                    changeTaskStatus={props.changeTaskStatus}
                    setCurrentStateOfCards={props.setCurrentStateOfCards}
                    status="waiting"
                    data={CardsFilteredData.waiting}
                    isReadyVisible={isReadyVisible}
                    setTaskboardFilter={props.setTaskboardFilter} />
            </div>}
            {CardsFilteredData.testing.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0 && <div className='p-col taskboardColumn'>
                <Cards setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="testing" data={CardsFilteredData.testing} />
            </div>}
            {isAnyOfCardsFilteredDataCommonColumnFilled &&
            <div className='p-col taskboardColumn'>
                {CardsFilteredData.atProgress.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0 && <Cards setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible}
                    changeTaskPriority={props.changeTaskPriority}
                    collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab}
                    setCardState={props.setCardState}
                    setCurrentStateOfCardsList={props.setCurrentStateOfCardsList}
                    changeTaskStatus={props.changeTaskStatus}
                    setCurrentStateOfCards={props.setCurrentStateOfCards}
                    status="atProgress"
                    data={CardsFilteredData.atProgress} />}
                {CardsFilteredData.cyberTest.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0 && <Cards setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="cyberTest" data={CardsFilteredData.cyberTest} />}
                {CardsFilteredData.currentRelease.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0 && <Cards setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="currentRelease" data={CardsFilteredData.currentRelease} />}
                {CardsFilteredData.implementation.lists.reduce((acc, elem) => (acc + elem.list.length), 0) > 0 && <Cards setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="implementation" data={CardsFilteredData.implementation} />}
            </div>}
            {isReadyVisible && <div className='p-col taskboardColumn'>
                <Cards setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="ready" data={CardsFilteredData.ready} />
            </div>}
        </div>
    </React.Fragment>)
}

export default React.memo(Taskboard);