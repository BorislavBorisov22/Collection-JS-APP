import { userData } from 'user-data';
import { playersData } from 'players-data';
import { templateLoader } from 'template-loader';
import { validator } from 'validator';
import { utils } from 'utils';

const $container = $('#container');
const INITIAL_USER_COINS = 10000;

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
                        coins: INITIAL_USER_COINS,
                        purchasedPlayers: []
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
                            toastr.success('Please login to continue', `User ${username} registered successfully`);
                            context.redirect('#/login');
                        })
                        .catch((errorMessage) => {
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
        userData.userLogout()
            .then(() => {
                toastr.success('You have logged out successfully!');
                context.redirect('#/home');
            })
            .catch(() => {
                toastr.error('Please try again in a few moments', 'There was a problem logging out!');
            });
    },
    purchasePlayer(context) {
        if (!userData.userIsLogged()) {
            toastr.error('You must be logged in in order to make a purchase!');
            return;
        }

        const playerId = context.params.id;

        const playerFilter = {
            id: playerId
        };

        const promises = [userData.userGetInfo(), playersData.getPlayers(playerFilter)];

        Promise.all(promises)
            .then((data) => {
                return new Promise((resolve, reject) => {
                    const userInfo = data[0];
                    const player = data[1].items[0];

                    if (userInfo.purchasedPlayers.some(x => x === player.id)) {
                        reject('You already own this player!');
                    }

                    const playerPrice = playersData.getPlayerPrice(player.rating);

                    if (!validator.canAffordPurchase(userInfo.coins, playerPrice)) {
                        reject("You don't have enough coins to buy this player!");
                    }

                    resolve([userInfo, player, playerPrice]);
                });
            })
            .then(([userInfo, player, playerPrice]) => {
                return new Promise((resolve, reject) => {
                    swal({
                            title: `Are you sure you want to buy ${player.firstName} ${player.lastName} for ${playerPrice} ?`,
                            imageUrl: player.headshotImgUrl,
                            showCancelButton: true,
                            confirmButtonClass: "btn-success",
                            cancleButtonClass: "btn-danger",
                            confirmButtonText: "Buy",
                            cancelButtonText: "Cancel",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function(isConfirm) {
                            if (isConfirm) {
                                userInfo.coins = Number(userInfo.coins) - playerPrice;
                                userInfo.purchasedPlayers.push(playerId);
                                resolve(userInfo);
                            } else {
                                reject("Purchase has been cancelled");
                            }
                        });
                });
            })
            .then((userInfo) => {
                const { purchasedPlayers, coins } = userInfo;

                const info = {
                    purchasedPlayers,
                    coins
                };

                userData.userUpdateInfo(info);
            })
            .then(() => {
                toastr.success("Player has been added to your collection!");
            })
            .catch((err) => {
                toastr.error(err);
            });
    }
};

export { userController };