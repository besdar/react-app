import React, { useLayoutEffect } from 'react';
import Tasks from './Tasks';
import { connect } from "react-redux";
import { getTasksList, getTasksListType} from "../../../redux/reducers/tasks-reducer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { AppStateType } from '../../../redux/store/redux-store';
import { MenuItem } from 'primereact/components/menuitem/MenuItem';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    getTasksList: getTasksListType,
    AllowedItems: Array<MenuItem>
}

type PropsType = MapPropsType & DispatchPropsType;

const TasksContainer: React.FC<PropsType> = (props) => {

    useLayoutEffect(() => {
        props.getTasksList();
        // ошибка что мы передаем не пропсы а пустой массив. Намеренно, чтобы сработало аналогично ComponentDidMount
        // eslint-disable-next-line 
    }, []);

    return <Tasks
        tasksList={props.tasksList}
        AllowedItems={props.AllowedItems} />
}

const mapStateToProps = (state: AppStateType) => {
    return ({
        tasksList: state.TasksPage.tasksList,
        AllowedItems: state.TasksPage.AllowedItems
    })
}

export default compose<React.ComponentType>(connect(mapStateToProps, { getTasksList }), withRouter)(TasksContainer);