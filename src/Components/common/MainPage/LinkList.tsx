import React from 'react';
import { NavLink } from "react-router-dom";

type PropsType = {
    exclude?: 'taskboard' | 'bids' | 'tasks' | 'logout' | 'ActualWork' | 'paradocs'
}

const LinkList: React.FC<PropsType> = (props) => {
    return <div>
        {/* {props.exclude !== 'paradocs' && <div><NavLink to='/paradocs'>Paradocs</NavLink></div>} */}
        {props.exclude !== 'taskboard' && <div> <NavLink to='/taskboard' > Taskboard </NavLink></div>}
        {props.exclude !== 'bids' && <div><NavLink to='/bids' > Bids </NavLink></div>}
        {props.exclude !== 'tasks' && <div><NavLink to='/tasks' > Tasks </NavLink></div>}
        {props.exclude !== 'logout' && <div><a href='/logout' > Logout </a></div>}
        {props.exclude !== 'ActualWork' && <div><NavLink to='/reports/ActualWork' > ActualWork </NavLink></div>}
    </div>
}

export default LinkList;