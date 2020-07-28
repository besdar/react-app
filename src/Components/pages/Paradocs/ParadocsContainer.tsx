import React from 'react';
import Paradocs from "./Paradocs";
import { connect } from "react-redux";
import { getParadocsMenu, getParadocsEditors, SaveCurrentEditor, setEditorState, DialogOnExit, SaveCurrentEditors, getParadocsEditorsType, SaveCurrentEditorType, setEditorStateType, DialogOnExitType, SaveCurrentEditorsType, getParadocsMenuType } from "../../../redux/reducers/paradocs-reducer";
import {withRouter} from "react-router-dom";
import { compose } from "redux";
import {AppStateType} from '../../../redux/store/redux-store';

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

class ParadocsContainer extends React.Component<PropsType> {

    componentDidMount() {
        document.title = "Paradocs";
        this.props.getParadocsMenu();
    }

    render() {
        return <Paradocs 
                    items={this.props.items} 
                    editors={this.props.editors} 
                    getParadocsEditors={this.props.getParadocsEditors} 
                    uid={this.props.uid} 
                    SaveCurrentEditor={this.props.SaveCurrentEditor}
                    setEditorState={this.props.setEditorState}
                    editorModified={this.props.editorModified} 
                    DialogOnExit={this.props.DialogOnExit}
                    showPopup={this.props.showPopup}
                    SaveCurrentEditors={this.props.SaveCurrentEditors} />
    }
}

let mapStateToProps = (state: AppStateType) => {
    return ({
        items: state.ParadocsPage.items,
        editors: state.ParadocsPage.editors,
        uid: state.ParadocsPage.uid,
        editorModified: state.ParadocsPage.editorModified,
        showPopup: state.ParadocsPage.showPopup
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, { getParadocsMenu, getParadocsEditors, SaveCurrentEditor, setEditorState, DialogOnExit, SaveCurrentEditors }), withRouter)(ParadocsContainer);