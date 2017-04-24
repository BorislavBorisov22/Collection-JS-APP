import { requester } from 'requester';
import { templateLoader } from 'template-loader';
import { playersData } from 'players-data';

const playersController = {
    show(context) {
        const page = Number(context.params.page) || 1;

        return Promise
            .all([
                playersData.getPlayers({
                    page: page,
                    quality: 'gold,rare_gold'
                }),
                templateLoader.load('players-list')
            ])
            .then((data) => {
                const playersData = data[0];
                const template = data[1];

                // Fix name differences
                playersData.items.forEach((player) => {
                    if (!player.commonName) {
                        player.commonName = player.firstName + ' ' + player.lastName;
                    }
                });

                $('#container').html(template({
                    players: playersData.items,

                    currentPage: page,
                    pageCount: playersData.totalPages,
                    size: 5
                }));
            });
    }
};

export { playersController };