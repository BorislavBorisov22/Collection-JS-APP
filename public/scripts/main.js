import { userController } from 'user-controller';
import { playersController } from 'players-controller';
import { homeController } from 'home-controller';
import { squadController } from 'squad-controller';
import { albumController } from 'album-controller';
import { tradeController } from 'trade-controller';
import { bonusController } from 'bonus-controller';
import { shareConfigurator } from 'sharing-configurator';
import { utils } from 'utils';

const router = new Sammy(function() {
    this.before(utils.toggleUserInfoDisplay);
    this.before(utils.setToastrPos);

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

    this.get('#/squad', (context) => {
        utils.navbarSetActive('squad');
        squadController.show(context);
    });

    this.get('#/squad/add/:playerId/:playerPosition', (context) => {
        squadController.saveToSquad(context);
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
        tradeController.purchasePlayer(context);
    });

    this.get('#/players/sell/:id', (context) => {
        tradeController.sellPlayer(context);
    });

    this.get('#/bonus', (context) => {
        utils.navbarSetActive('daily-bonus');
        bonusController.show(context);
    });
}).run('#/home');