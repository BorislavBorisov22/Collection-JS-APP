const USERNAME_MIN_LENGTH = 5;
const USERNAME_MAX_LENGTH = 25;
const USERNAME_MATCH_PATTERN = /^[0-9A-Za-z_]+$/g;

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 30;

class Validator {

    isValidUsername(username) {
        const promise = new Promise((resolve, reject) => {
            if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
                reject(`Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} symbols!`);
            }

            if (!username.match(USERNAME_MATCH_PATTERN)) {
                reject('Username can contain only latin letters, digits or underscores!');
            }

            resolve();
        });

        return promise;
    }

    isValidPassword(password) {
        const promise = new Promise((resolve, reject) => {
            if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
                reject(`Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} symbols long!`);
            }

            resolve();
        });

        return promise;
    }

    arePasswordsMatching(firstPass, secondPass) {
        const promise = new Promise((resolve, reject) => {
            if (firstPass !== secondPass) {
                reject("Passwords must be matching!");
            }

            resolve();
        });

        return promise;
    }

    canAffordPurchase(coins, price) {
        const coinsAsNumber = Number(coins);
        const priceAsNumber = Number(price);

        const canAfford = coinsAsNumber >= priceAsNumber;
        return canAfford;
    }
}

const validator = new Validator();

export { validator };