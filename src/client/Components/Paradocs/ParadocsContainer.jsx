import React from 'react';
import Paradocs from "./Paradocs.jsx";
import { connect } from "react-redux";
import { getParadocsMenu, getParadocsEditors, SaveCurrentEditor, setEditorState, DialogOnExit, SaveCurrentEditors } from "../../redux/reducers/paradocs-reducer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";

class ParadocsContainer extends React.Component {

    refreshParadocs() {
        document.title = "Paradocs";
        this.props.getParadocsMenu();
    }

    componentDidMount() {
        this.refreshParadocs();
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

let mapStateToProps = (state) => {
    return ({
        items: state.ParadocsPage.items,
        editors: state.ParadocsPage.editors,
        uid: state.ParadocsPage.uid,
        editorModified: state.ParadocsPage.editorModified,
        showPopup: state.ParadocsPage.showPopup
    })
}

export default compose(connect(mapStateToProps, { getParadocsMenu, getParadocsEditors, SaveCurrentEditor, setEditorState, DialogOnExit, SaveCurrentEditors }), withRouter)(ParadocsContainer);