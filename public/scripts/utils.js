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
}

const utils = new Utils();

export { utils };