import { userData } from 'user-data';

class Utils {
    showLoadingAnimation() {
        $(".pre-loader").show();
    }

    hideLoadingAnimation(fadeOutTime) {
        setTimeout(() => {
            $(".pre-loader").fadeOut("slow");
        }, fadeOutTime);
    }

    toggleUserInfoDisplay() {
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

    disableButtonFor(button, time) {
        const $button = $(button);
        $button.addClass('disabled');
        $button.removeClass('active');

        setTimeout(() => {
            $button.removeClass('disabled');
            $button.addClass('active');
        }, time);
    }

    navbarSetActive(name) {
        $('.navbar li').removeClass('active');
        $('#go-to-' + name).addClass('active');
    }

    firstLetterToUpper(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

const utils = new Utils();

export { utils };