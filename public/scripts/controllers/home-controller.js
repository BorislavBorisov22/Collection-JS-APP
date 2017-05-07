import { requester } from 'requester';
import { templateLoader } from 'template-loader';
import { shareConfigurator } from 'sharing-configurator';


const $appContainer = $('#container');

const homeController = {
    check(params) {
        const { category } = params;

        $appContainer.html(category);

        templateLoader.load('home')
            .then((template) => {
                $appContainer.html(template());
            });
    }
};

export { homeController };