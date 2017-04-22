import * as data from 'data';
import { templateLoader } from 'template-loader';

const $container = $('#container');

function userLogin() {
    templateLoader.load('login')
        .then((template) => {
            $container.html(template());

            $('#btn-login').on('click', function() {
                const username = $('#input-username').val();
                const password = $('#input-password').val();

                const user = {
                    username,
                    password
                };

                data.userLogin(user)
                    .then((data) => {
                        toastr.success(`User ${username} logged successfully!`);
                        location.hash = '#/marketplace';
                    })
                    .catch(() => toastr.error('Invalid user information!'));
            });
        });
}

export { userLogin };