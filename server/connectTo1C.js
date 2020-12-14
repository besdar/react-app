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
    const currentDay = (new Date()).getDate();
    try {
        global.AuthDataBase.get('authUids').filter((elem) => (elem.dateValid >= currentDay)).write(); // чистка БД
        // почему-то у axios перестал работать метод 01122020. нет времени разобраться почему
        // axios.delete(config.serverHost + config.databaseLink + '/api/token/' + (req.cookies.sessionKey || 'null'), { token: (req.cookies.token || "null") }, config.bioSphereAuth);
        res.clearCookie('token');
    }
    catch { }
};

const deleteCookieAndSendLoginResponse = (req, res, error) => { deleteCookie(req, res); res.send(error.message); };
export const logout = (req, res) => { deleteCookie(req, res); res.redirect('/'); }

// Auth middleware
export const checkToken = (req, res, next, isLoginCheck = false) => {
    // получаем ключи шифрования для шифрования данных
    try {
        axios.post(config.serverHost + config.databaseLink + '/api/token/' + (req.cookies.sessionKey || 'null'), { token: (req.cookies.token || req.body.token || "null") }, config.bioSphereAuth).then((response) => {
            const data = response.data;
            
            if (isLoginCheck === true) { // если это проверка токена для какой-то сервисной операции, то не нужно перегенеривать шифрование, мы сделаем это потом
                let rsa_keys = {};

                const authArray = global.AuthDataBase.get('authUids');
                let KeysData = authArray.value().find((elem) => req.cookies.sessionKey === elem.sessionKey);
                let sessionKey = '';
                let AES_secret_key = '';
                if (KeysData === undefined || !data.valid) {
                    AES_secret_key = Math.random().toString(36).substr(2, 9);
                    sessionKey = Math.random().toString(36).substr(2, 9);
                    authArray.push({ sessionKey: sessionKey, AES_secret_key: AES_secret_key, dateValid: (new Date()).getDay() + 1 }).write();
                } else {
                    AES_secret_key = KeysData.AES_secret_key;
                    sessionKey = KeysData.sessionKey;
                }

                if (!req.cookies.secret_key || !req.cookies.open_key || !data.valid) { // если токен вышел из строя, то надо обновлять шифрование
                    rsa_keys = createRSAKeys();
                    rsa_keys.secret_key = CryptoJS.AES.encrypt(rsa_keys.secret_key, AES_secret_key).toString(); // sessionKey - ключ шифрования с сервера для закрытого ключа шифрования rsa. Для того чтобы хранить зашифрованный закрытый ключ на клиенте безопасно
                } else {
                    rsa_keys.secret_key = req.cookies.secret_key;
                    rsa_keys.open_key = req.cookies.open_key;
                }

                res.cookie('sessionKey', sessionKey, { sameSite: true });
                res.cookie('secret_key', rsa_keys.secret_key, { sameSite: true });
                res.cookie('open_key', rsa_keys.open_key, { sameSite: true });
                res.setHeader('Content-Type', 'application/json');
            }
            
            if (isLoginCheck === true) {
                res.send(JSON.stringify({ valid: data.valid }));
            } else {
                if (!data.valid) {
                    res.send("Истек срок действия авторизации. Необходимо авторизоваться.");
                    //res.redirect('/login');
                } else {
                    next();
                }
            }
        }).catch((error) => { deleteCookie(req, res); logger('api error at request to "' + config.serverHost + config.databaseLink + '/api/token/' + (req.cookies.sessionKey || 'null') + '" of method "' + 'post' + '" for "' + 'checkToken' + '": ' + error.message); });
    } catch (error) { deleteCookie(req, res); logger('error at request to "' + config.serverHost + config.databaseLink + '/api/token/' + (req.cookies.sessionKey || 'null') + '" of method "post" for "checkToken": ' + error.message); }
};

export const checkUserAuthPost = (req, res) => {
    try {
        const authArray = global.AuthDataBase.get('authUids').value();
        const secret = CryptoJS.AES.decrypt(req.body.secret_key, authArray.find((elem) => req.cookies.sessionKey === elem.sessionKey).AES_secret_key).toString(CryptoJS.enc.Utf8);
        let rsa_decrypt = new NodeRSA();
        rsa_decrypt.importKey(secret, 'pkcs8-private-pem');
        const credentials = rsa_decrypt.decrypt(req.body.credentials, 'json');
        axios.post(config.serverHost + config.databaseLink + '/api/auth/' + req.cookies.sessionKey, {
            login: credentials.username,
            password: credentials.passwd,
            NotTrustedDevice: credentials.NotTrustedDevice
        }, config.bioSphereAuth).then((response) => {
            const dataResp = response.data;
            res.cookie('token', dataResp.token, { sameSite: true });
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ token: dataResp.token, isAuth: (dataResp.errorMessage == '') }));
        }).catch((error) => { deleteCookieAndSendLoginResponse(req, res, error); logger('error at request to "' + config.serverHost + config.databaseLink + '/api/auth/' + req.cookies.sessionKey + '" of method "post" for "checkUserAuthPost": ' + error.message) });
    } catch (err) { deleteCookieAndSendLoginResponse(req, res, err); logger('error at request to "' + config.serverHost + config.databaseLink + '/api/auth/' + req.cookies.sessionKey + '" of method "get" for "checkUserAuthPost": ' + err.message); }
}

export const getGetParadocsMenuFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'GetPanelMenu', {}) }
export const getGetParadocsTextsFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'ParadocsTexts/' + req.body.uid, {}) }
export const getGetBidsListFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'bids', {}) }
export const getGetTasksListFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'tasks', {}) }
export const putSaveParadocsTextFrom1C = (req, res) => { AxiosMethodTo1C('put', req.cookies.token, res, 'ParadocsTexts/' + req.body.uid, { editor: req.body.editor }) }
export const putSaveParadocsTextsFrom1C = (req, res) => { AxiosMethodTo1C('put', req.cookies.token, res, 'ParadocsTexts/' + req.body.uid, req.body.ArrayOfEditors) }
export const pushBidButtonOn1C = (req, res) => { AxiosMethodTo1C('post', req.cookies.token, res, 'bid/' + req.body.number, req.body.BidObject) }
export const getBidDataFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'bid/' + req.body.number, {}) }
export const GetTaskboardDataFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'taskboard', {}) }
export const getNotesDataFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'notes', {}) }
export const PushNoteStatusOn1C = (req, res) => { AxiosMethodTo1C('post', req.cookies.token, res, 'note/000', req.body.NoteObject) }
export const getNoteDataFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'note/' + req.body.number, {}) }
export const saveNoteDataIn1C = (req, res) => { AxiosMethodTo1C('post', req.cookies.token, res, 'note/000', req.body.note) }
export const pushTaskButtonTo1C = (req, res) => { AxiosMethodTo1C('post', req.cookies.token, res, 'task/' + req.body.number, req.body.TaskObject) }
export const getTaskDataFrom1C = (req, res) => { AxiosMethodTo1C('get', req.cookies.token, res, 'task/' + req.body.number, {}) }
export const getReportResultFrom1C = (req, res) => { AxiosMethodTo1C('post', req.cookies.token, res, 'report', req.body.reportState) }

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
    }).catch((error) => { logger('error at check token before data request to "' + config.serverHost + config.databaseLink + '/api/getUserAuth/' + (token || "null") + '" of method "' + method + '" for "' + link1C + '": ' + error.message); res.send(error.message) });
}

export const getSomeDataListFrom1C = (req, res) => { AxiosMethodTo1C('post', req.cookies.token, res, 'getData', req.body.dataReqObject) }