import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { AiOutlineUsergroupAdd, AiOutlineUsergroupDelete } from "react-icons/ai";
import { CardsItemType, CardNames, setCurrentStateOfCardsType, collapseAllMaintainerStatusesByTabType } from '../../../../redux/reducers/taskboard-reducer';
import './statusHeader.css';

type PropsType = {
    data: CardsItemType,
    tasksCount: number,
    commonWeight: number,
    status: CardNames,
    setCurrentStateOfCards: setCurrentStateOfCardsType,
    collapseAllMaintainerStatusesByTab: collapseAllMaintainerStatusesByTabType
}

const StatusHeader: React.FC<PropsType> = (props) => {
    return <React.Fragment>
        <div className="p-col cardsHeader">
            <h3 title={props.data.header}>{props.data.header + ' ' + props.tasksCount + ' / ' + props.commonWeight.toFixed(0)}</h3>
            <div className="statusHeaderLineRight">
                <div className="iconButton" onClick={() => props.collapseAllMaintainerStatusesByTab(props.status)}>{props.data.isAllMaintainersCollapse ? <AiOutlineUsergroupAdd className="showIcon" /> : <AiOutlineUsergroupDelete className="showIcon" />}</div>
                <div className="iconButton"
                    onClick={() => props.setCurrentStateOfCards(props.status, "isCollapse", props.data.isCollapse === undefined || !props.data.isCollapse)}>
                    {props.data.isCollapse !== undefined && props.data.isCollapse ? (<FaPlus className="showIcon" />) : (<FaMinus className="showIcon" />)}
                </div>
            </div>
        </div>
        <hr style={{ marginTop: "0px" }} />
    </React.Fragment>
};

export default React.memo(StatusHeader);