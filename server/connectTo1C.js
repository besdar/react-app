import axios from 'axios';
import CryptoJS from 'crypto-js';
import NodeRSA from 'node-rsa';
import config from './config.js';
import { logger } from './logger.js';

const createRSAKeys = () => {
    const keys = new NodeRSA();
    keys.generateKeyPair();
    return {
        open_key: keys.exportKey('pkcs8-public-pem'),
        secret_key: keys.exportKey('pkcs8-private-pem')
    };
}

const deleteCookie = (req, res) => {
    try {
        axios.delete(config.serverHost + config.databaseLink + '/api/token/' + (req.cookies.sessionKey || 'null'), { token: (req.cookies.token || "null") }, config.bioSphereAuth);
        res.clearCookie('token');
    }
    catch {}
};

const deleteCookieAndSendLoginResponse = (req, res, error) => { deleteCookie(req, res); res.send(error); };
export const logout = (req, res) => { deleteCookie(req, res); res.redirect('/'); }

// Auth middleware
export const checkToken = (req, res) => {
     // получаем ключи шифрования для шифрования данных
    try {
        axios.post(config.serverHost + config.databaseLink + '/api/token/' + (req.cookies.sessionKey || 'null'), { token: (req.cookies.token || req.body.token || "null") }, config.bioSphereAuth).then((response) => {
            const data = response.data;
            let rsa_keys = {};
            if (!req.cookies.secret_key || !req.cookies.open_key || data.secret_updated) {
                rsa_keys = createRSAKeys();
                rsa_keys.secret_key = CryptoJS.AES.encrypt(rsa_keys.secret_key, data.secret_key).toString(); // sessionKey - ключ шифрования с сервера для закрытого ключа шифрования rsa. Для того чтобы хранить зашифрованный закрытый ключ на клиенте безопасно
            }
            else {
                rsa_keys.secret_key = req.cookies.secret_key;
                rsa_keys.open_key = req.cookies.open_key;
            }
            res.cookie('sessionKey', data.sessionKey, {sameSite: true});
            res.cookie('secret_key', rsa_keys.secret_key, {sameSite: true});
            res.cookie('open_key', rsa_keys.open_key, {sameSite: true});
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ valid: data.valid }));
        }).catch((error) => {deleteCookie(req, res); logger('error at request to "' + config.serverHost + config.databaseLink + '/api/token/' + (req.cookies.sessionKey || 'null') + '" of method "' + 'post' + '" for "' + 'checkToken' + '": ' + error.message);});
    } catch (error) {deleteCookie(req, res); logger('error at request to "' + config.serverHost + config.databaseLink + '/api/token/' + (req.cookies.sessionKey || 'null') + '" of method "post" for "checkToken": ' + error.message);}
};

export const checkUserAuthPost = (req, res) => {
    try {
        axios.get(config.serverHost + config.databaseLink + '/api/auth/' + req.cookies.sessionKey, config.bioSphereAuth).then((resp) => {
            const secret = CryptoJS.AES.decrypt(req.body.secret_key, resp.data.secret_key).toString(CryptoJS.enc.Utf8);
            let rsa_decrypt = new NodeRSA();
            rsa_decrypt.importKey(secret, 'pkcs8-private-pem');
            const credentials = rsa_decrypt.decrypt(req.body.credentials, 'json');
            axios.post(config.serverHost + config.databaseLink + '/api/auth/' + req.cookies.sessionKey, {
                login: credentials.username,
                password: credentials.passwd,
                NotTrustedDevice: credentials.NotTrustedDevice
            }, config.bioSphereAuth).then((response) => {
                const dataResp = response.data;
                res.cookie('token', dataResp.token, {sameSite: true});
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ token: dataResp.token, isAuth: (dataResp.errorMessage == '') }));
            }).catch((error) => {deleteCookieAndSendLoginResponse(req, res, error.response.data); logger('error at request to "' + config.serverHost + config.databaseLink + '/api/auth/' + req.cookies.sessionKey + '" of method "post" for "checkUserAuthPost": ' + error.message)});
        }).catch((error) => {deleteCookieAndSendLoginResponse(req, res, err.response.data); logger('error at request to "' + config.serverHost + config.databaseLink + '/api/auth/' + req.cookies.sessionKey + '" of method "get" for "checkUserAuthPost": ' + error.message)});
    } catch (err) {deleteCookieAndSendLoginResponse(req, res, err.data); logger('error at request to "' + config.serverHost + config.databaseLink + '/api/auth/' + req.cookies.sessionKey + '" of method "get" for "checkUserAuthPost": ' + err.message);}
}

export const getGetParadocsMenuFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'GetPanelMenu', {}) }
export const getGetParadocsTextsFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'ParadocsTexts/' + req.body.uid, {}) }
export const getGetBidsListFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'bids', {}) }
export const getGetTasksListFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'tasks', {}) }
export const putSaveParadocsTextFrom1C = (req, res) => { AxiosMethodTo1C('put', req.cookies.token, res, 'ParadocsTexts/' + req.body.uid, { number: req.body.number, text: req.body.text }) }
export const putSaveParadocsTextsFrom1C = (req, res) => { AxiosMethodTo1C('put', req.cookies.token, res, 'ParadocsTexts/' + req.body.uid, req.body.ArrayOfEditors) }
export const pushBidButtonOn1C = (req, res) => { AxiosMethodTo1C('post', req.cookies.token, res, 'bid/' + req.body.number, req.body.BidObject) }
export const getBidDataFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'bid/' + req.body.number, {}) }
export const GetTaskboardDataFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'taskboard', {}) }
export const pushTaskButtonTo1C = (req, res) => { AxiosMethodTo1C('post', req.cookies.token, res, 'task/' + req.body.number, req.body.TaskObject) }
export const getTaskDataFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'task/' + req.body.number, {}) }

const AxiosMethodTo1C = (method, token, res, link1C, dataFor1C) => {
    axios.get(config.serverHost + config.databaseLink + '/api/getUserAuth/' + (token || "null"), config.bioSphereAuth).then((response) => {
        axios.request({
            method: method,
            url: config.serverHost + config.databaseLink + '/api/' + link1C,
            auth: {
                username: response.data.login,
                password: response.data.password
            },
            data: dataFor1C
        }).then((data_response) => {
            res.send(JSON.stringify(data_response.data));
        }).catch((error) => { logger('error at data request to "' + config.serverHost + config.databaseLink + '/api/' + link1C + '" of method "' + method + '" for "' + link1C + '": ' + error.message); res.send(error.response.data) });
    }).catch((error) => { logger('error at check token before data request to "' + config.serverHost + config.databaseLink + '/api/getUserAuth/' + (token || "null") + '" of method "' + method + '" for "' + link1C + '": ' + error.message); deleteCookie(req, res); res.send(error.message) });
}