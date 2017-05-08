import { requester } from 'requester';
import { localStorer } from 'local-storer';

const BASE_URL = 'https://baas.kinvey.com';
const APP_KEY = 'kid_S1wy8b41W';
const APP_SECRET = 'a69edf81880b4454ae540916a7625cd9';
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
    saveToSquad(playerPosition, playerInfo) {
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
    saveAll(squad) {
        const headers = {
            Authorization: `Kinvey ${localStorer.getItem(AUTH_TOKEN_STORAGE)}`
        };

        const body = {
            squad
        };

        return requester.putJSON(`${BASE_URL}/appdata/${APP_KEY}/squads/${localStorer.getItem(USERNAME_STORAGE)}`, body, headers);
    },
    initializeSquad() {
        return this.saveAll({});
    },
    removePlayer(player) {
        return this.getSquad()
            .then(squad => {
                return new Promise((resolve, reject) => {
                        const positions = Object.keys(squad);

                        const positionsToRemove = positions.filter(prop => {
                            return squad[prop].id === player.id;
                        });


                        positionsToRemove.forEach(prop => {
                            delete squad[prop];
                        });

                        resolve(squad);

                    })
                    .then((squad) => {
                        this.saveAll(squad);
                    });
            });
    },
};

export { squadData };