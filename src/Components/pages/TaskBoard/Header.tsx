import React from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from 'primereact/progressbar';

import "./Header.css";
import { MdViewComfy, MdViewModule } from "react-icons/md";
import { AiOutlineFullscreenExit, AiOutlineFullscreen } from "react-icons/ai";
import { FaSyncAlt, FaHome, FaAngleUp, FaAngleDown } from "react-icons/fa";
import { getTaskboardDataType, setHeaderVisibilityType, expandAllCardsType, collapseAllMaintainerStatusesByTabType } from "../../../redux/reducers/taskboard-reducer";

type PropsType = {
  getTaskboardData: getTaskboardDataType,
  showSpinner: boolean,
  headerVisible: boolean,
  setHeaderVisibility: setHeaderVisibilityType,
  expandAllCards: expandAllCardsType,
  collapseAllMaintainerTabs: collapseAllMaintainerStatusesByTabType,
  isAllCollapsed: boolean,
  isAllCardExpanded: boolean
}

const Header: React.FC<PropsType> = (props) => {
  return (<React.Fragment>
    {props.showSpinner && <ProgressBar className="progress_bar" mode="indeterminate" />}
    <div style={{ height: 'auto', zIndex: props.headerVisible ? 1001 : 0 }}>
      <div className="header" style={{ display: props.headerVisible ? 'flex' : 'none' }}>
        <div className="leftHeader">
          <h1>Taskboard</h1>
          <div onClick={() => props.getTaskboardData}><FaSyncAlt size='2em' /></div>
          <div onClick={props.expandAllCards}>{props.isAllCardExpanded ? <MdViewComfy size='2em' title="Сжатый вид" /> : <MdViewModule size='2em' title="Подробный вид" />}</div>
          <div onClick={() => props.collapseAllMaintainerTabs}>{props.isAllCollapsed ? <AiOutlineFullscreen size='2em' title="Развернуть всё" /> : <AiOutlineFullscreenExit size='2em' title="Свернуть всё" />}</div>
          {/* <Link to="/tasks/NewTask">
              <Button icon="pi pi-plus" />
            </Link> */}
        </div>
        <Link to="/">
            <FaHome size='2em' />
        </Link>
      </div>
      <div className="showHeader" onClick={() => props.setHeaderVisibility(!props.headerVisible)}>{props.headerVisible ? <FaAngleUp size='2em' /> : <FaAngleDown size='2em' />}</div>
    </div>
    {/* <Button className="showHeader" icon="pi pi-bars" onClick={() => props.setHeaderVisibility(!props.headerVisible)} /> */}
  </React.Fragment>);
};

export default React.memo(Header);
