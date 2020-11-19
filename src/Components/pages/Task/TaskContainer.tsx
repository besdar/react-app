import React, { useLayoutEffect } from 'react';
import Task from './Task';
import { connect } from "react-redux";
import { setCurrentTaskState, setTaskProp, setTaskSpec, pushTaskButton, getTaskData, setNewTaskData, setNewTaskAttachement, setNewTaskDataType, getTaskDataType, setCurrentTaskStateType, setTaskPropType, setTaskSpecType, pushTaskButtonType, setNewTaskAttachementType, setSpecificationContext, setSpecificationContextType } from "../../../redux/reducers/task-reducer";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { compose } from "redux";
import { AppStateType } from '../../../redux/store/redux-store';
import { sendBidReplyType, sendBidReply } from '../../../redux/reducers/bid-reducer';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    setNewTaskData: setNewTaskDataType,
    getTaskData: getTaskDataType,
    setCurrentTaskState: setCurrentTaskStateType,
    setTaskProp: setTaskPropType,
    setTaskSpec: setTaskSpecType,
    pushTaskButton: pushTaskButtonType,
    setNewTaskAttachement: setNewTaskAttachementType,
    setSpecificationContext: setSpecificationContextType,
    sendBidReply: sendBidReplyType
}

type PathParamsType = {
    taskNumber: string
}

type PropsType = MapPropsType & DispatchPropsType & RouteComponentProps<PathParamsType>;

const TaskContainer: React.FC<PropsType> = (props) => {

    useLayoutEffect(() => {
        if (!isNaN(parseInt(props.match.params.taskNumber))) { props.getTaskData(props.match.params.taskNumber) }
        else { props.setNewTaskData() }
        // ошибка что мы передаем не пропсы а пустой массив. Намеренно, чтобы сработало аналогично ComponentDidMount
        // eslint-disable-next-line 
    }, []);

    //componentDidUpdate() {
    // if (props.fistInit === true) {
    //     window.setTimeout(resize, 0.1); //бага веба, нужно разобраться почему scrollHeight браузером при первом открытии вычисляется неверно
    //props.setCurrentTaskState('fistInit', false);
    // }  
    //}

    return <Task Task={props.Task}
        TaskMetadata={props.TaskMetadata}
        setTaskProp={props.setTaskProp}
        setTaskSpec={props.setTaskSpec}
        pushTaskButton={props.pushTaskButton}
        setCurrentTaskState={props.setCurrentTaskState}
        NowMessage={props.NowMessage}
        setNewTaskAttachement={props.setNewTaskAttachement}
        getTaskData={props.getTaskData}
        setNewTaskData={props.setNewTaskData}
        setSpecificationContext={props.setSpecificationContext}
        sendBidReply={props.sendBidReply} />
}

// function resize() {
//     let elements = document.getElementsByClassName('p-inputtextarea') as HTMLCollectionOf<HTMLElement>;
//     Array.from(elements).forEach((el: HTMLElement) => {
//         el.style.height = el.scrollHeight + 'px';
//         el.style.overflow = 'hidden';
//     });
// }

const mapStateToProps = (state: AppStateType) => {
    return ({
        Task: state.TaskPage.Task,
        TaskMetadata: state.TaskPage.TaskMetadata,
        NowMessage: state.TaskPage.NowMessage,
        fistInit: state.TaskPage.Task.fistInit
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, { setCurrentTaskState, setTaskProp, setTaskSpec, pushTaskButton, getTaskData, setNewTaskData, setNewTaskAttachement, setSpecificationContext, sendBidReply }), withRouter)(TaskContainer);