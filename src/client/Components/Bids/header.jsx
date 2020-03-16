import React from 'react';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';

const Header = (props) => {

    return (<div className="p-grid">
        <div className="p-col-9">
            <h1 style={{ margin: "0px" }}>Заявки</h1>
        </div>
        <div className="p-col-3 head_buttons" style={{ textAlign: "right" }}>
            <Link to='/bids/NewBid'><Button icon="pi pi-plus" /></Link>
            <Button icon="pi pi-comments" onClick={function name(params) { props.setCurrentState('styleDisplayOfMessages', props.styleDisplayOfMessages == "none" ? "flex" : "none"); }} />
            <sup className="badge">{props.messagesList.length}</sup>
        </div>
    </div>);
}

export default Header;