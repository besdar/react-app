import React from "react";
import { CardListsType, CardNames, changeTaskPriorityType, changeTaskStatusType, setCardStateType, setTaskboardFilterType } from "../../../../redux/reducers/taskboard-reducer";
import Card from "./Card/Card";

type MaintainerListPropsType = {
    list: CardListsType,
    status: CardNames,
    isItDesktop: boolean,
    isReadyVisible: boolean,
    changeTaskStatus: changeTaskStatusType,
    setCardState: setCardStateType,
    changeTaskPriority: changeTaskPriorityType,
    setTaskboardFilter: setTaskboardFilterType
  }

const MaintainerList = (props: MaintainerListPropsType) => {
    if ((props.list.isCollapse !== undefined && (props.list.isCollapse || props.status === 'atProgress')) && props.list.list.length > 0) { return null }
  
    return <div style={{ gridTemplateColumns: props.status === "waiting" && props.isItDesktop ? props.isReadyVisible ? '1fr 1fr' : '1fr 1fr 1fr' : '1fr' }} className="p-col cardsStickersContainer">
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

  export default React.memo(MaintainerList);