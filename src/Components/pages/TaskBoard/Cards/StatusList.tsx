import React from "react";
import { CardNames, CardsItemType, changeTaskPriorityType, changeTaskStatusType, setCardStateType, setCurrentStateOfCardsListType, setCurrentStateOfCardsType, setTaskboardFilterType } from "../../../../redux/reducers/taskboard-reducer";
import MaintainerHeader from "./MaintainerHeader";
import MaintainerList from "./MaintainerList";
import style from "./StatusList.module.css";

type StatusListPropsType = {
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

const StatusList = (props: StatusListPropsType) => {

  if (props.data.isCollapse || (props.data.isCollapse === undefined && !props.isItDesktop)) { return null }

  return <React.Fragment>
    {props.status === 'atProgress' && <div className={style.emptyMaintainerHeaderLine}></div>}
    {props.data.lists.map((list, index) => {
      return list.list.length > 0 && <React.Fragment key={index}>
        <MaintainerHeader setTaskboardFilter={props.setTaskboardFilter} list={list} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} status={props.status} index={index} />
        <MaintainerList isItDesktop={props.isItDesktop} changeTaskPriority={props.changeTaskPriority} changeTaskStatus={props.changeTaskStatus} isReadyVisible={props.isReadyVisible} list={list} setCardState={props.setCardState} setTaskboardFilter={props.setTaskboardFilter} status={props.status} />
      </React.Fragment>
    })}
  </React.Fragment>
}

export default React.memo(StatusList);