import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CardNames, CardListsType, setCurrentStateOfCardsListType } from '../../../../redux/reducers/taskboard-reducer';
import './maintainerHeader.css';

type PropsType = {
    status: CardNames,
    setCurrentStateOfCardsList: setCurrentStateOfCardsListType,
    list: CardListsType,
    index: number
}

const MaintainerHeader: React.FC<PropsType> = (props) => {
    if (props.status !== "atProgress") {
        return <div key={"_" + Math.random().toString(36).substr(2, 9)} className="p-col">
            <div className="maintainerHeaderLine">
                <div className="avatarBlock">
                    <img alt="avatar" src={props.list.avatar} />
                    <div className="title">{props.list.maintainer}: {props.list.list.length} / {props.list.weight.toFixed(0)}</div>
                </div>
                
                <div className="maintainerHeaderLineRight" onClick={() => props.setCurrentStateOfCardsList(props.status, props.list.isCollapse === undefined || !props.list.isCollapse, props.index)}>
                    {props.list.isCollapse !== undefined && props.list.isCollapse ? (<FaPlus className="showIcon" />) : (<FaMinus className="showIcon" />)}
                </div>
            </div>
        </div>
    }
    else { return <div></div> }
};

export default React.memo(MaintainerHeader);