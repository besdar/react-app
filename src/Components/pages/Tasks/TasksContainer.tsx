import React from 'react';
import Tasks from './Tasks';
import { connect } from "react-redux";
import { getTasksList, setTasksCurrentState, setTasksContextMenu, getTasksListType, setTasksCurrentStateType, setTasksContextMenuType } from "../../../redux/reducers/tasks-reducer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { AppStateType } from '../../../redux/store/redux-store';
import { MenuItem } from 'primereact/components/menuitem/MenuItem';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    getTasksList: getTasksListType,
    setTasksCurrentState: setTasksCurrentStateType,
    setTasksContextMenu: setTasksContextMenuType,
    AllowedItems: Array<MenuItem>
}

type PropsType = MapPropsType & DispatchPropsType;

class TasksContainer extends React.Component<PropsType> {

    componentDidMount() {
        document.title = "Задачи";
        this.props.getTasksList();
    }

    render() {
        return <Tasks
            tasksList={this.props.tasksList}
            setTasksCurrentState={this.props.setTasksCurrentState}
            setTasksContextMenu={this.props.setTasksContextMenu}
            AllowedItems={this.props.AllowedItems} />
    }
}

const mapStateToProps = (state: AppStateType) => {
    return ({
        tasksList: state.TasksPage.tasksList,
        AllowedItems: state.TasksPage.AllowedItems
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, { setTasksCurrentState, getTasksList, setTasksContextMenu }), withRouter)(TasksContainer);