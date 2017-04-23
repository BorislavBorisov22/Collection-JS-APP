import { requester } from 'requester';

const APP_KEY = 'kid_B1yTg2_Ae';
const APP_SECRET = 'f3f0ad5ad6f24c9e89dc28910d89d624';
const APP_BASE_URL = 'https://baas.kinvey.com';

const AUTH_TOKEN_STORAGE = 'auth-token';
const USERNAME_STORAGE = 'username';

function userIsLogged() {
    return localStorage.getItem(AUTH_TOKEN_STORAGE) && localStorage.getItem(USERNAME_STORAGE);
}

function userLogin(user) {
    const headers = {
        Authorization: `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`,
    };

    return requester.postJSON(`${APP_BASE_URL}/user/${APP_KEY}/login`, user, headers)
        .then((data) => {
            localStorage.setItem(USERNAME_STORAGE, data.username);
            localStorage.setItem(AUTH_TOKEN_STORAGE, data._kmd.authtoken);
        });
}

function userLogout(user) {

}

function userRegister(user) {
    const headers = {
        Authorization: `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`
    };

    return requester.postJSON(`${APP_BASE_URL}/user/${APP_KEY}`, user, headers);
}

const userData = {
    userLogin,
    userLogout,
    userRegister,
    userIsLogged
};

export { userData };