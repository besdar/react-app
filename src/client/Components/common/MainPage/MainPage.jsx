import React from 'react';
import {NavLink} from "react-router-dom";

const MainPage = (props) => {
    return <div>
    <div><p>Welcome to 1C</p></div>
    <div><NavLink to='/paradocs'>Paradocs</NavLink></div>
    <div><a href='/logout'>Logout</a></div>
            </div>
}

export default MainPage;