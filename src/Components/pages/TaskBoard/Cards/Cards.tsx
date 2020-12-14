import React from "react";
import { CardsItemType, CardNames, changeTaskStatusType, setCurrentStateOfCardsType, setCurrentStateOfCardsListType, setCardStateType, collapseAllMaintainerStatusesByTabType, changeTaskPriorityType, setTaskboardFilterType } from '../../../../redux/reducers/taskboard-reducer';
import StatusHeader from './StatusHeader';
import StatusList from "./StatusList";

type PropsType = {
  collapseAllMaintainerStatusesByTab: collapseAllMaintainerStatusesByTabType,
  data: CardsItemType,
  status: CardNames,
  setCurrentStateOfCardsList: setCurrentStateOfCardsListType,
  setCurrentStateOfCards: setCurrentStateOfCardsType,
  changeTaskStatus: changeTaskStatusType,
  setCardState: setCardStateType,
  changeTaskPriority: changeTaskPriorityType,
  setTaskboardFilter: setTaskboardFilterType,
  isReadyVisible: boolean,
  isItDesktop: boolean
}

const Cards: React.FC<PropsType> = (props) => {

  let tasksCount = 0;
  let commonWeight = 0;

  props.data.lists.forEach((list) => {
    tasksCount = tasksCount + list.list.length
    commonWeight = commonWeight + list.weight;
  });

  if (!props.data.lists.length || !tasksCount) {
    return null;
  }

  return (
    <div className="p-grid-col">
      <StatusHeader collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} data={props.data} tasksCount={tasksCount} commonWeight={commonWeight} status={props.status} setCurrentStateOfCards={props.setCurrentStateOfCards} />
      <StatusList isItDesktop={props.isItDesktop} isReadyVisible={props.isReadyVisible} changeTaskPriority={props.changeTaskPriority} changeTaskStatus={props.changeTaskStatus} data={props.data} setCardState={props.setCardState} setCurrentStateOfCards={props.setCurrentStateOfCards} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} setTaskboardFilter={props.setTaskboardFilter} status={props.status} />
    </div>
  );
};

export default React.memo(Cards);
