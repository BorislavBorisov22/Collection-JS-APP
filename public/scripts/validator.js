const USERNAME_MIN_LENGTH = 5;
const USERNAME_MAX_LENGTH = 15;
const USERNAME_MATCH_PATTERN = /^[0-9A-Za-z_]+$/g;

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 20;

class Validator {

    isValidUsername(username) {
        const isValid =
            typeof username === 'string' &&
            username.length >= USERNAME_MIN_LENGTH &&
            username.length <= USERNAME_MAX_LENGTH &&
            username.match(USERNAME_MATCH_PATTERN);

        return isValid;
    }

    isValidPassword(password) {
        const isValid = password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH;

        return isValid;
    }
}

const validator = new Validator();

export { validator };