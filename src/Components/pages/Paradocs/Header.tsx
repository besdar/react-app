import React from 'react';
import { FaSave } from "react-icons/fa";
import { SaveEditorsOnClickType } from '../../../redux/reducers/paradocs-reducer';
import style from './Header.module.css';

type PropsType = {
    SaveEditorsOnClick: SaveEditorsOnClickType
}

const Header:React.FC<PropsType> = (props) => {

    return (<div className={style.paradocsHeaderContainer}>
        <h1 className={style.paradocsHeaderTitle}>Paradocs.</h1>
        <FaSave title="Сохранить" className={style.paradocsHeaderTitleIcon} size="2em" onClick={() => props.SaveEditorsOnClick()} />
        {/* <FaFileDownload className={style.paradocsHeaderTitleIcon} size="2em" onClick={() => DownloadCurrentEditorsToFile()} /> */}
    </div>);
}

export default Header;