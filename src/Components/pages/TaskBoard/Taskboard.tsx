import React, { useRef } from 'react';
import {Growl} from 'primereact/growl';
import Cards from './Cards/Cards';
import Header from './Header';

import Loader from '../../common/Loader/Loader';
import {CardsType, getTaskboardDataType, changeTaskStatusType, setCurrentStateOfCardsType, setCurrentStateOfCardsListType, setErrorType, setHeaderVisibilityType, setCardStateType, expandAllCardsType, collapseAllMaintainerTabsType, collapseAllMaintainerStatusesByTabType, changeTaskPriorityType} from '../../../redux/reducers/taskboard-reducer';

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
    changeTaskPriority: changeTaskPriorityType
}

const Taskboard: React.FC<PropsType> = (props) => {

    let growl = useRef<any>(null);

    if (props.Cards === undefined) { return <Loader nameOfProcess="загружаем данные доски" /> }

    if (props.errorMessage !== '') {
        growl.current.show({severity: 'error', summary: 'Ошибка', detail: props.errorMessage, life: 10000});
        props.setError();
    }

    return (<React.Fragment>
        <Growl ref={growl} position='bottomright' />
        <Header isAllCollapsed={props.isAllCollapsed} isAllCardExpanded={props.isAllCardExpanded} collapseAllMaintainerTabs={props.collapseAllMaintainerTabs} expandAllCards={props.expandAllCards} setHeaderVisibility={props.setHeaderVisibility} headerVisible={props.headerVisible} showSpinner={props.showSpinner} getTaskboardData={props.getTaskboardData} />
        <div className={window.innerWidth > 425 ? "p-grid" : "p-grid-col"} style={{marginRight: '0'}}>
            <div className='p-col' style={{flexBasis: '30%'}}> 
                <Cards 
                    changeTaskPriority={props.changeTaskPriority} 
                    collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} 
                    setCardState={props.setCardState} 
                    setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} 
                    changeTaskStatus={props.changeTaskStatus} 
                    setCurrentStateOfCards={props.setCurrentStateOfCards} 
                    status="waiting" 
                    data={props.Cards.waiting} />
            </div>
            <div className='p-col' style={{flexBasis: '15%'}}>
                <Cards 
                    changeTaskPriority={props.changeTaskPriority} 
                    collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} 
                    setCardState={props.setCardState} 
                    setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} 
                    changeTaskStatus={props.changeTaskStatus} 
                    setCurrentStateOfCards={props.setCurrentStateOfCards} 
                    status="atProgress" 
                    data={props.Cards.atProgress} />
                <Cards changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="testing" data={props.Cards.testing} />
            </div>
            <div className='p-col' style={{flexBasis: '15%'}}>
                <Cards changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="currentRelease" data={props.Cards.currentRelease} />
                <Cards changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="cyberTest" data={props.Cards.cyberTest} />
                <Cards changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="implementation" data={props.Cards.implementation} />
            </div>
            <div className='p-col' style={{flexBasis: '15%'}}>
                <Cards changeTaskPriority={props.changeTaskPriority} collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} setCardState={props.setCardState} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} changeTaskStatus={props.changeTaskStatus} setCurrentStateOfCards={props.setCurrentStateOfCards} status="ready" data={props.Cards.ready} />
            </div>
        </div>
    </React.Fragment>)
}

export default React.memo(Taskboard);