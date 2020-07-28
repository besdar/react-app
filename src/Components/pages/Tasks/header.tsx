import React from 'react';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';

type PropsType = {
    
}

const Header: React.FC<PropsType> = (props) => {

    return (<div className="p-grid" style={{marginTop: '5px', padding: "0 0.857em"}}>
        <div className="p-col-9">
            <h1 style={{ margin: "0px" }}>Задачи</h1>
        </div>
        <div className="p-col-3 head_buttons">
            <Link to='/tasks/NewTask'><Button icon="pi pi-plus" /></Link>
            <div style={{position: 'relative'}}>
                {/* <sup className="badge">{}</sup> */}
            </div>
        </div>
    </div>);
}

export default Header;