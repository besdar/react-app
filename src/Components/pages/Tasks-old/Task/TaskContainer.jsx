import React from 'react';
import Task from './Task';
import { connect } from "react-redux";
import { setCurrentState, setTaskProp, setTaskSpec, pushButton, getTaskData, setNewTaskData, setNewAttachement } from "../../../redux/reducers/tasks-reducer-old";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import {Growl} from 'primereact/growl';

function resize() {
    let elements = document.getElementsByClassName('p-inputtextarea');
    Array.from(elements).forEach((el) => {
        el.style.height = el.scrollHeight + 'px';
        el.style.overflow = 'hidden';
    });
}

class TaskContainer extends React.Component {

    componentDidMount() {
        document.title = "Задача";
        if (!isNaN(this.props.match.params.taskNumber)) {this.props.getTaskData(this.props.match.params.taskNumber)}
        else {this.props.setNewTaskData()}
    }

    componentDidUpdate() {
        if (this.props.fistInit == true) {
            window.setTimeout(resize, 0.1); //бага веба, нужно разобраться почему scrollHeight браузером при первом открытии вычисляется неверно
            this.props.setCurrentState('fistInit', false);
        }  
    }

    render() {
        return <React.Fragment>
                <Task Task={this.props.Task}
                TaskMetadata={this.props.TaskMetadata}
                setTaskProp={this.props.setTaskProp}
                setTaskSpec={this.props.setTaskSpec}
                pushButton={this.props.pushButton}
                setCurrentState={this.props.setCurrentState}
                NowMessage={this.props.NowMessage}
                GrowlMetod={this.growl}
                setNewAttachement={this.props.setNewAttachement} />
                <Growl ref={(el) => this.growl = el}></Growl>
            </React.Fragment>
    }
}

let mapStateToProps = (state) => {
    return ({
        Task: state.TasksPage.Task,
        TaskMetadata: state.TasksPage.TaskMetadata,
        NowMessage: state.TasksPage.NowMessage,
        fistInit: state.TasksPage.fistInit
    })
}

export default compose(connect(mapStateToProps, {setCurrentState, setTaskProp, setTaskSpec, pushButton, getTaskData, setNewTaskData, setNewAttachement}), withRouter)(TaskContainer);