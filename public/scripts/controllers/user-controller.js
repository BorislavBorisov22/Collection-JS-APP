import { userData as data } from 'user-data';
import { templateLoader } from 'template-loader';
import { validator } from 'validator';
import { utils } from 'utils';

const $container = $('#container');
const INITIAL_USER_COINS = 100;

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

                    data.userLogin(user)
                        .then((data) => {
                            toastr.success(`User ${username} logged successfully!`);
                            context.redirect('#/home');
                        })
                        .catch(() => {
                            toastr.error('Invalid username or password!');
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
                    const firstName = $('#input-first-name').val(),
                        lastName = $('#input-last-name').val(),
                        username = $('#input-username').val(),
                        password = $('#input-password').val(),
                        passwordRepeat = $('#input-password-repeat').val();

                    const user = {
                        firstName,
                        lastName,
                        username,
                        password,
                        coins: INITIAL_USER_COINS
                    };

                    const promises = [
                        data.userRegister(user),
                        validator.isValidUsername(username),
                        validator.arePasswordsMatching(password, passwordRepeat),
                        validator.isValidPassword(password),
                    ];

                    Promise.all(promises)
                        .then(() => {
                            toastr.success('Please login to continue', `User ${username} registered successfully`);
                            context.redirect('#/login');
                        })
                        .catch((errorMessage) => {
                            console.log(errorMessage);
                            if (errorMessage.getResponseHeader) {
                                errorMessage = `User with username ${username} already exists`;
                            }

                            toastr.error(errorMessage);
                            utils.disableButtonFor($('#btn-register'), 5000);
                        });
                });
            });
    },
    logout(context) {
        data.userLogout()
            .then(() => {
                toastr.success('You have logged out successfully!');
                context.redirect('#/home');
            })
            .catch(() => {
                toastr.error('Please try again in a few moments', 'There was a problem logging out!');
            });
    }
};

export { userController };