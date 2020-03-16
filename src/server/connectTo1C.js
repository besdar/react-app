import axios from 'axios';
import { decodeToObject } from './crypto';
import {config} from './config';
import path from 'path';
import { logger } from './logger';

const deleteCookie = (req, res) => {
    // logger('delete token');
    // axios.delete(config.httpLine + '/api/token/' + (req.cookies.token || "null"), config.bioSphereAuth);
    res.clearCookie('token');
};
const ForwardToLoginPage = (res) => {res.sendFile(path.join(__dirname, '..', '..', 'assets', 'loginForm.html'))};
const SendLoginResponse = (res, answer) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({logged: answer}));
}
const deleteCookieAndForwardToLoginPage = (req, res) => {deleteCookie(req, res); ForwardToLoginPage(res);};
export const logout = (req, res) => {deleteCookie(req, res); res.redirect('/');}

// Auth middleware
export const checkToken = (req, res, next) => {
    try {  
        axios.get(config.httpLine + '/api/token/' + (req.cookies.token || "null"), config.bioSphereAuth).then((response) => {            
            const data = response.data;
            if (data.valid) {next()} 
            else {
                res.cookie('sessionKey', data.sessionKey); //секрет для шифрования на клиенте
                deleteCookieAndForwardToLoginPage(req, res);
            }
        }).catch((error) => {deleteCookieAndForwardToLoginPage(req, res)});
    } catch (error) {deleteCookieAndForwardToLoginPage(req, res)}
};

export const checkUserAuthPost = (req, res) => {
    const dataAuth = req.body;
    try {
        if (dataAuth.action == 'auth' && dataAuth.charge != '') {
            const secret = req.cookies.sessionKey || '';  // TODO: сделать что-то сложное с получением secret      
            const credentials = decodeToObject(dataAuth.charge, secret);
            axios.post(config.httpLine + '/api/auth/', {
                login: credentials.username,
                password: credentials.passwd,
                NotTrustedDevice: credentials.NotTrustedDevice
            }, config.bioSphereAuth).then((response) => {
                const dataResp = response.data;
                if (dataResp.errorMessage == '') {
                    res.cookie('token', dataResp.token);
                    SendLoginResponse(res, true);
                }
                else {
                    deleteCookie(req, res);
                    SendLoginResponse(res, false);
                }
            }).catch((error) => {
                deleteCookie(req, res);
                SendLoginResponse(res, false);
            });
        }
    } catch (err) {
        deleteCookie(req, res);
        SendLoginResponse(res, false);
    }
}

export const getGetParadocsMenuFrom1C = (req, res) => {AxiosMethodTo1C('get', req.cookies.token, res, 'GetPanelMenu', {})}
export const getGetParadocsTextsFrom1C = (req, res) => {AxiosMethodTo1C('get', req.cookies.token, res, 'ParadocsTexts/' + req.body.uid, {})}
export const getGetBidsListFrom1C = (req, res) => {AxiosMethodTo1C('get', req.cookies.token, res, 'bids', {})}
export const putSaveParadocsTextFrom1C = (req, res) => {AxiosMethodTo1C('put', req.cookies.token, res, 'ParadocsTexts/' + req.body.uid, {number: req.body.number, text: req.body.text})}
export const putCurrentReplyTo1C = (req, res) => {AxiosMethodTo1C('put', req.cookies.token, res, 'bids', {CurrentReplyText: req.body.CurrentReplyText, CurrentReplyId: req.body.CurrentReplyId})}
export const putSaveParadocsTextsFrom1C = (req, res) => {AxiosMethodTo1C('put', req.cookies.token, res, 'ParadocsTexts/' + req.body.uid, req.body.ArrayOfEditors)}
export const pushButtonOn1C = (req, res) => {AxiosMethodTo1C('post', req.cookies.token, res, 'bidButton', req.body.BidObject)}
export const getBidDataFrom1C = (req, res) => {AxiosMethodTo1C('get', req.cookies.token, res, 'bid/' + req.body.number, {})}

const AxiosMethodTo1C = (method, token, res, link1C, dataFor1C) => {
    axios.post(config.httpLine + '/api/getUserAuth', {token: token || "null"}, config.bioSphereAuth).then((response) => {
        axios.request({
            method: method,
            url: config.httpLine + '/api/' + link1C,
            auth: {
                username: response.data.login,
                password: response.data.password
            },
            data: dataFor1C
        }).then((data_response) => {res.send(JSON.stringify(data_response.data));
        }).catch((error) => {logger('error at data request "' + method + '" for "' + link1C + '": ' + error.message); res.sendFile(path.join(__dirname, '..', '..', 'assets', '404.html'))});
    }).catch((error) => {logger('error at check token before data request "' + method + '" for "' + link1C + '": ' + error.message); deleteCookieAndForwardToLoginPage(req, res)});
}