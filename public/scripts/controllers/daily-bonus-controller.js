import { userData } from 'user-data';
import { templateLoader } from 'template-loader';

const $container = $('#container');

const bonusController = {
    show(context) {
        templateLoader.load('bonus')
            .then(template => {
                $container.html(template());
            });
    }
};