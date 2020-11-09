import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";

import { connect, Provider } from "react-redux";
import { compose } from "redux";
import store, { AppStateType } from "./redux/store/redux-store";
import { withSuspense } from "./hoc/withSuspense";
import LoginPageContainer from "./Components/common/LoginPage/LoginPageContainer";
import MainPageContainer from "./Components/common/MainPage/MainPageContentContainer";
import { logout, logoutType } from "./redux/reducers/auth-reducer";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './app.css';

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    logout: logoutType
}

// const ParadocsContainer = React.lazy(() => import('./Components/pages/Paradocs/ParadocsContainer'));
const BidsContainer = React.lazy(() => import('./Components/pages/Bids/BidsContainer'));
const TasksContainer = React.lazy(() => import('./Components/pages/Tasks/TasksContainer'));
const BidContainer = React.lazy(() => import('./Components/pages/Bid/BidContainer'));
const TaskContainer = React.lazy(() => import('./Components/pages/Task/TaskContainer'));
const TaskboardContainer = React.lazy(() => import('./Components/pages/TaskBoard/TaskboardContainer'));

// const SuspendedParadocs = withSuspense(ParadocsContainer);
const SuspendedBids = withSuspense(BidsContainer);
const SuspendedTasks = withSuspense(TasksContainer);
const SuspendedBid = withSuspense(BidContainer);
const SuspendedTask = withSuspense(TaskContainer);
const SuspendedTaskboard = withSuspense(TaskboardContainer);

class App extends Component<MapPropsType & DispatchPropsType> {

    render() {
        if (!this.props.isAuth) { return <LoginPageContainer /> }

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path='/'
                        render={() => <MainPageContainer />} />

                    {/* <Route exact path='/paradocs'
                        render={() => <SuspendedParadocs />} /> */}

                    <Route path='/bids/:bidNumber'
                        render={() => <SuspendedBid />} />

                    <Route exact path='/bids'
                        render={() => <SuspendedBids />} />

                    <Route exact path='/tasks'
                        render={() => <SuspendedTasks />} />

                    <Route path='/tasks/:taskNumber'
                        render={() => <SuspendedTask />} />

                    <Route exact path='/taskboard'
                        render={() => <SuspendedTaskboard />} />

                    <Route path='/logout' render={() => { this.props.logout(); return <div>bye</div> }} />

                    <Route path='/login'
                        render={() => <LoginPageContainer />} />

                    <Route path='*' render={() => <div>404 NOT FOUND</div>} />
                </Switch>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state: AppStateType) => ({
    isAuth: state.AuthReducer.isAuth
})

const AppContainer = compose<React.ComponentType>(
    withRouter,
    connect(mapStateToProps, { logout }))(App);

const BioSphereJSApp: React.FC = () => {
    return <BrowserRouter >
        <Provider store={store}>
            <AppContainer />
        </Provider>
    </BrowserRouter>
}

// const AppTest = () => {
//     return (
//         <div>
//             <div><p>Welcome to 1C</p></div>
//             {/* <Route path='/bind/:id'
//                            render={ () => <BindFormContainer /> }/>               */}
//             <div><NavLink to={'/logout'}></NavLink></div>
//         </div>
//     );
// }

// --------------------
// function BioSphereJSApp() {return <span>test</span>;}
// ------------------

export default BioSphereJSApp;