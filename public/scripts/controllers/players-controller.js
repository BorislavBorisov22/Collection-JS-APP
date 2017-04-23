import { requester } from 'requester';
import { templateLoader } from 'template-loader';

function getPlayers(filterOptions) {
    return new Promise((resolve, reject) => {
        const url = ((filterOptions) => {
            if (filterOptions) {
                filterOptions = '?jsonParamObject=' +
                    encodeURI(JSON.stringify(filterOptions));
            } else {
                filterOptions = '';
            }
            return ('/api/fut/item' + filterOptions);
        })(filterOptions);

        requester
            .getJSON(url)
            .then((data) => {
                const players = data.items;
                resolve(players);
            }, () => {
                reject();
            });
    });
}

const playersController = {
    show() {
        Promise
            .all([
                getPlayers({
                    page: 1,
                    quality: 'gold,rare_gold'
                }),
                templateLoader.load('player-card')
            ])
            .then((data) => {
                const players = data[0];
                const template = data[1];

                // Fix name differences
                players.forEach((player) => {
                    if (!player.commonName) {
                        player.commonName = player.firstName + ' ' + player.lastName;
                    }
                });

                $('#container').html(template({
                    players: players
                }));
            });
    }
};

export { playersController };