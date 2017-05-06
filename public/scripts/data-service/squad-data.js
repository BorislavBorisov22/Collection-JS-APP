import { requester } from 'requester';
import { localStorer } from 'local-storer';

const BASE_URL = 'https://baas.kinvey.com';
const APP_KEY = 'kid_S1wy8b41W';
const AUTH_TOKEN_STORAGE = 'auth-token';
const USERNAME_STORAGE = 'username';

const squadData = {
    getSquad() {
        const headers = {
            Authorization: `Kinvey ${localStorer.getItem(AUTH_TOKEN_STORAGE)}`
        };

        return requester.getJSON(`${BASE_URL}/appdata/${APP_KEY}/squads/${localStorer.getItem(USERNAME_STORAGE)}`, headers)
            .then(data => data.squad);
    },
    saveSquad(playerPosition, playerInfo) {
        const headers = {
            Authorization: `Kinvey ${localStorer.getItem(AUTH_TOKEN_STORAGE)}`
        };

        return this.getSquad()
            .then(squad => {
                squad[playerPosition] = playerInfo;

                const body = {
                    squad: squad
                };

                return requester.putJSON(`${BASE_URL}/appdata/${APP_KEY}/squads/${localStorer.getItem(USERNAME_STORAGE)}`, body, headers);
            });
    },
    initializeSquad() {
        const headers = {
            Authorization: `Kinvey ${localStorer.getItem(AUTH_TOKEN_STORAGE)}`
        };

        const body = {
            squad: {}
        };

        return requester.putJSON(`${BASE_URL}/appdata/${APP_KEY}/squads/${localStorer.getItem(USERNAME_STORAGE)}`, body, headers);
    },
    removePlayer(player) {
        this.getSquad()
            .then(squad => {
                return new Promise((resolve, reject) => {
                        const positions = Object.keys(squad);

                        const playerName = this.getPlayerCommonName(player);

                        const positionsToRemove = positions.filter(prop => squad[prop] === playerName);

                        if (positionsToRemove.length) {
                            positionsToRemove.forEach(prop => squad[prop] = '');
                            resolve(squad);
                        } else {
                            reject(`${player.firstName} is not present in this squad`);
                        }
                    })
                    .then((squad) => {
                        this.saveSquad(squad);
                    });
            });
    },
    getPlayerCommonName(player) {
        let name = player.name;

        if (name.indexOf(' ') < 0) {
            return name;
        }

        name = name.split(' ')[1];
        return name;
    }
};

export { squadData };