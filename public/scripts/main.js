import { Router } from 'router';
import { userController } from 'user-controller';
import { playersController } from 'players-controller';
import { userData } from 'data';

const router = new Router();

router.on('#/login', userController.login)
    .on('#/register', userController.register)
    .on('#/home', (context) => {
        // callback is temporary here for a test -> must be in a seperate module/class
        $('#container').html('HOME PAGE');

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
    })
    .on('#/marketplace', playersController.show);

router.run('#/home');