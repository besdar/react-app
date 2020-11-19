
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import config from './server/config.js';
import { checkToken, logout, checkUserAuthPost, getBidDataFrom1C, pushBidButtonOn1C, getReportResultFrom1C, getGetBidsListFrom1C, GetTaskboardDataFrom1C, pushTaskButtonTo1C, getGetTasksListFrom1C, getTaskDataFrom1C } from './server/connectTo1C.js';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync.js';
//import cors from 'cors';
// import { logger } from './server/logger';

// База данных используется, чтобы при первом запуске дать УИД сеанса (раньше это писалось в 1С) 
// и не подключаться к 1С при первом запуске приложения.
// Здесь мы проверим, что наша БД существует и, если нет, то запишем и начально проинициализируем её
global.AuthDataBase = low(new FileSync('auth_db.json'));
AuthDataBase.defaults({ authUids: [] }).write();

// Express application
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
//app.use(cors({origin: config.clientHost + ':' + config.reactPort})); //allow CORS (from react app to node) from same ip // we need to do something with it later
app.use('/assets', express.static(path.join(path.resolve(path.dirname('')), 'src', 'assets'))); //стили

app.post('/login', checkUserAuthPost);
app.post('/checkToken', (req, res, next) => checkToken(req, res, next, true));
app.post('/logout', logout);

// app.post('/GetParadocsMenu', getGetParadocsMenuFrom1C);
// app.post('/getParadocsTexts', getGetParadocsTextsFrom1C);
app.post('/GetBidsList', checkToken, getGetBidsListFrom1C);
app.post('/GetTasksList', checkToken, getGetTasksListFrom1C);
// app.post('/SaveCurrentEditor', putSaveParadocsTextFrom1C);
// app.post('/SaveCurrentEditors', putSaveParadocsTextsFrom1C);
app.post('/pushBidButton', checkToken, pushBidButtonOn1C);
app.post('/GetBidData', checkToken, getBidDataFrom1C);
app.post('/GetTaskboardData', checkToken, GetTaskboardDataFrom1C);
app.post('/pushTaskButton', checkToken, pushTaskButtonTo1C);
app.post('/GetTaskData', checkToken, getTaskDataFrom1C);
app.post('/getReport', checkToken, getReportResultFrom1C);

// ++ продуктив ++ //
const sendIndex = (req, res) => { res.sendFile(path.join(path.resolve(path.dirname('')), 'build', 'index.html')) };
app.get('/', sendIndex);
// ТАК БЫТЬ НЕ ДОЛЖНО НАДО ПЕРЕДЕЛАТЬ (ВДРУГ БУДЕТ 1000 СТРАНИЦ). Но пока так 
// app.get('/paradocs', sendIndex);
app.get('/bids', sendIndex);
app.get('/taskboard', sendIndex);
app.get('/bids/:bidNumber', sendIndex);
app.get('/tasks/:taskNumber', sendIndex);
app.get('/reports/:reportName', sendIndex);
app.get('/login', sendIndex);
app.get('/logout', logout); // только в продуктиве

app.use('/static', express.static('build/static')); // главная клиентская реакта продуктива
app.use('/assets', express.static('build/assets')); // стили глобальные, картинки
// -- продуктив -- //

// -- Standart Express Functions -- //
app.listen(config.nodePort);

// Right way to shutdown application. Close connections etc.
process.on('SIGINT', () => { process.exit(0) });
