import { requester } from 'requester';
import { localStorer } from 'local-storer';
import { squadData } from 'squad-data';
import { encryptor } from 'encryptor';

const APP_KEY = 'kid_S1wy8b41W';
const APP_SECRET = 'a69edf81880b4454ae540916a7625cd9';
const APP_BASE_URL = 'https://baas.kinvey.com';

const AUTH_TOKEN_STORAGE = 'auth-token';
const USERNAME_STORAGE = 'username';
const USER_ID_STORAGE = 'user-id';

function userIsLogged() {
    return localStorer.getItem(AUTH_TOKEN_STORAGE) !== "" && localStorer.getItem(USERNAME_STORAGE) !== "";
}

function userLogin(user) {
    const headers = {
        Authorization: `Basic ${encryptor.toBase64(APP_KEY + ":" + APP_SECRET)}`,
    };

    user.password = encryptor.SHA1(user.password);

    return requester.postJSON(`${APP_BASE_URL}/user/${APP_KEY}/login`, user, headers)
        .then((data) => {
            localStorer.setItem(USERNAME_STORAGE, data.username);
            localStorer.setItem(AUTH_TOKEN_STORAGE, data._kmd.authtoken);
            localStorer.setItem(USER_ID_STORAGE, data._id);
        });
}

function userLogout() {
    const headers = {
        Authorization: `Kinvey ${localStorer.getItem(AUTH_TOKEN_STORAGE)}`
    };

    return requester.postJSON(`${APP_BASE_URL}/user/${APP_KEY}/_logout`, {}, headers)
        .then(() => {
            localStorer.removeItem(USERNAME_STORAGE);
            localStorer.removeItem(AUTH_TOKEN_STORAGE);
            localStorer.removeItem(USER_ID_STORAGE);
        });
}

function userRegister(user) {
    const headers = {
        Authorization: `Basic ${encryptor.toBase64(APP_KEY + ":" + APP_SECRET)}`
    };

    user.password = encryptor.SHA1(user.password);

    return requester.postJSON(`${APP_BASE_URL}/user/${APP_KEY}`, user, headers)
        .then((data) => {
            localStorer.setItem(USERNAME_STORAGE, data.username);
            localStorer.setItem(AUTH_TOKEN_STORAGE, data._kmd.authtoken);
            localStorer.setItem(USER_ID_STORAGE, data._id);

            squadData.initializeSquad({});
        });
}

function userGetInfo() {
    if (!this.userIsLogged()) {
        return {};
    }

    const headers = {
        Authorization: `Kinvey ${localStorer.getItem(AUTH_TOKEN_STORAGE)}`
    };

    return requester.getJSON(`${APP_BASE_URL}/user/${APP_KEY}/_me`, headers);
}

function userUpdateInfo(info) {
    info = info || {};

    const headers = {
        Authorization: `Kinvey ${localStorer.getItem(AUTH_TOKEN_STORAGE)}`
    };

    return requester.putJSON(`${APP_BASE_URL}/user/${APP_KEY}/${localStorer.getItem(USER_ID_STORAGE)}`, info, headers);
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