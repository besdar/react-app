import React from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';
import { AutoComplete } from 'primereact/autocomplete';

import "./Header.css";
import { MdViewComfy, MdViewModule, MdCallMissedOutgoing, MdCallMissed } from "react-icons/md";
import { AiOutlineFullscreenExit, AiOutlineFullscreen } from "react-icons/ai";
import { FaHome, FaAngleUp, FaAngleDown } from "react-icons/fa";
import { getTaskboardDataType, setHeaderVisibilityType, expandAllCardsType, collapseAllMaintainerTabsType, setTaskboardFilterType } from "../../../redux/reducers/taskboard-reducer";
import { FiRefreshCw } from "react-icons/fi";

type PropsType = {
  getTaskboardData: getTaskboardDataType,
  showSpinner: boolean,
  headerVisible: boolean,
  setHeaderVisibility: setHeaderVisibilityType,
  expandAllCards: expandAllCardsType,
  collapseAllMaintainerTabs: collapseAllMaintainerTabsType,
  isAllCollapsed: boolean,
  isAllCardExpanded: boolean,
  isReadyVisible: boolean,
  searchFilter: {
    suggestedCards: Array<string>,
    cardsSearchArray: Array<string>,
    selectedCard: string
  },
  setTaskboardFilter: setTaskboardFilterType
}

const seacrhCard = (query: string, setTaskboardFilter: setTaskboardFilterType, cardsSearchArray: Array<string>) => {
  setTaskboardFilter('searchFilter', { cardsSearchArray: cardsSearchArray, selectedCard: query, suggestedCards: cardsSearchArray.filter((element) => (element.includes(query))) })
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
        <AutoComplete completeMethod={(event: { originalEvent: Event, query: string }) => seacrhCard(event.query, props.setTaskboardFilter, props.searchFilter.cardsSearchArray)} 
          value={props.searchFilter.selectedCard} onChange={(e) => props.setTaskboardFilter('searchFilter', { selectedCard: e.value, cardsSearchArray: props.searchFilter.cardsSearchArray, suggestedCards: props.searchFilter.suggestedCards })} 
          suggestions={props.searchFilter.suggestedCards} dropdown minLength={3} maxlength={20} placeholder="Номер или название задачи" />
        <div className="rightHeader">
          <div onClick={() => props.setTaskboardFilter('invisibleCardNames', 'ready')}>{props.isReadyVisible ? <MdCallMissedOutgoing title="Выполненные скрыть" size='2em' /> : <MdCallMissed title="Выполненные отобразить" size='2em' />}</div>
          <div onClick={() => props.getTaskboardData()}><FiRefreshCw title="Сброс и обновление данных доски" size='2em' /></div>
          <div onClick={props.expandAllCards}>{props.isAllCardExpanded ? <MdViewComfy size='2em' title="Сжатый вид" /> : <MdViewModule size='2em' title="Подробный вид" />}</div>
          <div onClick={props.collapseAllMaintainerTabs}>{props.isAllCollapsed ? <AiOutlineFullscreen size='2em' title="Развернуть всё" /> : <AiOutlineFullscreenExit size='2em' title="Свернуть всё" />}</div>
          <Link to="/"><FaHome size='2em' /></Link>
        </div>
      </div>
    </Sidebar>
    <div className="showHeader" style={{ top: props.headerVisible ? 'calc(2rem + 45px)' : '0px' }} onClick={() => props.setHeaderVisibility(!props.headerVisible)}>
      {props.headerVisible ? <FaAngleUp size='2em' /> : <FaAngleDown size='2em' />}
    </div>
  </React.Fragment>);
};

export default React.memo(Header);
