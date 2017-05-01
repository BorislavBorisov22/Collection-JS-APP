import { userData } from 'user-data';
import { playersData } from 'players-data';
import { templateLoader } from 'template-loader';
import { validator } from 'validator';
import { utils } from 'utils';
import { notificator } from 'notificator';

const $container = $('#container');
const INITIAL_USER_COINS = 60000;

const userController = {
    login(context) {
        templateLoader.load('login')
            .then((template) => {
                $container.html(template());

                $('#login-form').on('submit', function() {
                    const $this = $(this);

                    const username = $('#input-username').val();
                    const password = $('#input-password').val();

                    const user = {
                        username,
                        password
                    };

                    userData.userLogin(user)
                        .then((data) => {
                            notificator.success(`User ${username} logged successfully!`);
                            context.redirect('#/home');
                        })
                        .catch(() => {
                            notificator.error('Invalid username or password!');
                            utils.disableButtonFor($('#btn-login'), 5000);
                        });
                });
            });
    },
    register(context) {
        templateLoader.load('register')
            .then((template) => {
                $('#container').html(template());

                $('#register-form').on('submit', function() {
                    const username = $('#input-username').val(),
                        password = $('#input-password').val(),
                        passwordRepeat = $('#input-password-repeat').val();

                    const user = {
                        username,
                        password,
                        coins: INITIAL_USER_COINS,
                        purchasedPlayers: [],
                        squad: {}
                    };

                    const promises = [
                        validator.isValidUsername(username),
                        validator.arePasswordsMatching(password, passwordRepeat),
                        validator.isValidPassword(password),
                    ];

                    Promise.all(promises)
                        .then(() => {
                            return userData.userRegister(user);
                        })
                        .then(() => {
                            notificator.success('', `User ${username} registered successfully`);
                            context.redirect('#/home');
                        })
                        .catch((errorMessage) => {
                            if (errorMessage.getResponseHeader) {
                                errorMessage = `User with username ${username} already exists`;
                            }

                            notificator.error(errorMessage);
                            utils.disableButtonFor($('#btn-register'), 5000);
                        });
                });
            });
    },
    logout(context) {
        userData.userLogout()
            .then(() => {
                notificator.success('You have logged out successfully!');
                context.redirect('#/home');
            })
            .catch(() => {
                notificator.error('Please try again in a few moments', 'There was a problem logging out!');
            });
    }
};

export { userController };