import { userData } from 'user-data';
import { templateLoader } from 'template-loader';
import { notificator } from 'notificator';
import { utils } from 'utils';

const $container = $('#container');

const wheelPrizes = [600, 100, 30, 0, 1800, 420, 750, 250, 3000, 800, 1200, 300];
const duration = 2000;
const cooldown = 500;
let userInfo;

const bonusController = {
    show(context) {
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

            let rotation = 0;
            let lastClickTime = new Date(0);

            let coinsWon;
            $wheel.on('click', function() {
                if (Date.now() - lastClickTime - cooldown < duration) {
                    return;
                }

                rotation += parseInt(Math.random() * 360 + 180);
                lastClickTime = Date.now();

                $(this).css('transform', 'rotate(' + rotation + 'deg)');
                new Promise((resolve) => {
                    setTimeout(resolve, duration);
                }).then(() => {
                    const actualDegrees = Math.abs(rotation) % 360;
                    const sectorSize = 360 / wheelPrizes.length;

                    const prize = wheelPrizes[parseInt(actualDegrees / sectorSize)];
                    coinsWon = prize;

                    userInfo.coins = userInfo.coins + coinsWon;
                    return userData.userUpdateInfo(userInfo);
                }).then(() => {
                    utils.updateOnScreenCoins(userInfo.coins);
                    notificator.success(`You have been granted ${coinsWon} coins!`);
                });
            });
        });
    }
};

export { bonusController };