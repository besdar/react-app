import React, { useLayoutEffect } from 'react';
import LoginPage from "./LoginPage";
import { connect } from "react-redux";
import { AppStateType } from '../../../redux/store/redux-store';
import { getAuthUserDataType, getAuthUserData } from '../../../redux/reducers/auth-reducer';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    getAuthUserData: getAuthUserDataType
}

type PropsType = MapPropsType & DispatchPropsType;

const LoginPageContainer: React.FC<PropsType> = (props) => {

    useLayoutEffect(() => {
        props.getAuthUserData();
        // ошибка что мы передаем не пропсы а пустой массив. Намеренно, чтобы сработало аналогично ComponentDidMount
        // eslint-disable-next-line 
    }, []);

    return <LoginPage {...props} />
}

const mapStateToProps = (state: AppStateType) => ({

});

export default connect(mapStateToProps, { getAuthUserData })(LoginPageContainer);
