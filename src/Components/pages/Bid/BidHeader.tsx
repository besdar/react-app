import React from 'react';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';
import { BidType, pushBidButtonType, createNewBidBaseOnThisBidType } from '../../../redux/reducers/bid-reducer';
import './BidHeader.css';

type PropsType = {
    Bid: BidType,
    pushBidButton: pushBidButtonType,
    createNewBidBaseOnThisBid: createNewBidBaseOnThisBidType
}

const Header: React.FC<PropsType> = (props) => {

    return <div className="p-grid">
    <div className="p-col">
        <h1 className='bidTitle'>{props.Bid.number === "" ? "Новая заявка" : props.Bid.name}</h1>
    </div>
    <div className="p-col-2 head_buttons">
        <Button tooltip="Сохранить" className='inlineFlexDisplay' icon="pi pi-save" onClick={() => props.pushBidButton('Сохранить')} />
        {props.Bid.number !== "" && <React.Fragment>
            <Button label="+Задача" className='inlineFlexDisplay' icon="pi pi-palette" onClick={() => props.createNewBidBaseOnThisBid('СоздатьНаОснованииЗадачу')} />
            <Button label="+Заявка" className='inlineFlexDisplay' icon="pi pi-palette" onClick={() => props.createNewBidBaseOnThisBid('СоздатьНаОснованииЗаявку')} />
        </React.Fragment>}
        <Link className='inlineFlexDisplay linkWithoutDecoration' to='/bids'><Button tooltip="Назад" icon="pi pi-arrow-left" /></Link> 
    </div>
</div>
}

export default React.memo(Header);