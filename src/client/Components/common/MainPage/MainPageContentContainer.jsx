import React from 'react';
import MainPage from "./MainPage.jsx";
import {connect} from "react-redux";

class MainPageContainer extends React.Component {

    componentDidMount() {
        document.title = "Sketch desk";
    }

    render() {
        return <MainPage {...this.props} />
    }
}
const mapStateToProps = (state) => ({
    
});

export default connect(mapStateToProps, {})(MainPageContainer);