import { userData as data } from 'user-data';
import { templateLoader } from 'template-loader';

const $container = $('#container');
const INITIAL_USER_COINS = 100;

const userController = {
    login(params) {
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
                            location.hash = '#/home';
                        })
                        .catch(() => {
                            toastr.error('Invalid user information!');
                            disableButtonFor($('#btn-login'), 5000);
                        });
                });
            });
    },
    register(params) {
        templateLoader.load('register')
            .then((template) => {
                $('#container').html(template());

                $('#register-form').on('submit', function() {
                    const firstName = $('#input-first-name').val(),
                        lastName = $('#input-last-name').val(),
                        username = $('#input-username').val(),
                        password = $('#input-password').val(),
                        passwordRepeat = $('#input-password-repeat').val();

                    if (password !== passwordRepeat) {
                        toastr.error('Passwords must be matching!');
                        return;
                    }

                    const user = {
                        firstName,
                        lastName,
                        username,
                        password,
                        coins: INITIAL_USER_COINS
                    };

                    data.userRegister(user)
                        .then(() => {
                            toastr.success('Please login to continue', `User ${username} registered successfully`);
                            location.hash = '#/login';
                        })
                        .catch(() => {
                            toastr.error('That username might be taken', 'Provided user information is invalid!');
                            disableButtonFor($('$btn-register', 5000));
                        });
                });

                data.userRegister(user)
                    .then(() => {
                        toastr.success('');
                    });
            });
    },
    logout() {
        data.userLogout()
            .then(() => {
                toastr.success('You have logged out successfully!');
                location.hash = '#/home';
            })
            .catch(() => {
                toastr.error('Please try again in a few moments', 'There was a problem logging out!');
            });
    }
};

function disableButtonFor(button, time) {
    const $button = $(button);
    $button.prop('disabled', true);

    setTimeout(() => {
        $button.prop('disabled', false);
    }, time);
}


export { userController };