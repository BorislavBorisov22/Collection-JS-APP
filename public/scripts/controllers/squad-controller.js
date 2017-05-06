import { squadData } from 'squad-data';
import { notificator } from 'notificator';
import { templateLoader } from 'template-loader';
import { userData } from 'user-data';
import { playersData } from 'players-data';

const MIN_PLAYERS_TO_SAVE = 11;
const $container = $('#container');

const squadController = {
    show() {
        templateLoader.load('squad')
            .then(template => {
                $container.html(template());

                $('.squad-player-card').on('click', function() {
                    showFullSquad();
                });
            });
    },
    saveSquad(context) {
        const squad = this.collectPlayerNames();
        if (Object.keys(squad).length !== MIN_PLAYERS_TO_SAVE) {
            notificator.error('Squad must have 11 players!');
            return;
        }

        squadData.saveSquad(squad)
            .then(() => {
                notificator.success('Squad saved successfully!');
                context.redirect('#/squad');
            });
    },
    collectPlayerNames() {
        const playerShirts = [].slice.apply($('.player-shirt'));

        const squad = {};

        playerShirts.forEach((ps) => {
            const $playerShirt = $(ps);

            const playerPosition = $playerShirt.attr('id').split('-').join('');
            const playerName = $playerShirt.find('.shirt-name').html().trim();

            squad[playerPosition] = playerName;
        });

        return squad;
    }
};

function showFullSquad() {
    const promises = [templateLoader.load('add-to-squad'), userData.userGetInfo()];

    $('#squad-container').addClass('blurred');

    let template;
    Promise.all(promises)
        .then(data => {
            template = data[0];
            const playersIds = data[1].purchasedPlayers;

            const filterOptions = {
                id: playersIds.join(', ')
            };

            return playersData.getPlayers(filterOptions);
        })
        .then(playersData => {
            $container.append(template(playersData.items));
        });
}

export { squadController };