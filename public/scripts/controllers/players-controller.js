import { requester } from 'requester';
import { templateLoader } from 'template-loader';
import { playersData } from 'players-data';

const playersController = {
    show() {
        Promise
            .all([
                playersData.getPlayers({
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