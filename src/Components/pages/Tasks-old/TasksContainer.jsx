import React from "react";
import Tasks from "./Tasks";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import {
  getTasksList,
  setCurrentState
} from "../../redux/reducers/tasks-reducer-old";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { withSuspense } from "../../../hoc/withSuspense";

const TaskContainer = React.lazy(() => import("./Task/TaskContainer"));

class TasksContainer extends React.Component {
  componentDidMount() {
    document.title = "Задачи";
    this.props.getTasksList();
  }

  render() {
    return (
      <Switch>
        <Route path="/tasks/:taskNumber" render={withSuspense(TaskContainer)} />
        <Route
          exact
          path="/tasks"
          render={() => (
            <Tasks
              tasksList={this.props.tasksList}
              setCurrentState={this.props.setCurrentState}
            />
          )}
        />
      </Switch>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    tasksList: state.TasksPage.tasksList
  };
};

export default compose(
  connect(mapStateToProps, { setCurrentState, getTasksList }),
  withRouter
)(TasksContainer);
