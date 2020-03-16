const CryptoJS = require('crypto-js');

const randomString = (stringLenght) => {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < stringLenght; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const encryptToJSON = (jsObject) => {

    return false;
}

const decodeToObject = (chipherString, secret) => {
    let result = {};
    try {
        const bytes = CryptoJS.AES.decrypt(chipherString, secret);
        result = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
        
    }
    return result;
}

export { randomString, decodeToObject }