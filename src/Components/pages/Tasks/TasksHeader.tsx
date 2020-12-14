import React from 'react';
import { Button } from "primereact/button";
import { Link } from 'react-router-dom';
import style from './TasksHeader.module.css';

type PropsType = {}

const Header: React.FC<PropsType> = (props) => {

    return <div className={["p-grid", style.tasksHeaderContainer].join(' ')}>
        <div className="p-col-9">
            <h1 className={style.tasksHeaderTitle}>Задачи</h1>
        </div>
        <div className={["p-col-3", style.head_buttons].join(' ')}>
            <Link to='/tasks/NewTask'><Button icon="pi pi-plus" /></Link>
            <div className={style.tasksHeaderButtonBadgeContainer}>
                {/* <sup className="badge">{}</sup> */}
            </div>
        </div>
    </div>;
}

export default Header;