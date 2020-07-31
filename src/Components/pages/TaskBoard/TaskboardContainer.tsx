import React from "react";
import Taskboard from "./Taskboard";
import { connect } from "react-redux";
import {
    getTaskboardData,
    setCurrentStateOfCards,
    changeTaskStatus,
    setError,  
    CardsType, 
    setCurrentStateOfCardsList, 
    setHeaderVisibility,
    setCardState,
    expandAllCards,
    collapseAllMaintainerTabs,
    collapseAllMaintainerStatusesByTab,
    changeTaskPriority,
    getTaskboardDataType,
    changeTaskStatusType,
    setCurrentStateOfCardsType,
    setCurrentStateOfCardsListType,
    setErrorType,
    setHeaderVisibilityType,
    setCardStateType,
    expandAllCardsType,
    collapseAllMaintainerTabsType,
    collapseAllMaintainerStatusesByTabType,
    changeTaskPriorityType
} from "../../../redux/reducers/taskboard-reducer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { AppStateType } from '../../../redux/store/redux-store';

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    getTaskboardData: getTaskboardDataType,
    changeTaskStatus: changeTaskStatusType,
    setCurrentStateOfCards: setCurrentStateOfCardsType,
    setCurrentStateOfCardsList: setCurrentStateOfCardsListType,
    setError: setErrorType,
    Cards: CardsType,
    showSpinner: boolean,
    headerVisible: boolean,
    setHeaderVisibility: setHeaderVisibilityType,
    setCardState: setCardStateType,
    expandAllCards: expandAllCardsType,
    collapseAllMaintainerTabs: collapseAllMaintainerTabsType,
    isAllCollapsed: boolean,
    isAllCardExpanded: boolean,
    collapseAllMaintainerStatusesByTab: collapseAllMaintainerStatusesByTabType,
    changeTaskPriority: changeTaskPriorityType
}

type PropsType = MapPropsType & DispatchPropsType;

class TaskboardContainer extends React.Component<PropsType> {
    componentDidMount() {
        document.title = "Taskboard";
        this.props.getTaskboardData(window.innerWidth < 425);
    }

    render() {
        return (
            <Taskboard
                changeTaskStatus={this.props.changeTaskStatus}
                getTaskboardData={this.props.getTaskboardData}
                setCurrentStateOfCards={this.props.setCurrentStateOfCards}
                Cards={this.props.Taskboard.Cards}
                showSpinner={this.props.Taskboard.showSpinner}
                setCurrentStateOfCardsList={this.props.setCurrentStateOfCardsList}
                errorMessage={this.props.Taskboard.errorMessage}
                setError={this.props.setError}
                headerVisible={this.props.Taskboard.headerVisible}
                setHeaderVisibility={this.props.setHeaderVisibility}
                setCardState={this.props.setCardState}
                expandAllCards={this.props.expandAllCards}
                collapseAllMaintainerTabs={this.props.collapseAllMaintainerTabs}
                isAllCollapsed={this.props.Taskboard.isAllCollapsed}
                isAllCardExpanded={this.props.Taskboard.isAllCardExpanded}
                collapseAllMaintainerStatusesByTab={this.props.collapseAllMaintainerStatusesByTab}
                changeTaskPriority={this.props.changeTaskPriority}
            />
        );
    }
}

let mapStateToProps = (state: AppStateType) => ({ Taskboard: state.TaskboardPage })

export default compose<React.ComponentType>(
    connect(mapStateToProps, {
        getTaskboardData,
        setCurrentStateOfCards,
        changeTaskStatus,
        setCurrentStateOfCardsList,
        setError,
        setHeaderVisibility,
        setCardState,
        expandAllCards,
        collapseAllMaintainerTabs,
        collapseAllMaintainerStatusesByTab,
        changeTaskPriority
    }),
    withRouter
)(TaskboardContainer);
