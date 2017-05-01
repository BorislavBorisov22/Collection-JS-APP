import { requester } from 'requester';
import { localStorer } from 'local-storer';

const BASE_URL = 'https://baas.kinvey.com';
const APP_KEY = 'kid_S1wy8b41W';
const AUTH_TOKEN_STORAGE = 'auth-token';
const USERNAME_STORAGE = 'username';

const squadData = {
    getSquad(userId) {
        const headers = {
            Authorization: `Kinvey ${localStorer.getItem(AUTH_TOKEN_STORAGE)}`
        };

        return requester.getJSON(`${BASE_URL}/appdata/${APP_KEY}/squads/${localStorer.getItem(USERNAME_STORAGE)}`, headers)
            .then(data => data.squad);
    },
    saveSquad(squad) {
        const headers = {
            Authorization: `Kinvey ${localStorer.getItem(AUTH_TOKEN_STORAGE)}`
        };

        const body = {
            squad: squad,
        };

        return requester.putJSON(`${BASE_URL}/appdata/${APP_KEY}/squads/${localStorer.getItem(USERNAME_STORAGE)}`, body, headers)
    }
};

export { squadData };