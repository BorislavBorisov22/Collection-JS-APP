import { squadData } from 'squad-data';
import { notificator } from 'notificator';
import { templateLoader } from 'template-loader';
import { userData } from 'user-data';
import { playersData } from 'players-data';

const $container = $('#container');

const squadController = {
    show() {
        const promises = [templateLoader.load('squad'), squadData.getSquad()];
        Promise.all(promises)
            .then(data => {
                const template = data[0];
                const squad = data[1];

                $container.html(template(squad));
                $('.squad-player-card').on('click', function() {
                    const $this = $(this);

                    showFullSquad($this.attr('data-player-position'));
                });

            })
            .then(() => {
                notificator.warning('Click on any position you want to add or change player', 'Build your dream squad!', 10000111111);
            });

        templateLoader.load('squad')
            .then(template => {
                $container.html(template());

                $('.squad-player-card').on('click', function() {
                    const $this = $(this);
                    showFullSquad($this.attr('data-player-position'));
                });
            });
    },
    saveSquad(context) {
        //#/squad/add/:playerId/:playerPosition
        let { playerId, playerPosition } = context.params;
        playerPosition = playerPosition.split('-').join('');

        playersData.getPlayerById(playerId)
            .then((player) => {
                const playerInfo = {
                    img: player.headshotImgUrl,
                    name: player.name
                };

                return squadData.saveSquad(playerPosition, playerInfo);
            })
            .then(() => {
                context.redirect('#/squad');
            });
    },
};

function showFullSquad(position) {
    const promises = [templateLoader.load('add-to-squad'), userData.userGetInfo()];

    let template;
    Promise.all(promises)
        .then(data => {
            return new Promise((resolve, reject) => {
                template = data[0];
                const playersIds = data[1].purchasedPlayers;

                const filterOptions = {
                    id: playersIds.join(', ')
                };

                if (playersIds.length) {
                    resolve(playersData.getPlayers(filterOptions));
                } else {
                    reject('You do not have any players to add!');
                }
            });
        })
        .then(playersData => {
            const templateData = {
                addPosition: position,
                players: playersData.items
            };

            $container.append(template(templateData));
            $('#squad-container').addClass('blurred');
            $('#add-to-squad-container').niceScroll();
        })
        .catch((err) => {
            notificator.error(err);
        });
}

export { squadController };