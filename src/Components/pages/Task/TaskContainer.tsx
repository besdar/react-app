import React from 'react';
import Task from './Task';
import { connect } from "react-redux";
import { setCurrentTaskState, setTaskProp, setTaskSpec, pushTaskButton, getTaskData, setNewTaskData, setNewTaskAttachement, sendTaskReply, setNewTaskDataType, getTaskDataType, setCurrentTaskStateType, setTaskPropType, setTaskSpecType, pushTaskButtonType, setNewTaskAttachementType } from "../../../redux/reducers/task-reducer";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { compose } from "redux";
import {AppStateType} from '../../../redux/store/redux-store';

// function resize() {
//     let elements = document.getElementsByClassName('p-inputtextarea') as HTMLCollectionOf<HTMLElement>;
//     Array.from(elements).forEach((el: HTMLElement) => {
//         el.style.height = el.scrollHeight + 'px';
//         el.style.overflow = 'hidden';
//     });
// }

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    setNewTaskData: setNewTaskDataType,
    getTaskData: getTaskDataType,
    setCurrentTaskState: setCurrentTaskStateType,
    setTaskProp: setTaskPropType,
    setTaskSpec: setTaskSpecType,
    pushTaskButton: pushTaskButtonType,
    setNewTaskAttachement: setNewTaskAttachementType
}

type PathParamsType = {
    taskNumber: string
}

type PropsType = MapPropsType & DispatchPropsType & RouteComponentProps<PathParamsType>;

class TaskContainer extends React.Component<PropsType> {

    componentDidMount() {
        document.title = "Задача";
        if (!isNaN(parseInt(this.props.match.params.taskNumber))) {this.props.getTaskData(this.props.match.params.taskNumber)}
        else {this.props.setNewTaskData()}
    }

    componentDidUpdate() {
        // if (this.props.fistInit === true) {
        //     window.setTimeout(resize, 0.1); //бага веба, нужно разобраться почему scrollHeight браузером при первом открытии вычисляется неверно
            //this.props.setCurrentTaskState('fistInit', false);
        // }  
    }

    render() {
        return <Task Task={this.props.Task}
                TaskMetadata={this.props.TaskMetadata}
                setTaskProp={this.props.setTaskProp}
                setTaskSpec={this.props.setTaskSpec}
                pushTaskButton={this.props.pushTaskButton}
                setCurrentTaskState={this.props.setCurrentTaskState}
                NowMessage={this.props.NowMessage}
                setNewTaskAttachement={this.props.setNewTaskAttachement}
                getTaskData={this.props.getTaskData}
                setNewTaskData={this.props.setNewTaskData} />
    }
}

let mapStateToProps = (state: AppStateType) => {
    return ({
        Task: state.TaskPage.Task,
        TaskMetadata: state.TaskPage.TaskMetadata,
        NowMessage: state.TaskPage.NowMessage,
        fistInit: state.TaskPage.Task.fistInit
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, {setCurrentTaskState, setTaskProp, setTaskSpec, pushTaskButton, getTaskData, setNewTaskData, setNewTaskAttachement, sendTaskReply}), withRouter)(TaskContainer);