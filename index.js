
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import config from './server/config.js';
import {checkToken, logout, checkUserAuthPost, getBidDataFrom1C, pushBidButtonOn1C, getGetParadocsMenuFrom1C, getGetParadocsTextsFrom1C, getGetBidsListFrom1C, putSaveParadocsTextFrom1C, putSaveParadocsTextsFrom1C, GetTaskboardDataFrom1C, pushTaskButtonTo1C, getGetTasksListFrom1C, getTaskDataFrom1C} from './server/connectTo1C.js';
//import cors from 'cors';
// import { logger } from './server/logger';

// Express application
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.use(cookieParser());
//app.use(cors({origin: config.clientHost + ':' + config.reactPort})); //allow CORS (from react app to node) from same ip // we need to do something with it later
app.use('/assets', express.static(path.join(path.resolve(path.dirname('')), 'src', 'assets'))); //стили

app.post('/login', checkUserAuthPost);
app.post('/checkToken', checkToken);

app.post('/GetParadocsMenu', getGetParadocsMenuFrom1C);
app.post('/getParadocsTexts', getGetParadocsTextsFrom1C);
app.post('/GetBidsList', getGetBidsListFrom1C);
app.post('/GetTasksList', getGetTasksListFrom1C);
app.post('/SaveCurrentEditor', putSaveParadocsTextFrom1C);
app.post('/SaveCurrentEditors', putSaveParadocsTextsFrom1C);
app.post('/pushBidButton', pushBidButtonOn1C);
app.post('/GetBidData', getBidDataFrom1C);
app.post('/GetTaskboardData', GetTaskboardDataFrom1C);
app.post('/pushTaskButton', pushTaskButtonTo1C);
app.post('/GetTaskData', getTaskDataFrom1C);
app.post('/logout', logout);

// ++ продуктив ++ //
const sendIndex = (req, res) => {res.sendFile(path.join(path.resolve(path.dirname('')), 'build', 'index.html'))};
app.get('/', sendIndex);
// ТАК БЫТЬ НЕ ДОЛЖНО НАДО ПЕРЕДЕЛАТЬ (ВДРУГ БУДЕТ 1000 СТРАНИЦ). Но пока так 
app.get('/paradocs', sendIndex);
app.get('/bids', sendIndex);
app.get('/taskboard', sendIndex);
app.get('/bids/:bidNumber', sendIndex);
app.get('/logout', logout); // только в продуктиве

app.use('/static', express.static('build/static')); // главная клиентская реакта продуктива
app.use('/assets', express.static('build/assets')); // стили глобальные, картинки
// -- продуктив -- //

// -- Standart Express Functions -- //
app.listen(config.nodePort);

// Right way to shutdown application. Close connections etc.
process.on('SIGINT', () => {process.exit(0)});
