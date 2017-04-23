import { userController } from 'user-controller';
import { playersController } from 'players-controller';
import { userData } from 'user-data';

const router = new Sammy(function() {

    this.before(function() {
        toggleUserInfoDisplay();
    });

    this.get('/#', function(context) {
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

    this.get('#/marketplace', () => {
        playersController.show();
    });
});

function toggleUserInfoDisplay() {
    if (userData.userIsLogged()) {
        $('#go-to-login').addClass('hidden');
        $('#go-to-register').addClass('hidden');

        $('#username-display').removeClass('hidden').children().first().html(localStorage.getItem('username'));
        $('#btn-logout').removeClass('hidden');
    } else {
        $('#go-to-login').removeClass('hidden');
        $('#go-to-register').removeClass('hidden');

        $('#username-display').addClass('hidden');
        $('#btn-logout').addClass('hidden');
    }
}

// keep location after reload
const currentHash = location.hash || '#/home';
router.run(currentHash);