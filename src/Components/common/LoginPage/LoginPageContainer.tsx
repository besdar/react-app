import React from 'react';
import LoginPage from "./LoginPage";
import {connect} from "react-redux";
import {AppStateType} from '../../../redux/store/redux-store';
import { getAuthUserDataType, getAuthUserData } from '../../../redux/reducers/auth-reducer';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    getAuthUserData: getAuthUserDataType
}

type PropsType = MapPropsType & DispatchPropsType;

class LoginPageContainer extends React.Component<PropsType> {

    componentDidMount() {
        document.title = "Sketchdesk";
        this.props.getAuthUserData();
    }

    render() {
        return <LoginPage {...this.props} />
    }
}

const mapStateToProps = (state: AppStateType) => ({
    
});

export default connect(mapStateToProps, {getAuthUserData})(LoginPageContainer);
