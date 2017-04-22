import { requester } from 'requester';
import { templateLoader } from 'template-loader';


const APP_KEY = 'kid_B1yTg2_Ae';
const APP_SECRET = 'f3f0ad5ad6f24c9e89dc28910d89d624';
const APP_BASE_URL = 'https://baas.kinvey.com';

function getPlayers(filterOptions) {
    return new Promise((resolve, reject) => {
        const url = ((filterOptions) => {
            if (filterOptions) {
                filterOptions = '?jsonParamObject=' +
                    encodeURI(JSON.stringify(filterOptions));
            }
            return ('/api/fut/item' + filterOptions);
        })(filterOptions);

        $.getJSON(url, (data) => {
            const players = data.items;
            resolve(players);
        }).fail(() => {
            reject();
        });
    });
}

function userLogin(user) {
    const headers = {
        Authorization: `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`,
    };

    return requester.postJSON(`${APP_BASE_URL}/user/${APP_KEY}/login`, user, headers);
}

function userLogout(user) {

}

function userRegister(user) {

}

export { userLogin, userLogout, userRegister };