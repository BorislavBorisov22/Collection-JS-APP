import { userData } from 'user-data';
import { templateLoader } from 'template-loader';
import { notificator } from 'notificator';
import { utils } from 'utils';

const $container = $('#container');

const SPIN_PRICE = 700;
const wheelPrizes = [600, 100, 30, 0, 1800, 420, 750, 250, 3000, 800, 1200, 300];
const duration = 2000;
const cooldown = 500;

let userInfo;
let lastClickTime;
let rotation;

const bonusController = {
    show(context) {
        utils.showLoadingAnimation();
        Promise.all([
                templateLoader.load('bonus'),
                userData.userGetInfo()
            ]).then(([template, userResponse]) => {
                userInfo = userResponse;

                $container.html(template({
                    user: userInfo
                }));

                const $wheel = $('#wheel');
                $wheel.css('transition', 'all ' + duration + 'ms ease-in-out');

                rotation = 0;
                lastClickTime = new Date(0);

                $('#btn-paid-bonus').on('click', this.runPaidSpin);
                $('#btn-free-bonus').on('click', this.runFreeSpin);
            })
            .then(() => {
                utils.hideLoadingAnimation(500);
            });
    },
    _spinWheel() {
        rotation += parseInt(Math.random() * 360 + 180);
        lastClickTime = Date.now();

        $('#wheel').css('transform', 'rotate(' + rotation + 'deg)');
        const promise = new Promise((resolve) => {
            setTimeout(resolve, duration);
        }).then(() => {
            const actualDegrees = Math.abs(rotation) % 360;
            const sectorSize = 360 / wheelPrizes.length;

            const prize = wheelPrizes[parseInt(actualDegrees / sectorSize)];
            return prize;
        });

        return promise;
    },
    runFreeSpin() {
        if (Date.now() - lastClickTime - cooldown < duration) {
            return;
        }

        let userInfo;
        let coinsWon;
        userData.userGetInfo()
            .then(userResponse => {
                return new Promise((resolve, reject) => {
                        userInfo = userResponse;

                        const lastFreeSpinDate = new Date(userInfo._acl.freeSpinData);
                        const now = new Date();

                        const areInSameDay = lastFreeSpinDate.getDate() == now.getDate() &&
                            lastFreeSpinDate.getFullYear() == now.getFullYear() &&
                            lastFreeSpinDate.getDay() == now.getDay();

                        if (areInSameDay) {
                            reject("You have used your daily free spin! Please come again tomorrow");
                        }

                        userInfo._acl.freeSpinData = new Date();
                        resolve();
                    })
                    .then(() => {
                        return bonusController._spinWheel();
                    })
                    .then(prize => {
                        coinsWon = prize;
                        userInfo.coins += coinsWon;
                        return userData.userUpdateInfo(userInfo);
                    })
                    .then(() => {
                        utils.updateOnScreenCoins(userInfo.coins);
                        notificator.success('You can visit us tomorrow again', `You have won ${coinsWon} coins for the Day`);
                    })
                    .catch((errMessage) => {
                        notificator.error(errMessage);
                    });
            });
    },
    runPaidSpin() {
        if (Date.now() - lastClickTime - cooldown < duration) {
            return;
        }

        let userInfo;
        let coinsWon;
        userData.userGetInfo()
            .then(userData => {
                userInfo = userData;
                return new Promise((resolve, reject) => {
                    if (userInfo.coins < SPIN_PRICE) {
                        reject('You do not have enough coins for a spin!');
                    }

                    userInfo.coins -= SPIN_PRICE;
                    resolve();
                });
            })
            .then(() => {
                return bonusController._spinWheel();
            })
            .then(prize => {
                coinsWon = prize;
                userInfo.coins += coinsWon;

                if (userInfo.coins < 0) {
                    userInfo.coins = 0;
                }

                return userData.userUpdateInfo(userInfo);
            })
            .then(() => {
                utils.updateOnScreenCoins(userInfo.coins);
                notificator.success(`You have been granted ${coinsWon} coins!`);
            })
            .catch((errMessage) => {
                notificator.error(errMessage);
            });
    }
};

export { bonusController };