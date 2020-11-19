import React from "react";
import PrimeCard from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import { Card as PrimeCard } from "primereact/card";
import { CardType, CardNames, setCardStateType, changeTaskPriorityType, changeTaskStatusType, setTaskboardFilterType } from '../../../../../redux/reducers/taskboard-reducer';

import "./Card.css";
import StatusIcon from "../../../../libriary/StatusIcon";
import { Link } from "react-router-dom";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

function footer(allowedStatuses: Array<string>, number: string, changeStatus: changeTaskStatusType, title: string, isExpanded: boolean | undefined) {
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
  else return null
}

type PropsType = {
  data: CardType,
  status: CardNames,
  avatar: string,
  maintainer: string,
  changeTaskStatus: changeTaskStatusType,
  setCardState: setCardStateType,
  changeTaskPriority: changeTaskPriorityType,
  setTaskboardFilter: setTaskboardFilterType
}

const HeaderCardBody = (props: { data: CardType, maintainer: string, setTaskboardFilter: setTaskboardFilterType }) => {
  if (props.data.isExpanded) {
    return <div className="cardContentText">
      <span>
        <span style={{ cursor: 'pointer' }} onClick={() => props.setTaskboardFilter('visibleProject', props.data.project)}>{props.data.project + ', '}</span>
        <Link style={{ color: 'inherit' }} to={'/tasks/' + props.data.number}>{props.data.number}</Link>
        {', ' + props.data.weight}
      </span>
      <br />
      <span>{props.data.customer + ', '}</span>
      <span style={{ cursor: 'pointer' }} onClick={() => props.setTaskboardFilter('visibleMaintainer', props.maintainer)}>{props.maintainer}</span>
    </div>
  }
  else {
    return <div className="cardContentText">
      <span className="shortCardContent">
        <Link style={{ color: 'inherit' }} to={'/tasks/' + props.data.number}>
          {props.data.weight + ', ' + props.data.number + '. '}
        </Link>
        {props.data.title}
      </span>
    </div>
  }
}

const Card: React.FC<PropsType> = (props) => {

  if (props.data.allowedStatuses.length) {
    return <PrimeCard className="sticker" style={{ backgroundColor: 'rgb(' + props.data.color + ')' }}>
      <CardContent className="cardContent">
        <div className="avatarCardBlock" style={{ color: props.data.priority === 0 ? "red" : "orange", height: (props.data.isExpanded ? '65px' : '48px') }}>
          <img loading="lazy" alt="avatar" style={{ height: (props.data.isExpanded ? '20px' : '1.3em'), width: (props.data.isExpanded ? '20px' : '1.3em') }} src={props.data.atWork.avatar ? props.data.atWork.avatar : props.avatar} />
          <span onClick={(e) => { e.stopPropagation(); props.changeTaskPriority(props.data.number, props.status) }}>
            <StatusIcon status={props.data.status} size={props.data.isExpanded ? '1.8em' : '1.3em'} isHeader={true} />
          </span>
        </div>
        <HeaderCardBody setTaskboardFilter={props.setTaskboardFilter} data={props.data} maintainer={props.maintainer} />
        {props.data.isExpanded && <span title="фактический анализ + проектирование + разработка + тестирование" className="totalCardWeight p-badge">{props.data.totalWeight}</span>}
        <div className="cardExpandArrow" onClick={() => { props.setCardState(props.data.id, props.status, "isExpanded", !props.data.isExpanded) }}>
          {props.data.isExpanded ? <FaAngleUp size='2em' /> : <FaAngleDown size='2em' />}
        </div>
      </CardContent>
      <CardActions className="cardFooterActions">
        {props.data.isExpanded && footer(
          props.data.allowedStatuses,
          props.data.number,
          props.changeTaskStatus,
          props.data.title,
          props.data.isExpanded
        )}
      </CardActions>
    </PrimeCard>
  } else {
    return <PrimeCard style={{ position: 'relative' }}>
      <span style={{ color: '#ff8c69', fontSize: '1.17em', fontWeight: 'bolder' }}>{props.data.title}</span>
    </PrimeCard>
  }

};

export default React.memo(Card);
