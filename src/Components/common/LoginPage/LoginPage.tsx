import React from 'react';
import { connect } from "react-redux";
import { login, formType, setFormData, loginType, setFormDataType, emptyCaptchaStatus, emptyCaptchaStatusType } from "../../../redux/reducers/auth-reducer";
import { AppStateType } from '../../../redux/store/redux-store';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
// import { withRouter } from "react-router-dom";
// import { compose } from "redux";
import "./LoginPage.css";
import Loader from '../Loader/Loader';

type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    login: loginType,
    setFormData: setFormDataType,
    emptyCaptchaStatus: emptyCaptchaStatusType,
    formData: formType,
    message: string
}

type PropsType = MapPropsType & DispatchPropsType;

const LoginForm: React.FC<PropsType> = (props) => {
    if (props.showLoad) { return <Loader nameOfProcess="проверяем авторизацию" /> }

    return <div style={{ height: window.innerHeight }} className="login_container">
        <div className="p-fluid login_form" onKeyPress={(event) => {if (event.key === 'Enter') props.login()}}>
            <h1>Projector</h1>
            <div className="p-field">
                <InputText required type="text" placeholder="Логин" value={props.formData.username} onChange={(e) => props.setFormData("username", e.currentTarget.value)} />
            </div>
            <div className="p-field">
                <InputText required type="password" className={(!props.message ? '' : 'shake-horisontal')} placeholder="Пароль" value={props.formData.passwd} onChange={(e) => {e.currentTarget.classList.remove('shake-horisontal'); props.setFormData("passwd", e.currentTarget.value)}} />
                <small id="error">{props.message}</small>
            </div>
            <div className="p-field-checkbox">
                <Checkbox inputId="notTrustedDevice" checked={props.formData.NotTrustedDevice} value={props.formData.NotTrustedDevice} onChange={(e) => {props.setFormData("NotTrustedDevice", e.target.checked)}} />
                <label htmlFor="notTrustedDevice">Чужой компьютер</label>
            </div>
            <Button type="submit" id="submitForm" label="Войти" onClick={props.login} />
        </div>
    </div>
}

const mapStateToProps = (state: AppStateType) => ({
    isAuth: state.AuthReducer.isAuth,
    formData: state.AuthReducer.formData,
    message: state.AuthReducer.message,
    authCount: state.AuthReducer.authCount,
    showLoad: state.AuthReducer.showLoad
})

export default connect(mapStateToProps, { login, setFormData, emptyCaptchaStatus })(LoginForm);