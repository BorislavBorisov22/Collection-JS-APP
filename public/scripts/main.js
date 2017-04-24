import { userController } from 'user-controller';
import { playersController } from 'players-controller';
import { userData } from 'user-data';
import { utils } from 'utils';

const router = new Sammy(function() {

    this.before(utils.toggleUserInfoDisplay);

    this.get('/#', (context) => {
        context.redirect('#/home');
    });

    this.get('#/home', function() {
        $('#container').html('HOME PAGE');
    });

    this.get('#/register', () => {
        userController.register();
    });

    this.get('#/login', () => {
        userController.login();
    });

    this.get('#/logout', () => {
        userController.logout();
    });

    this.get('#/marketplace', (context) => {
        utils.showLoadingAnimation();
        playersController.show(context)
            .then(() => utils.hideLoadingAnimation(300));
    });
});

// keep location after reload
const currentHash = location.hash || '#/home';
router.run(currentHash);