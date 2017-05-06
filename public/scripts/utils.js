import { userData } from 'user-data';
import { localStorer } from 'local-storer';

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
            $('.visible-when-logged-out').addClass('hidden');
            $('.visible-when-logged').removeClass('hidden');

            $('#username-display')
                .children()
                .first()
                .html(localStorer.getItem('username'));
        } else {
            $('.visible-when-logged-out').removeClass('hidden');
            $('.visible-when-logged').addClass('hidden');
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