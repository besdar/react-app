import React from "react";
import PrimeCard from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import { Card as PrimeCard } from "primereact/card";
import { CardType, CardNames, setCardStateType, changeTaskPriorityType, changeTaskStatusType, setTaskboardFilterType } from '../../../../../redux/reducers/taskboard-reducer';

import style from "./Card.module.css";
import StatusIcon from "../../../../libriary/StatusIcon";
import { Link } from "react-router-dom";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

function footer(allowedStatuses: Array<string>, number: string, changeStatus: changeTaskStatusType, title: string, isExpanded: boolean | undefined) {
  if (isExpanded) {
    return (
      <React.Fragment>
        <div>{title}</div>
        <div className={style.cardFooter}>
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
    return <div className={style.cardContentText}>
      <span>
        <span className={style.pointerCursor} onClick={() => props.setTaskboardFilter('visibleProject', props.data.project)}>{props.data.project + ', '}</span>
        <Link className={style.inheritColor} to={'/tasks/' + props.data.number}>{props.data.number}</Link>
        {', ' + props.data.weight}
      </span>
      <br />
      <span>{props.data.customer + ', '}</span>
      <span className={style.pointerCursor} onClick={() => props.setTaskboardFilter('visibleMaintainer', props.maintainer)}>{props.maintainer}</span>
    </div>
  }
  else {
    return <div className={style.cardContentText}>
      <span className={style.shortCardContent}>
        <Link className={style.inheritColor} to={'/tasks/' + props.data.number}>
          {props.data.weight + ', ' + props.data.number + '. '}
        </Link>
        {props.data.title}
      </span>
    </div>
  }
}

const Card: React.FC<PropsType> = (props) => {

  if (props.data.allowedStatuses.length) {
    const priorityColorClass = props.data.priority === 0 ? style.importantPriorityCard : style.usualPriorituCard;
    const expandedHeightAvatarContainerClass = props.data.isExpanded ? style.expandedAvatarContainerHeight : style.inexpandedAvatarContainerHeight;
    const expandedAvatarClass = props.data.isExpanded ? style.expandedAvatar : style.inexpandedAvatar;

    return <PrimeCard className={style.sticker} style={{ backgroundColor: 'rgb(' + props.data.color + ')' }}>
      <CardContent className={style.cardContent}>
        <div className={style.avatarCardBlock + " " + priorityColorClass + ' ' + expandedHeightAvatarContainerClass}>
          <img className={expandedAvatarClass} loading="lazy" alt={props.maintainer} src={props.data.atWork.avatar ? props.data.atWork.avatar : props.avatar} />
          <span onClick={(e) => { e.stopPropagation(); props.changeTaskPriority(props.data.number, props.status) }}>
            <StatusIcon status={props.data.status} size={props.data.isExpanded ? '1.8em' : '1.3em'} isHeader />
          </span>
        </div>
        <HeaderCardBody setTaskboardFilter={props.setTaskboardFilter} data={props.data} maintainer={props.maintainer} />
        {props.data.isExpanded && <span title="фактический анализ + проектирование + разработка + тестирование" className={style.totalCardWeight + " p-badge"}>{props.data.totalWeight}</span>}
        <div className={style.cardExpandArrow} onClick={() => { props.setCardState(props.data.id, props.status, "isExpanded", !props.data.isExpanded) }}>
          {props.data.isExpanded ? <FaAngleUp size='2em' /> : <FaAngleDown size='2em' />}
        </div>
      </CardContent>
      <CardActions className={style.cardFooterActions}>
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
    return <PrimeCard className={style.emptyCard}>
      <span className={style.emptyCardContent}>{props.data.title}</span>
    </PrimeCard>
  }

};

export default React.memo(Card);
