import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import Cards from './Cards/Cards';
import Header from './Header';

import { CardsType, getTaskboardDataType, changeTaskStatusType, setCurrentStateOfCardsType, setCurrentStateOfCardsListType, setErrorType, setHeaderVisibilityType, setCardStateType, expandAllCardsType, collapseAllMaintainerTabsType, collapseAllMaintainerStatusesByTabType, changeTaskPriorityType, setTaskboardFilterType, filtersType, taskboardVisibilityType, CardListsType, CardNames } from '../../../redux/reducers/taskboard-reducer';
import style from './Taskboard.module.css';
import { ParsedQuery } from 'query-string';

type PropsType = {
    Cards: CardsType,
    getTaskboardData: getTaskboardDataType,
    changeTaskStatus: changeTaskStatusType,
    setCurrentStateOfCards: setCurrentStateOfCardsType,
    setCurrentStateOfCardsList: setCurrentStateOfCardsListType,
    setError: setErrorType,
    errorMessage: string,
    setHeaderVisibility: setHeaderVisibilityType,
    setCardState: setCardStateType,
    expandAllCards: expandAllCardsType,
    collapseAllMaintainerTabs: collapseAllMaintainerTabsType,
    isAllCollapsed: boolean,
    isAllCardExpanded: boolean,
    collapseAllMaintainerStatusesByTab: collapseAllMaintainerStatusesByTabType,
    changeTaskPriority: changeTaskPriorityType,
    setTaskboardFilter: setTaskboardFilterType,
    filters: filtersType,
    visibility: taskboardVisibilityType,
    queryParams: ParsedQuery
}

type CardsColumnPropsType = {
    lists?: Array<CardListsType>,
    status?: CardNames,
    isReadyVisible: boolean,
    isVisible?: boolean
}

const CardsColumn: React.FC<CardsColumnPropsType> = (props) => {

    if (props.isVisible !== true && (props.lists !== undefined && props.lists.find((elem) => (elem.list.length)) === undefined)) {
        return null;
    }

    let columnsCountClass = '';
    if (props.status === 'waiting') {columnsCountClass = props.isReadyVisible ? style.twoSubcolumnsColumn : style.threeSubcolumnsColumn;}

    return <div className={'p-col ' + style.taskboardColumn + ' ' + columnsCountClass}>
        {props.children}
    </div>
}

const Taskboard: React.FC<PropsType> = (props) => {

    let toast = useRef<any>(null);

    if (props.errorMessage) {
        toast.current.show({ severity: 'error', summary: 'Ошибка', detail: props.errorMessage, life: 10000 });
        props.setError();
    }

    const isItDesktop = window.innerWidth > 425;

    // если "выполненные" видимы, то показывать колонку "ожидают" в 2 колонки карточек, иначе в 3. Вдобавок если не маленький экран устройства и "выполненные" видимы, то "ожидают" в 2 колонки карточек, иначе в 3
    const isReadyVisible = !props.filters.invisibleCardNames.includes('ready') && props.Cards.ready.lists.find((elem) => (elem.list.length)) !== undefined;

    // показывать ли колонку с несколькими статусами карточек. Не показывать если ни одна не заполнена
    const isAnyOfCardsFilteredDataCommonColumnFilled = props.Cards.atProgress.lists.find((elem) => (elem.list.length)) !== undefined ||
        props.Cards.cyberTest.lists.find((elem) => (elem.list.length)) !== undefined ||
        props.Cards.currentRelease.lists.find((elem) => (elem.list.length)) !== undefined ||
        props.Cards.implementation.lists.find((elem) => (elem.list.length)) !== undefined;

    return (<React.Fragment>
        <Toast ref={toast} position='bottomright' />
        <Header searchFilter={props.filters.searchFilter} visibility={props.visibility} isReadyVisible={isReadyVisible} setTaskboardFilter={props.setTaskboardFilter} isAllCollapsed={props.isAllCollapsed} isAllCardExpanded={props.isAllCardExpanded} collapseAllMaintainerTabs={props.collapseAllMaintainerTabs} expandAllCards={props.expandAllCards} setHeaderVisibility={props.setHeaderVisibility} getTaskboardData={props.getTaskboardData} />
        <div className={(isItDesktop ? "p-grid " : "p-grid-col ") + style.taskboardBodyContainer}> {/* если маленький экран (телефон) то показывать всё в 1 столбик */}
            <CardsColumn isReadyVisible={isReadyVisible} lists={props.Cards.waiting.lists} status='waiting'>
                <Cards
                    changeTaskPriority={props.changeTaskPriority}
                    collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab}
                    setCardState={props.setCardState}
                    setCurrentStateOfCardsList={props.setCurrentStateOfCardsList}
                    changeTaskStatus={props.changeTaskStatus}
                    setCurrentStateOfCards={props.setCurrentStateOfCards}
                    status="waiting"
                    data={props.Cards.waiting}
                    isReadyVisible={isReadyVisible}
                    isItDesktop={isItDesktop}
                    setTaskboardFilter={props.setTaskboardFilter} />
            </CardsColumn>
            <CardsColumn isReadyVisible={isReadyVisible} lists={props.Cards.testing.lists} status='testing'>
                <Cards isItDesktop={isItDesktop} setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="testing" data={props.Cards.testing} />
            </CardsColumn>
            <CardsColumn isVisible={isAnyOfCardsFilteredDataCommonColumnFilled} isReadyVisible={isReadyVisible}>
                 <Cards setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible}
                    changeTaskPriority={props.changeTaskPriority}
                    collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab}
                    setCardState={props.setCardState}
                    setCurrentStateOfCardsList={props.setCurrentStateOfCardsList}
                    changeTaskStatus={props.changeTaskStatus}
                    setCurrentStateOfCards={props.setCurrentStateOfCards}
                    status="atProgress"
                    isItDesktop={isItDesktop}
                    data={props.Cards.atProgress} />
                <Cards isItDesktop={isItDesktop} setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="cyberTest" data={props.Cards.cyberTest} />
                <Cards isItDesktop={isItDesktop} setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="currentRelease" data={props.Cards.currentRelease} />
                <Cards isItDesktop={isItDesktop} setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="implementation" data={props.Cards.implementation} />
            </CardsColumn>
            <CardsColumn isVisible={isReadyVisible} isReadyVisible={isReadyVisible}>
                <Cards isItDesktop={isItDesktop} setTaskboardFilter={props.setTaskboardFilter} isReadyVisible={isReadyVisible} changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="ready" data={props.Cards.ready} />
            </CardsColumn>
        </div>
    </React.Fragment>)
}

export default React.memo(Taskboard);