import fs from 'fs';
import path from 'path';
import OS from 'os';

export const logger = (data) => {fs.appendFile(path.join(path.resolve(path.dirname('')), 'server.log'), OS.EOL + new Date() + '||' + data, () => {});}
export const logErrorInformation = (functionName, linkToReq, reqMethod) => {logger('error at check token before data request to "' + config.serverHost + config.databaseLink + '/api/getUserAuth/' + (token || "null") + '" of method "' + method + '" for "' + link1C + '": ' + error.message);}
