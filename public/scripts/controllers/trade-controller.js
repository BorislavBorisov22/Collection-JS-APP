import { userData } from 'user-data';
import { playersData } from 'players-data';
import { squadData } from 'squad-data';
import { notificator } from 'notificator';
import { validator } from 'validator';

const SELL_PRICE_DIVIDER = 2;

const tradeController = {
    purchasePlayer(context) {
        if (!userData.userIsLogged()) {
            notificator.error('You must be logged in in order to make a purchase!');
            return;
        }

        const playerId = context.params.id;

        const playerFilter = {
            id: playerId
        };

        const promises = [userData.userGetInfo(), playersData.getPlayers(playerFilter)];

        Promise.all(promises)
            .then((data) => {
                return new Promise((resolve, reject) => {
                    const userInfo = data[0];
                    const player = data[1].items[0];

                    if (userInfo.purchasedPlayers.some(x => x === player.id)) {
                        reject('You already own this player!');
                    }

                    const playerPrice = playersData.getPlayerPrice(player.rating);

                    if (!validator.canAffordPurchase(userInfo.coins, playerPrice)) {
                        reject("You don't have enough coins to buy this player!");
                    }

                    resolve([userInfo, player, playerPrice]);
                });
            })
            .then(([userInfo, player, playerPrice]) => {
                return new Promise((resolve, reject) => {
                    notificator.sweetAlert(
                        `Are you sure you want to buy ${player.firstName} ${player.lastName} for ${playerPrice} ?`,
                        player.headshotImgUrl,
                        function(isConfirm) {
                            if (isConfirm) {
                                userInfo.coins = Number(userInfo.coins) - playerPrice;
                                userInfo.purchasedPlayers.push(playerId);
                                resolve(userInfo);
                            } else {
                                reject("Purchase has been cancelled");
                            }
                        }
                    );
                });
            })
            .then((userInfo) => {
                userData.userUpdateInfo(userInfo);
            })
            .then(() => {
                notificator.success("Player has been added to your collection!");
            })
            .catch((err) => {
                notificator.error(err);
            });
    },
    sellPlayer(context) {
        if (userData.userIsLogged()) {
            return;
        }

        const playerId = context.params.id;

        const promises = [playersData.getPlayerById(playerId), userData.userGetInfo()];

        Promise.all(promises)
            .then((data) => {
                return new Promise((resolve, reject) => {
                    const player = data[0];
                    const userInfo = data[1];
                    const sellPrice = playersData.getPlayerPrice(player.rating) / SELL_PRICE_DIVIDER;

                    notificator.sweetAlert(
                        `Are you sure you want to sell ${player.firstName} ${player.lastName} for ${sellPrice} ?`,
                        player.headshotImgUrl,
                        function(isConfirm) {
                            if (isConfirm) {
                                const playerIndex = userInfo.purchasedPlayers.findIndex(id => id === player.id);
                                userInfo.purchasedPlayers.splice(playerIndex, 1);

                                userInfo.coins = Number(userInfo.coins) + (sellPrice);
                                resolve([userInfo, player]);
                            } else {
                                reject('Player sell has been cancelled!');
                            }
                        }
                    );
                });
            })
            .then(([userInfo, player]) => {
                const promises = [userData.userUpdateInfo(userInfo), squadData.removePlayer(player)];
                return Promise.all(promises);
            })
            .then(() => {
                notificator.success("Player has been successfully selled!");
            })
            .catch((errorMessage) => {
                notificator.error(errorMessage);
            });
    }
};

export { tradeController };