
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import {config} from './server/config';
import {checkToken, logout, checkUserAuthPost, getBidDataFrom1C, pushButtonOn1C, getGetParadocsMenuFrom1C, getGetParadocsTextsFrom1C, getGetBidsListFrom1C, putSaveParadocsTextFrom1C, putCurrentReplyTo1C, putSaveParadocsTextsFrom1C} from './server/connectTo1C';
// import { logger } from './server/logger';

// Express application
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.use(cookieParser());
app.use('/assets', express.static('assets')); //стили
app.post('/login', checkUserAuthPost);


app.post('/GetParadocsMenu', checkToken, getGetParadocsMenuFrom1C);
app.post('/getParadocsTexts', checkToken, getGetParadocsTextsFrom1C);
app.post('/GetBidsList', checkToken, getGetBidsListFrom1C);
app.post('/SaveCurrentEditor', checkToken, putSaveParadocsTextFrom1C);
app.post('/sendCurrentReply', checkToken, putCurrentReplyTo1C);
app.post('/SaveCurrentEditors', checkToken, putSaveParadocsTextsFrom1C);
app.post('/pushButton', checkToken, pushButtonOn1C);
app.post('/GetBidData', checkToken, getBidDataFrom1C)

app.get('/', checkToken, (req, res) => {res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))});
// ТАК БЫТЬ НЕ ДОЛЖНО НАДО ПЕРЕДЕЛАТЬ (ВДРУГ БУДЕТ 1000 СТРАНИЦ). ЕСЛИ ЭКСПРЕСС.СТАТИК(ДИСТ) ПЕРЕНЕСТИ ВЫШЕ ЭТОЙ СТРОКИ ТО ПРОВЕРКИ РАБОТАТЬ ПЕРЕСТАНУТ
app.get('/paradocs', checkToken, (req, res) => {res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))});
app.get('/bids', checkToken, (req, res) => {res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))});
app.get('/bids/:bidNumber', checkToken, (req, res) => {res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))});
app.get('/logout', (req, res) => {
    // logout(req, res);   
});

app.use(express.static('dist'), (req, res) => {res.status(404).sendFile(path.join(__dirname, '..', 'assets', '404.html'));}); //главная клиентская реакта

// -- Base functionality -- //
app.get('*', function(req, res){ //404 handler
    res.status(404).sendFile(path.join(__dirname, '..', 'assets', '404.html'));
});

// -- Standart Express Functions -- //
app.listen(config.port);

// Right way to shutdown application. Close connections etc.
process.on('SIGINT', () => {process.exit(0)});
