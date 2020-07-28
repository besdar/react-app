import React from 'react';
import { FaSave } from "react-icons/fa";

type PropsType = {
    SaveEditorsOnClick: () => void
}

const Header:React.FC<PropsType> = (props) => {

    return (<div style={{ display: "flex", alignItems: 'flex-end' }}>
        <h1 style={{ margin: '0px 5px 15px 0px', lineHeight: '1' }}>Paradocs.</h1>
        <FaSave style={{color: '#007ad9', margin: '0px 5px 15px 0px'}} size="2em" onClick={props.SaveEditorsOnClick} />
    </div>);
}

export default Header;