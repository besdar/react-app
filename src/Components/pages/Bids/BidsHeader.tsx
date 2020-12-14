import React from 'react';
import { Button } from "primereact/button";
import {ToggleButton} from 'primereact/togglebutton';
import { Link } from 'react-router-dom';
import TreeNode from 'primereact/components/treenode/TreeNode';
import { setBidsCurrentStateType } from '../../../redux/reducers/bids-reducer';
import './BidsHeader.css';

type PropsType = {
    messagesList: Array<TreeNode>,
    setBidsCurrentState: setBidsCurrentStateType,
    styleDisplayOfMessages: "none" | "flex"
}

const Header: React.FC<PropsType> = (props) => {

    return (<div className="p-grid bidsHeaderContainer">
        <div className="p-col-9">
            <h1 className='bidsHeaderTitle'>Заявки</h1>
        </div>
        <div className="p-col-3 head_buttons">
            <Link to='/bids/NewBid'><Button icon="pi pi-plus" /></Link>
            <div className='bidsHeaderCommentsButtonContainer'>
                <ToggleButton className="p-button-icon-only" onIcon="pi pi-comments" offIcon="pi pi-comments" onLabel='p-btn' offLabel='p-btn' checked={props.styleDisplayOfMessages === "none"} onChange={function name(params) { props.setBidsCurrentState('styleDisplayOfMessages', props.styleDisplayOfMessages === "none" ? "flex" : "none"); }} />
                <sup className="badge">{props.messagesList.length}</sup>
            </div>
        </div>
    </div>);
}

export default Header;