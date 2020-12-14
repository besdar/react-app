import React from "react";
import { CardListsType, CardNames, changeTaskPriorityType, changeTaskStatusType, setCardStateType, setTaskboardFilterType } from "../../../../redux/reducers/taskboard-reducer";
import Card from "./Card/Card";
import style from './MaintainerList.module.css';

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
  
    let columnsCountClass = style.oneSubcolumnsColumnMaintainerList + ' ';
    if (props.status === 'waiting' && props.isItDesktop) {columnsCountClass = (props.isReadyVisible ? style.twoSubcolumnsColumnMaintainerList : style.threeSubcolumnsColumnMaintainerList)}

    return <div className={"p-col " + style.cardsStickersContainer + ' ' + columnsCountClass}>
      {props.list.list.map((el, index) => {
        return <Card
            key={index}
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