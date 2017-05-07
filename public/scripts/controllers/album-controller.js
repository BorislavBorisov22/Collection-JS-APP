import { userData } from 'user-data';
import { playersData } from 'players-data';
import { squadData } from 'squad-data';
import { templateLoader } from 'template-loader';
import { utils } from 'utils';
import { notificator } from 'notificator';

const $container = $('#container');

const albumController = {
    show() {
        if (!userData.userIsLogged()) {
            return;
        }

        utils.showLoadingAnimation();
        const promises = [templateLoader.load('album'), userData.userGetInfo()];

        let template;
        Promise.all(promises)
            .then((data) => {
                template = data[0];
                const playersIds = data[1].purchasedPlayers;

                const filterOptions = {
                    id: playersIds.join(',')
                };

                if (playersIds.length === 0) {
                    return [];
                } else {
                    return playersData.getPlayers(filterOptions);
                }
            })
            .then(playersData => {
                console.log(playersData.items);
                $container.html(template(playersData.items));
            })
            .then(() => utils.hideLoadingAnimation());
    }
};

export { albumController };