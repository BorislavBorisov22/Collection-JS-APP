import { userController } from 'user-controller';
import { playersController } from 'players-controller';
import { userData } from 'user-data';
import { utils } from 'utils';

const router = new Sammy(function() {

    this.before(utils.toggleUserInfoDisplay);

    this.get('/#', (context) => {
        context.redirect('#/home');
    });

    this.get('#/home', (context) => {
        $('#container').html('HOME PAGE');
    });

    this.get('#/register', (context) => {
        userController.register(context);
    });

    this.get('#/login', (context) => {
        userController.login();
    });

    this.get('#/logout', (context) => {
        userController.logout(context);
    });

    this.get('#/marketplace', (context) => {
        utils.showLoadingAnimation();
        playersController.show(context)
            .then(() => utils.hideLoadingAnimation(500));
    });
});

// keep location after reload
const currentHash = location.hash || '#/home';
router.run(currentHash);