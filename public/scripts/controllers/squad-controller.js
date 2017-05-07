import { squadData } from 'squad-data';
import { notificator } from 'notificator';
import { templateLoader } from 'template-loader';
import { userData } from 'user-data';
import { playersData } from 'players-data';
import { utils } from 'utils';

const $container = $('#container');

const squadController = {
    show() {
        if (!userData.userIsLogged()) {
            return;
        }

        utils.showLoadingAnimation();

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
                utils.hideLoadingAnimation(600);
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
    saveToSquad(context) {
        let { playerId, playerPosition } = context.params;
        playerPosition = playerPosition.split('-').join('');

        playersData.getPlayerById(playerId)
            .then((player) => {
                const playerInfo = {
                    id: player.id,
                    img: player.headshotImgUrl,
                    name: player.name
                };

                return squadData.saveToSquad(playerPosition, playerInfo);
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