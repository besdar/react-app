import React, { useLayoutEffect } from 'react';
import Paradocs from "./Paradocs";
import { connect } from "react-redux";
import { getParadocsMenu, getParadocsEditors, SaveCurrentEditor, setEditorState, DialogOnExit, SaveCurrentEditors, getParadocsEditorsType, SaveCurrentEditorType, setEditorStateType, DialogOnExitType, SaveCurrentEditorsType, getParadocsMenuType } from "../../../redux/reducers/paradocs-reducer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { AppStateType } from '../../../redux/store/redux-store';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    getParadocsEditors: getParadocsEditorsType,
    SaveCurrentEditor: SaveCurrentEditorType,
    setEditorState: setEditorStateType,
    DialogOnExit: DialogOnExitType,
    SaveCurrentEditors: SaveCurrentEditorsType,
    getParadocsMenu: getParadocsMenuType
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
        getParadocsEditors={props.getParadocsEditors}
        uid={props.uid}
        SaveCurrentEditor={props.SaveCurrentEditor}
        setEditorState={props.setEditorState}
        editorModified={props.editorModified}
        DialogOnExit={props.DialogOnExit}
        showPopup={props.showPopup}
        SaveCurrentEditors={props.SaveCurrentEditors} />
}

const mapStateToProps = (state: AppStateType) => {
    return ({
        items: state.ParadocsPage.items,
        editors: state.ParadocsPage.editors,
        uid: state.ParadocsPage.uid,
        editorModified: state.ParadocsPage.editorModified,
        showPopup: state.ParadocsPage.showPopup
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, { getParadocsMenu, getParadocsEditors, SaveCurrentEditor, setEditorState, DialogOnExit, SaveCurrentEditors }), withRouter)(ParadocsContainer);