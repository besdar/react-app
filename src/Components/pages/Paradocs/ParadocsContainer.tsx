import React, { useLayoutEffect } from 'react';
import Paradocs from "./Paradocs";
import { connect } from "react-redux";
import { SaveEditorsOnClick, setEditorEditableState, SaveCurrentEditor, getParadocsMenu, getParadocsEditors, setEditorState, DialogOnExit, getParadocsEditorsType, setEditorStateType, DialogOnExitType, getParadocsMenuType, SaveCurrentEditorType, SaveEditorsOnClickType, setEditorEditableStateType } from "../../../redux/reducers/paradocs-reducer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { AppStateType } from '../../../redux/store/redux-store';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    getParadocsEditors: getParadocsEditorsType,
    setEditorState: setEditorStateType,
    DialogOnExit: DialogOnExitType,
    getParadocsMenu: getParadocsMenuType,
    SaveCurrentEditor: SaveCurrentEditorType,
    SaveEditorsOnClick: SaveEditorsOnClickType,
    setEditorEditableState: setEditorEditableStateType
}

type PropsType = MapPropsType & DispatchPropsType;

const ParadocsContainer: React.FC<PropsType> = (props) => {

    useLayoutEffect(() => {
        props.getParadocsMenu();
        // ошибка что мы передаем не пропсы а пустой массив. Намеренно, чтобы сработало аналогично ComponentDidMount
        // eslint-disable-next-line 
    }, []);

    return <Paradocs
        items={props.items}
        editors={props.editors}
        SaveCurrentEditor={props.SaveCurrentEditor}
        SaveEditorsOnClick={props.SaveEditorsOnClick}
        getParadocsEditors={props.getParadocsEditors}
        setEditorEditableState={props.setEditorEditableState}
        uid={props.uid}
        setEditorState={props.setEditorState}
        DialogOnExit={props.DialogOnExit}
        showPopup={props.showPopup}/>
}

const mapStateToProps = (state: AppStateType) => {
    return ({
        items: state.ParadocsPage.items,
        editors: state.ParadocsPage.editors,
        uid: state.ParadocsPage.uid,
        showPopup: state.ParadocsPage.showPopup
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, { SaveEditorsOnClick, SaveCurrentEditor, getParadocsMenu, getParadocsEditors, setEditorState, DialogOnExit, setEditorEditableState }), withRouter)(ParadocsContainer);