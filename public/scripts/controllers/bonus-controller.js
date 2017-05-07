import { userData } from 'user-data';
import { templateLoader } from 'template-loader';
import { notificator } from 'notificator';

const $container = $('#container');

const bonusController = {
    show(context) {
        const wheelPrizes = [600, 100, 30, 0, 1800, 420, 750, 250, 3000, 800, 1200, 300];
        const duration = 2000;
        const cooldown = 500;

        templateLoader.load('bonus')
            .then((template) => {
                $container.html(template());

                const $wheel = $('#wheel');
                $wheel.css('transition', 'all ' + duration + 'ms ease-in-out');

                let rotation = 0;
                let previousRotation = 0;
                let lastClickTime = new Date(0);

                let coinsWon;
                $wheel.on('click', function() {
                    if (Date.now() - lastClickTime - cooldown < duration) {
                        return;
                    }

                    previousRotation = rotation;
                    rotation += parseInt(Math.random() * 360 + 180);
                    lastClickTime = Date.now();

                    $(this).css({
                        'transform': 'rotate(' + rotation + 'deg)',
                        'transition-duration': duration + 'ms'
                    });
                    new Promise((resolve) => {
                            setTimeout(resolve, duration);
                        }).then(() => {
                            const actualDegrees = Math.abs(rotation) % 360;
                            const sectors = 360 / wheelPrizes.length;

                            const prize = wheelPrizes[actualDegrees / sectors | 0];
                            coinsWon = prize;

                            return userData.userGetInfo();
                        })
                        .then(userInfo => {
                            userInfo.coins = userInfo.coins + coinsWon;
                            return userData.userUpdateInfo(userInfo);
                        })
                        .then(() => {
                            notificator.success(`You have been granted ${coinsWon} coins!`);
                        });
                });
            });
    }
};

export { bonusController };