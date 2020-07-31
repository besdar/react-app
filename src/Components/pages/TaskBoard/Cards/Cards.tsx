import React from "react";
import Card from "./Card/Card";
import "./Cards.css";
import {CardsItemType, CardNames,  changeTaskStatusType, setCurrentStateOfCardsType, setCurrentStateOfCardsListType, setCardStateType, collapseAllMaintainerStatusesByTabType, changeTaskPriorityType} from '../../../../redux/reducers/taskboard-reducer';
import StatusHeader from './statusHeader';
import MaintainerHeader from './maintainerHeader';

type PropsType = {
  data: CardsItemType,
  status: CardNames,
  changeTaskStatus: changeTaskStatusType,
  setCurrentStateOfCards: setCurrentStateOfCardsType,
  setCurrentStateOfCardsList: setCurrentStateOfCardsListType,
  setCardState: setCardStateType,
  collapseAllMaintainerStatusesByTab: collapseAllMaintainerStatusesByTabType,
  changeTaskPriority: changeTaskPriorityType
}

const Cards: React.FC<PropsType> = (props) => {
  // let CardList = new Array(props.colspan);
  // for (let i = 0; i < props.colspan; i++) { CardList[i] = []; }
  // for (let p = 0; p < props.data.lists.length; p++) { CardList[p % props.colspan].push(<Card data={props.data.list[p]} />); }

  if (!props.data.lists.length) {
    return <div></div>;
  }

  const isItCollapseFirst =
    props.data.isCollapse === undefined && window.innerWidth > 425;
  let tasksCount = 0;
  let commonWeight = 0;
  props.data.lists.forEach((list) => {
    tasksCount = tasksCount + list.list.length
    commonWeight = commonWeight + list.weight;
  });

  let renederedLists = [] as Array<any>;
  if (props.data.isCollapse === false || isItCollapseFirst) {
    renederedLists = props.data.lists.map((list, index) => (
      <React.Fragment key={index}>
        <MaintainerHeader list={list} setCurrentStateOfCardsList={props.setCurrentStateOfCardsList} status={props.status} index={index} />
        {(list.isCollapse === undefined || !list.isCollapse || props.status === 'atProgress') && <div key={"_" + Math.random().toString(36).substr(2, 9)} className={props.status === "waiting" && window.innerWidth > 425 ? "p-col p-grid" : ""}>
          {list.list.map((el, ix) => (
            <div style={{ position: "relative" }} key={index + "-" + ix} className={props.status === "waiting" && window.innerWidth > 425 ? "p-col-6" : "p-col"}>
              <Card
                changeTaskStatus={props.changeTaskStatus}
                status={props.status}
                data={el}
                avatar={list.avatar}
                setCardState={props.setCardState}
                maintainer={list.maintainer}
                changeTaskPriority={props.changeTaskPriority}
              />
            </div>
          ))}
        </div>}
      </React.Fragment>
    ))
    if (props.status === 'atProgress') {renederedLists.unshift(<div key={renederedLists.length + 1} className="emptyMaintainerHeaderLine"></div>)}
  }
  
  return (
    <div className="p-grid-col">
      <StatusHeader collapseAllMaintainerStatusesByTab={props.collapseAllMaintainerStatusesByTab} data={props.data} tasksCount={tasksCount} commonWeight={commonWeight} status={props.status} setCurrentStateOfCards={props.setCurrentStateOfCards} />
      {renederedLists}
    </div>
  );
};

export default React.memo(Cards);
