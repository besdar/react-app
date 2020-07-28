import React from 'react';
import { Button } from "primereact/button";
import {ToggleButton} from 'primereact/togglebutton';
import { Link } from 'react-router-dom';
import TreeNode from 'primereact/components/treenode/TreeNode';
import { setBidsCurrentStateType } from '../../../redux/reducers/bids-reducer';

type PropsType = {
    messagesList: Array<TreeNode>,
    setBidsCurrentState: setBidsCurrentStateType,
    styleDisplayOfMessages: "none" | "flex"
}

const Header: React.FC<PropsType> = (props) => {

    return (<div className="p-grid" style={{marginTop: '5px', padding: "0 0.857em"}}>
        <div className="p-col-9">
            <h1 style={{ margin: "0px" }}>Заявки</h1>
        </div>
        <div className="p-col-3 head_buttons">
            <Link to='/bids/NewBid'><Button icon="pi pi-plus" /></Link>
            <div style={{position: 'relative'}}>
                <ToggleButton className="p-button-icon-only" onIcon="pi pi-comments" offIcon="pi pi-comments" onLabel='p-btn' offLabel='p-btn' checked={props.styleDisplayOfMessages === "none"} onChange={function name(params) { props.setBidsCurrentState('styleDisplayOfMessages', props.styleDisplayOfMessages === "none" ? "flex" : "none"); }} />
                <sup className="badge">{props.messagesList.length}</sup>
            </div>
        </div>
    </div>);
}

export default Header;