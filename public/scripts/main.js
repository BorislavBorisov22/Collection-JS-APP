import { Router } from 'router';

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
router.on('#/marketplace', function() {
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

            $(document.body).append(template({
                players: players
            }));
        });
});

router.run('#/home');