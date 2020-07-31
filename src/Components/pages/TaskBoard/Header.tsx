import React from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';

import "./Header.css";
import { MdViewComfy, MdViewModule } from "react-icons/md";
import { AiOutlineFullscreenExit, AiOutlineFullscreen } from "react-icons/ai";
import { FaHome, FaAngleUp, FaAngleDown } from "react-icons/fa";
import { getTaskboardDataType, setHeaderVisibilityType, expandAllCardsType, collapseAllMaintainerTabsType } from "../../../redux/reducers/taskboard-reducer";
import { FiRefreshCw } from "react-icons/fi";

type PropsType = {
  getTaskboardData: getTaskboardDataType,
  showSpinner: boolean,
  headerVisible: boolean,
  setHeaderVisibility: setHeaderVisibilityType,
  expandAllCards: expandAllCardsType,
  collapseAllMaintainerTabs: collapseAllMaintainerTabsType,
  isAllCollapsed: boolean,
  isAllCardExpanded: boolean
}

const Header: React.FC<PropsType> = (props) => {
  return (<React.Fragment>
    {props.showSpinner && <ProgressBar className="progress_bar" mode="indeterminate" />}
    {props.headerVisible && <div className="header_white_margin"></div>}
    <Sidebar modal={false} className="header_sidebar" position="top" visible={props.headerVisible} showCloseIcon={false} onHide={() => { }} dismissable={false}>
      <div className="header">
        <div className="leftHeader">
          <h1>Taskboard</h1>
        </div>
        <div className="rightHeader">
          <div onClick={() => props.getTaskboardData()}><FiRefreshCw size='2em' /></div>
          <div onClick={props.expandAllCards}>{props.isAllCardExpanded ? <MdViewComfy size='2em' title="Сжатый вид" /> : <MdViewModule size='2em' title="Подробный вид" />}</div>
          <div onClick={props.collapseAllMaintainerTabs}>{props.isAllCollapsed ? <AiOutlineFullscreen size='2em' title="Развернуть всё" /> : <AiOutlineFullscreenExit size='2em' title="Свернуть всё" />}</div>
          <Link to="/"><FaHome size='2em' /></Link>
        </div>
      </div>
      <div className="showHeader" onClick={() => props.setHeaderVisibility(!props.headerVisible)}>
        {props.headerVisible ? <FaAngleUp size='2em' /> : <FaAngleDown size='2em' />}
      </div>
    </Sidebar>
    {/* <Button className="showHeader" icon="pi pi-bars" onClick={() => props.setHeaderVisibility(!props.headerVisible)} /> */}
  </React.Fragment>);
};

export default React.memo(Header);
