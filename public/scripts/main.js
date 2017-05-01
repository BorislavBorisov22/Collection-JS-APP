import { userController } from 'user-controller';
import { playersController } from 'players-controller';
import { homeController } from 'home-controller';
import { squadController } from 'squad-controller';
import { userData } from 'user-data';
import { utils } from 'utils';
import { albumController } from 'album-controller';

// keeps it from covering buttons
//toastr.options.positionClass = 'toast-position';

const router = new Sammy(function() {
    this.before(utils.toggleUserInfoDisplay);

    // keep it as '/' because with '/#' it throws an error after login
    this.get('/#', (context) => {
        context.redirect('#/home');
    });

    this.get('#/home', (context) => {
        utils.navbarSetActive('home');
        homeController.check(context);
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

    this.get('#/album', (context) => {
        utils.navbarSetActive('album');
        albumController.show(context);
    });

    this.get('#/marketplace', (context) => {
        utils.navbarSetActive('marketplace');
        playersController.show(context);
    });

    this.get('#/squad/save', (context) => {
        squadController.saveSquad(context);
    });

    this.get('#/players/purchase/:id', (context) => {
        userController.purchasePlayer(context);
    });
}).run('#/home');