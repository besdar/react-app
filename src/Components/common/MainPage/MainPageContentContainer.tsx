import React from 'react';
import MainPage from "./MainPage";
import {connect} from "react-redux";
import {AppStateType} from '../../../redux/store/redux-store';

class MainPageContainer extends React.Component {

    componentDidMount() {
        document.title = "Sketch desk";
    }

    render() {
        return <MainPage {...this.props} />
    }
}
const mapStateToProps = (state: AppStateType) => ({
    
});

export default connect(mapStateToProps, {})(MainPageContainer);