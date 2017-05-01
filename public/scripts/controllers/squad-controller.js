import { squadData } from 'squad-data';

const MIN_PLAYERS_TO_SAVE = 11;

const squadController = {
    saveSquad(context) {
        const squad = this.collectPlayerNames();
        if (Object.keys(squad).length !== MIN_PLAYERS_TO_SAVE) {
            toastr.error('Squad must have 11 players!');
            return;
        }

        squadData.saveSquad(squad)
            .then(() => {
                toastr.success('Squad saved successfully!');
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

export { squadController };