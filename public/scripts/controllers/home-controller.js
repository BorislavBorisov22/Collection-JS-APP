import { requester } from 'requester';
import { templateLoader } from 'template-loader';
import { shareConfigurator } from 'sharing-configurator';
import { utils } from 'utils';

const $appContainer = $('#container');

const homeController = {
    check(params) {
        const { category } = params;

        $appContainer.html(category);

        templateLoader.load('home')
            .then((template) => {
                $appContainer.html(template());
                utils.toggleUserInfoDisplay();
                utils.navbarSetColor('inverse');
            });
    }
};

export { homeController };