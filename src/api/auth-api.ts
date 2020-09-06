import axios from "axios";

type encryptedCredentialsType = {
    credentials: string,
    secret_key: string
}

// в этом файле мы обращаемся с клиента на сервер (ноду)
// выглядит как будто мы делаем пост (всегда пост) запрос к самим себе (на свой же домен)
export const AuthAPI = {
    login(encryptedCredentials: encryptedCredentialsType): Promise<string | {token: string}> {return axios.post('/login', {credentials: encryptedCredentials.credentials, secret_key: encryptedCredentials.secret_key}).then(res => res.data).catch((error) => (error.message))},
    async checkToken(token: string): Promise<{valid: boolean} | string> {try {
        const res = await axios.post('/checkToken', { token: token });
        return res.data;
    }
    catch (error) {
        return error.message;
    }},
    logout() {axios.post('/logout')}
}