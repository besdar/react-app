import React from 'react';
import {NavLink} from "react-router-dom";

type PropsType = {}

const MainPage: React.FC<PropsType> = (props) => {
    return <div>
    <h1>Projector</h1>
    <div><NavLink to='/paradocs'>Paradocs</NavLink></div>
    <div><NavLink to='/taskboard'>Taskboard</NavLink></div>
    <div><NavLink to='/bids'>Bids</NavLink></div>
    <div><NavLink to='/tasks'>Tasks</NavLink></div>
    <div><a href='/logout'>Logout</a></div>
            </div>
}

export default MainPage;