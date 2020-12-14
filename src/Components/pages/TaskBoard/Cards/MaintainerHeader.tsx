import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CardNames, CardListsType, setCurrentStateOfCardsListType, setTaskboardFilterType } from '../../../../redux/reducers/taskboard-reducer';
import style from './MaintainerHeader.module.css';

type PropsType = {
    status: CardNames,
    setCurrentStateOfCardsList: setCurrentStateOfCardsListType,
    list: CardListsType,
    index: number,
    setTaskboardFilter: setTaskboardFilterType
}

const MaintainerHeader: React.FC<PropsType> = (props) => {
    if (props.status !== "atProgress") {
        return <div key={"_" + Math.random().toString(36).substr(2, 9)} className="p-col">
            <div className={style.maintainerHeaderLine}>
                <div className={style.avatarBlock} onClick={() => props.setTaskboardFilter('visibleMaintainer', props.list.maintainer)}>
                    <div className={style.avatar_img}><img loading="lazy" alt={props.list.maintainer} src={props.list.avatar} /></div>
                    <div className={style.title}>{props.list.maintainer}: {props.list.list.length} / {props.list.weight.toFixed(0)}</div>
                </div>
                
                <div className={style.maintainerHeaderLineRight} onClick={() => props.setCurrentStateOfCardsList(props.status, props.list.isCollapse === undefined || !props.list.isCollapse, props.index)}>
                    {props.list.isCollapse !== undefined && props.list.isCollapse ? (<FaPlus className={style.showIcon} />) : (<FaMinus className={style.showIcon} />)}
                </div>
            </div>
        </div>
    }
    else { return null }
};

export default React.memo(MaintainerHeader);