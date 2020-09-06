import React from 'react';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';
import { BidType, pushBidButtonType, createNewBidBaseOnThisBidType } from '../../../redux/reducers/bid-reducer';

type PropsType = {
    Bid: BidType,
    pushBidButton: pushBidButtonType,
    createNewBidBaseOnThisBid: createNewBidBaseOnThisBidType
}

const Header: React.FC<PropsType> = (props) => {

    return <div className="p-grid">
    <div className="p-col">
        <h1 style={{ margin: "0px" }}>{props.Bid.number === "" ? "Новая заявка" : props.Bid.name}</h1>
    </div>
    <div className="p-col-2 head_buttons">
        <Button tooltip="Сохранить" style={{ display: "inline-flex" }} icon="pi pi-save" onClick={() => props.pushBidButton('Сохранить')} />
        {props.Bid.number !== "" && <React.Fragment>
            <Button label="+Задача" style={{ display: "inline-flex" }} icon="pi pi-palette" onClick={() => props.createNewBidBaseOnThisBid('СоздатьНаОснованииЗадачу')} />
            <Button label="+Заявка" style={{ display: "inline-flex" }} icon="pi pi-palette" onClick={() => props.createNewBidBaseOnThisBid('СоздатьНаОснованииЗаявку')} />
        </React.Fragment>}
        <Link style={{ display: "inline-flex", textDecoration: 'none' }} to='/bids'><Button tooltip="Назад" icon="pi pi-arrow-left" /></Link> 
    </div>
</div>
}

export default React.memo(Header);