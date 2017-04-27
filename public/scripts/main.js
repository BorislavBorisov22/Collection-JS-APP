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
        utils.navbarSetActive('home');
        $('#container').html('HOME PAGE');
    });

    this.get('#/register', (context) => {
        utils.navbarSetActive('register');
        userController.register(context);
    });

    this.get('#/login', (context) => {
        utils.navbarSetActive('login');
        userController.login(context);
    });

    this.get('#/logout', (context) => {
        userController.logout(context);
    });

    this.get('#/marketplace', (context) => {
        utils.navbarSetActive('marketplace');
        playersController.show(context);
    });

    this.get('#/players/purchase/:id', (context) => {
        userController.purchasePlayer(context);
    });
}).run('#/home');