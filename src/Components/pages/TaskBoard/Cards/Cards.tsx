import React from "react";
import Card from "./Card/Card";
import "./Cards.css";
import { CardsItemType, CardNames, changeTaskStatusType, setCurrentStateOfCardsType, setCurrentStateOfCardsListType, setCardStateType, collapseAllMaintainerStatusesByTabType, changeTaskPriorityType, setTaskboardFilterType, CardListsType } from '../../../../redux/reducers/taskboard-reducer';
import StatusHeader from './statusHeader';
import MaintainerHeader from './maintainerHeader';

type PropsType = {
  collapseAllMaintainerStatusesByTab: collapseAllMaintainerStatusesByTabType
} & StatusListPropsType

type StatusListPropsType = {
  data: CardsItemType,
  status: CardNames,
  setCurrentStateOfCardsList: setCurrentStateOfCardsListType,
  setCurrentStateOfCards: setCurrentStateOfCardsType,
  changeTaskStatus: changeTaskStatusType,
  setCardState: setCardStateType,
  changeTaskPriority: changeTaskPriorityType,
  setTaskboardFilter: setTaskboardFilterType,
  isReadyVisible: boolean
}

type MaintainerListPropsType = {
  list: CardListsType,
  status: CardNames,
  isReadyVisible: boolean,
  changeTaskStatus: changeTaskStatusType,
  setCardState: setCardStateType,
  changeTaskPriority: changeTaskPriorityType,
  setTaskboardFilter: setTaskboardFilterType
}

const MaintainerList = (props: MaintainerListPropsType) => {
  if ((props.list.isCollapse !== undefined && (props.list.isCollapse || props.status === 'atProgress')) && props.list.list.length > 0) { return <div></div> }

  return <div style={{ gridTemplateColumns: props.status === "waiting" && window.innerWidth > 425 ? props.isReadyVisible ? '1fr 1fr' : '1fr 1fr 1fr' : '1fr' }} className="p-col cardsStickersContainer">
    {props.list.list.map((el) => {
      return <Card
          changeTaskStatus={props.changeTaskStatus}
          status={props.status}
          data={el}
          avatar={props.list.avatar}
          setCardState={props.setCardState}
          maintainer={props.list.maintainer}
          changeTaskPriority={props.changeTaskPriority}
          setTaskboardFilter={props.setTaskboardFilter}
        />
    })}
  </div>
}

const StatusList = (props: StatusListPropsType) => {

  const isItCollapseFirst = props.data.isCollapse === undefined && window.innerWidth < 425;
  
  if (props.data.isCollapse || isItCollapseFirst) { return <div></div> }

  return <React.Fragment>
    {props.status === 'atProgress' && <div className="emptyMaintainerHeaderLine"></div>}
    {props.data.lists.map((list, index) => {
      return list.list.length > 0 && <React.Fragment key={index}>
        <MaintainerHeader setTaskboardFilter={props.setTaskboardFilter} list={list} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} status={props.status} index={index} />
        <MaintainerList changeTaskPriority={props.changeTaskPriority} changeTaskStatus={props.changeTaskStatus} isReadyVisible={props.isReadyVisible} list={list} setCardState={props.setCardState} setTaskboardFilter={props.setTaskboardFilter} status={props.status} />
      </React.Fragment>
    })}
  </React.Fragment>
}

const Cards: React.FC<PropsType> = (props) => {

  if (!props.data.lists.length) {
    return <div></div>;
  }

  let tasksCount = 0;
  let commonWeight = 0;
  
  props.data.lists.forEach((list) => {
    tasksCount = tasksCount + list.list.length
    commonWeight = commonWeight + list.weight;
  });

  if (!tasksCount) {
    return <div></div>
  }

  return (
    <div className="p-grid-col">
      <StatusHeader collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} data={props.data} tasksCount={tasksCount} commonWeight={commonWeight} status={props.status} setCurrentStateOfCards={props.setCurrentStateOfCards} />
      <StatusList isReadyVisible={props.isReadyVisible} changeTaskPriority={props.changeTaskPriority} changeTaskStatus={props.changeTaskStatus} data={props.data} setCardState={props.setCardState} setCurrentStateOfCards={props.setCurrentStateOfCards} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} setTaskboardFilter={props.setTaskboardFilter} status={props.status} />
    </div>
  );
};

export default React.memo(Cards);
