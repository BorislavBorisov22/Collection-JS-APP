import { userData } from 'user-data';
import { playersData } from 'players-data';
import { squadData } from 'squad-data';
import { templateLoader } from 'template-loader';
import { utils } from 'utils';

const $container = $('#container');

const albumController = {
    show() {
        utils.showLoadingAnimation();

        const promises = [templateLoader.load('album'), squadData.getSquad(), userData.userGetInfo()];
        let template;
        let squad;
        Promise.all(promises)
            .then(data => {
                template = data[0];
                squad = data[1];
                const playersIds = data[2].purchasedPlayers;

                return playersIds;
            })
            .then((playersIds) => {
                if (playersIds.length) {
                    const filterOptions = {
                        id: playersIds.join(",")
                    };

                    return playersData.getPlayers(filterOptions);
                } else {
                    return [];
                }
            })
            .then((playersData) => {
                const players = playersData.items;

                const templateData = {
                    ownedPlayers: players,
                    squad: squad
                };

                $container.html(template(templateData));

                $('.player-card.album-card .headshot-img').draggable({
                    containment: '#container',
                    cursor: 'move',
                    helper: 'clone',
                    scroll: 'false',
                    appendTo: '#container'
                });

                $('.player-shirt').droppable({
                    accept: '.player-card.album-card .headshot-img',
                    tolerance: 'pointer',
                    drop: function(event, ui) {

                        const $draggable = $(ui.draggable);
                        let playerName = $draggable.attr('data-player-name');

                        if (playerName.indexOf(' ') >= 0) {
                            playerName = playerName.split(' ')[1];
                        }

                        $(this).find('.shirt-name').html(playerName);
                    },
                });
            })
            .then(() => {
                utils.hideLoadingAnimation();
            })
            .then(() => {
                toastr.warning('Drag footballers images on any position you desire', 'Build your dream squad!', { timeOut: 10000111111 });
            });
    }
};

export { albumController };