import { requester } from 'requester';
import { templateLoader } from 'template-loader';
import { shareConfigurator } from 'sharing-configurator';
import { utils } from 'utils';

const $appContainer = $('#container');

const homeController = {
    show(params) {

        return templateLoader.load('home')
            .then((template) => {
                $appContainer.html(template());
                utils.toggleUserInfoDisplay();
            });
    }
};

export { homeController };