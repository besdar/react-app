import React, { Component } from 'react';
import { BrowserRouter, Route, withRouter } from "react-router-dom";

import { connect, Provider } from "react-redux";
import { compose } from "redux";
// import { initializeApp } from "./redux/reducers/app-reducer";
// import Preloader from "./components/common/Preloader/Preloader";
import store from "./redux/store/redux-store";
import { withSuspense } from "./hoc/withSuspense";
import MainPageContainer from "./Components/common/MainPage/MainPageContentContainer.jsx";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../../assets/primeflex.css';
import '../../assets/globalStyle.css';
// import Test from "./Components/common/Test.jsx";

const ParadocsContainer = React.lazy(() => import('./Components/Paradocs/ParadocsContainer.jsx'));
const BidsContainer = React.lazy(() => import('./Components/Bids/BidsContainer.jsx'));

class App extends Component {

    render() {

        return (
            <React.Fragment>

                <Route exact path='/paradocs'
                    render={withSuspense(ParadocsContainer)} />

                <Route path='/bids'
                    render={withSuspense(BidsContainer)} />

                <Route exact path='/'
                    render={() => <MainPageContainer />} />

                {/* <Route path='/logout' /> */}

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({})

let AppContainer = compose(
    withRouter,
    connect(mapStateToProps, {}))(App);

const BioSphereJSApp = (props) => {
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
// function BioSphereJSApp() {
//     return (
//         <div>
//             <span>123</span>
//             <p>44444343</p>
//         </div>
//     );
// }
// ------------------

export default BioSphereJSApp;