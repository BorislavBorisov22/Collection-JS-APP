import { Router } from 'router';
import { userLogin } from 'login-controller';

function getPlayers(filterOptions) {
    return new Promise((resolve, reject) => {
        const url = ((filterOptions) => {
            if (filterOptions) {
                filterOptions = '?jsonParamObject=' +
                    encodeURI(JSON.stringify(filterOptions));
            }
            return ('/api/fut/item' + filterOptions);
        })(filterOptions);

        $.getJSON(url, (data) => {
            const players = data.items;
            resolve(players);
        }).fail(() => {
            reject();
        });
    });
}

function getTemplate(url) {
    return new Promise((resolve, reject) => {
        $.get(url, (data) => {
            const template = Handlebars.compile(data);
            resolve(template);
        }).fail(() => {
            reject();
        });
    });
}

const router = new Router();

router.on('#/go-to-login', userLogin)
    .on('#/marketplace', function(context) {
        Promise
            .all([
                getPlayers({
                    page: 1,
                    quality: 'gold,rare_gold',
                }),
                getTemplate('/templates/player-card.html')
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
    });

router.run('#/home');