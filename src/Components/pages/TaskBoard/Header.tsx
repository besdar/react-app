import React from "react";
import { Link } from "react-router-dom";
//import { ProgressBar } from 'primereact/progressbar';
//import { Sidebar } from 'primereact/sidebar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Drawer from '@material-ui/core/Drawer';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
//import { AutoComplete } from 'primereact/autocomplete';

import style from "./Header.module.css";
import { MdViewComfy, MdViewModule, MdCallMissedOutgoing, MdCallMissed } from "react-icons/md";
import { AiOutlineFullscreenExit, AiOutlineFullscreen } from "react-icons/ai";
import { FaHome, FaAngleUp, FaAngleDown, FaPlusCircle, FaBars } from "react-icons/fa";
import { getTaskboardDataType, setHeaderVisibilityType, expandAllCardsType, collapseAllMaintainerTabsType, setTaskboardFilterType, searchFilterType, taskboardVisibilityType } from "../../../redux/reducers/taskboard-reducer";
import { FiRefreshCw } from "react-icons/fi";
import LinkList from "../../common/MainPage/LinkList";

type PropsType = {
  getTaskboardData: getTaskboardDataType,
  visibility: taskboardVisibilityType,
  setHeaderVisibility: setHeaderVisibilityType,
  expandAllCards: expandAllCardsType,
  collapseAllMaintainerTabs: collapseAllMaintainerTabsType,
  isAllCollapsed: boolean,
  isAllCardExpanded: boolean,
  isReadyVisible: boolean,
  searchFilter: searchFilterType,
  setTaskboardFilter: setTaskboardFilterType
}

const Header: React.FC<PropsType> = (props) => {
  return (<React.Fragment>
    {props.visibility.showSpinner && <LinearProgress className={style.progress_bar} />}
    {props.visibility.headerVisible && <div className={style.header_white_margin}></div>}
    <Drawer anchor="left" variant="persistent" open={props.visibility.menuVisible}>
      <div className={style.header_white_margin}></div>
      <LinkList exclude='taskboard' />
    </Drawer>
    <Drawer className={style.header_sidebar} anchor="top" open={props.visibility.headerVisible} variant="persistent" >
      <div className={style.header}>
        <div className={style.leftHeader}>
          <div onClick={() => { props.setHeaderVisibility(props.visibility.headerVisible, !props.visibility.menuVisible) }}><FaBars title="Меню" size='2em' /></div>
          <h1>Taskboard</h1>
        </div>
        <Autocomplete
          className={style.NumberNameAutocompleteFilterInput}
          onChange={(originalEvent, query) => {
            //seacrhCard(query as string, props.setTaskboardFilter, props.searchFilter.cardsSearchArray);
            props.setTaskboardFilter('searchFilter', { inputSelectedCard: query || "", cardsSearchArray: props.searchFilter.cardsSearchArray, FullTextOfSelectedCard: query || '' })
          }}
          onInputChange={(originalEvent, query) => {
            //seacrhCard(query as string, props.setTaskboardFilter, props.searchFilter.cardsSearchArray);
            props.setTaskboardFilter('searchFilter', { inputSelectedCard: query || "", cardsSearchArray: props.searchFilter.cardsSearchArray, FullTextOfSelectedCard: '' })
          }}
          inputValue={props.searchFilter.inputSelectedCard}
          autoComplete
          includeInputInList
          renderInput={(params) => <TextField {...params} label="Номер или название задачи" variant="outlined" />}
          value={props.searchFilter.FullTextOfSelectedCard}
          getOptionSelected={(option) => (!!option)}
          options={props.searchFilter.cardsSearchArray} />
        <div className={style.rightHeader}>
          <div onClick={() => props.setTaskboardFilter('invisibleCardNames', 'ready')}>{props.isReadyVisible ? <MdCallMissedOutgoing title="Выполненные скрыть" size='2em' /> : <MdCallMissed title="Выполненные отобразить" size='2em' />}</div>
          <div onClick={() => props.getTaskboardData()}><FiRefreshCw title="Сброс и обновление данных доски" size='2em' /></div>
          <div onClick={props.expandAllCards}>{props.isAllCardExpanded ? <MdViewComfy size='2em' title="Сжатый вид" /> : <MdViewModule size='2em' title="Подробный вид" />}</div>
          <div onClick={props.collapseAllMaintainerTabs}>{props.isAllCollapsed ? <AiOutlineFullscreen size='2em' title="Развернуть всё" /> : <AiOutlineFullscreenExit size='2em' title="Свернуть всё" />}</div>
          <div onClick={() => window.open(window.location.origin + '/tasks/newTask')}><FaPlusCircle title="Новая задача" size='2em' /></div>
          <Link to="/"><FaHome size='2em' /></Link>
        </div>
      </div>
    </Drawer>
    <div className={style.showHeader + ' ' + (props.visibility.headerVisible ? style.showHeaderOpen : style.showHeaderClosed)} onClick={() => props.setHeaderVisibility(!props.visibility.headerVisible)}>
      {props.visibility.headerVisible ? <FaAngleUp size='2em' /> : <FaAngleDown size='2em' />}
    </div>
  </React.Fragment>);
};

export default React.memo(Header);
