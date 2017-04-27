import { requester } from 'requester';

const APP_KEY = 'kid_rk1gva0Al';
const APP_SECRET = '8cf9f89958854f34a6948d7afffd6942';
const APP_BASE_URL = 'https://baas.kinvey.com';

const AUTH_TOKEN_STORAGE = 'auth-token';
const USERNAME_STORAGE = 'username';
const USER_ID_STORAGE = 'user-id';

function userIsLogged() {
    return localStorage.getItem(AUTH_TOKEN_STORAGE) && localStorage.getItem(USERNAME_STORAGE);
}

function userLogin(user) {
    const headers = {
        Authorization: `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`,
    };

    user.password = CryptoJS.SHA1(user.password).toString();

    return requester.postJSON(`${APP_BASE_URL}/user/${APP_KEY}/login`, user, headers)
        .then((data) => {
            localStorage.setItem(USERNAME_STORAGE, data.username);
            localStorage.setItem(AUTH_TOKEN_STORAGE, data._kmd.authtoken);
            localStorage.setItem(USER_ID_STORAGE, data._id);
        });
}

function userLogout() {
    const headers = {
        Authorization: `Kinvey ${localStorage.getItem(AUTH_TOKEN_STORAGE)}`
    };

    return requester.postJSON(`${APP_BASE_URL}/user/${APP_KEY}/_logout`, {}, headers)
        .then(() => {
            localStorage.removeItem(USERNAME_STORAGE);
            localStorage.removeItem(AUTH_TOKEN_STORAGE);
            localStorage.removeItem(USER_ID_STORAGE);
        });
}

function userRegister(user) {
    const headers = {
        Authorization: `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`
    };

    user.password = CryptoJS.SHA1(user.password).toString();

    return requester.postJSON(`${APP_BASE_URL}/user/${APP_KEY}`, user, headers);
}

function userGetInfo() {
    const headers = {
        Authorization: `Kinvey ${localStorage.getItem(AUTH_TOKEN_STORAGE)}`
    };

    return requester.getJSON(`${APP_BASE_URL}/user/${APP_KEY}/${localStorage.getItem(USER_ID_STORAGE)}`, headers);
}

function userUpdateInfo(info) {
    info = info || {};

    const headers = {
        Authorization: `Kinvey ${localStorage.getItem(AUTH_TOKEN_STORAGE)}`
    };

    return requester.putJSON(`${APP_BASE_URL}/user/${APP_KEY}/${localStorage.getItem(USER_ID_STORAGE)}`, info, headers);
}

const userData = {
    userLogin,
    userLogout,
    userRegister,
    userIsLogged,
    userGetInfo,
    userUpdateInfo
};

export { userData };