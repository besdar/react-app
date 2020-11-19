import React from 'react';
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";

import { connect, Provider } from "react-redux";
import { compose } from "redux";
import store, { AppStateType } from "./redux/store/redux-store";
import { withSuspense } from "./withSuspense";
import LoginPageContainer from "./Components/common/LoginPage/LoginPageContainer";
import MainPage from "./Components/common/MainPage/MainPage";
import { logout, logoutType } from "./redux/reducers/auth-reducer";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './app.css';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

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
const ReportContainer = React.lazy(() => import('./Components/pages/Reports/ReportContainer'));

// const SuspendedParadocs = withSuspense(ParadocsContainer);
const SuspendedBids = withSuspense(BidsContainer);
const SuspendedTasks = withSuspense(TasksContainer);
const SuspendedBid = withSuspense(BidContainer);
const SuspendedTask = withSuspense(TaskContainer);
const SuspendedTaskboard = withSuspense(TaskboardContainer);
const SuspendedReport = withSuspense(ReportContainer);

//class App extends Component<MapPropsType & DispatchPropsType> 
const App: React.FC<MapPropsType & DispatchPropsType> = (props) => {

    if (!props.isAuth) { return <LoginPageContainer /> }

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path='/'
                        render={() => <MainPage />} />

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

                    <Route path='/reports/:reportName'
                        render={() => <SuspendedReport />} />

                    <Route path='/logout' render={() => { props.logout(); window.location.href = '/'; return <div>bye</div> }} />

                    <Route path='/login'
                        render={() => <LoginPageContainer />} />

                    <Route path='*' render={() => <div>404 NOT FOUND</div>} />
                </Switch>
            </React.Fragment>
        )
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
            <MuiPickersUtilsProvider utils={MomentUtils} locale='ru'>
                <React.StrictMode>
                    <AppContainer />
                </React.StrictMode>
            </MuiPickersUtilsProvider>
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