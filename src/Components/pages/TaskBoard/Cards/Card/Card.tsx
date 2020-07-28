import React from "react";
import { Card as PrimeCard } from "primereact/card";
import { CardType, CardNames, setCardStateType, changeTaskPriorityType, changeTaskStatusType } from '../../../../../redux/reducers/taskboard-reducer';

import "./Card.css";
import StatusIcon from "../../../../libriary/StatusIcon";
import { Link } from "react-router-dom";

function footer(allowedStatuses: Array<string>, number: string, changeStatus: (number: string, status: string) => void, title: string, isExpanded: boolean | undefined) {
  if (isExpanded) {
    return (
      <React.Fragment>
        <div>{title}</div>
        <div className="cardFooter">
          {allowedStatuses.map((status: string, index: number) => (<div key={index} onClick={(e) => { changeStatus(number, status); }}>
            <StatusIcon status={status} size={'1em'} isHeader={false} />
          </div>))}
        </div>
      </React.Fragment>
    );
  }
  else return <div></div>
}

type PropsType = {
  data: CardType,
  status: CardNames,
  avatar: string,
  maintainer: string,
  changeTaskStatus: changeTaskStatusType,
  setCardState: setCardStateType,
  changeTaskPriority: changeTaskPriorityType
}

const Card: React.FC<PropsType> = (props) => {
  let headerBody = <React.Fragment>
    <span className="shortCardContent"><Link style={{color: 'inherit'}} to={'/tasks/' + props.data.number}>{props.data.weight + ', ' + props.data.number + ', ' + props.data.title}</Link></span>
  </React.Fragment>
  if (props.data.isExpanded) {
    headerBody = <React.Fragment>
      <span><Link style={{color: 'inherit'}} to={'/tasks/' + props.data.number}>{props.data.taskInfo}</Link></span>
      <span>{props.data.customer + ', ' + props.maintainer}</span>
    </React.Fragment>
  }

  return (
    <div onClick={() => { props.setCardState(props.data.id, props.status, "isExpanded", !props.data.isExpanded) }}>
      <PrimeCard className="sticker" style={{ backgroundColor: 'rgb(' + props.data.color + ')' }}
        footer={props.data.isExpanded && footer(
          props.data.allowedStatuses,
          props.data.number,
          props.changeTaskStatus,
          props.data.title,
          props.data.isExpanded
        )}>
        <div className="cardContent">
          <div className="avatarCardBlock" style={{ color: props.data.priority === 0 ? "red" : "orange", height: (props.data.isExpanded ? '65px' : '50px') }}>
            <img alt="avatar" style={{ height: (props.data.isExpanded ? 'auto' : '1.3em') }} src={props.avatar} />
            <div onClick={(e) => { e.stopPropagation(); props.changeTaskPriority(props.data.number, props.status) }}>
              <StatusIcon status={props.data.status} size={props.data.isExpanded ? '1.8em' : '1.3em'} isHeader={true} />
            </div>
          </div>
          <div className="cardContentText">
            {headerBody}
          </div>
        </div>
      </PrimeCard>
    </div>);
};

export default React.memo(Card);
