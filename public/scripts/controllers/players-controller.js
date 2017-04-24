import { requester } from 'requester';
import { templateLoader } from 'template-loader';
import { playersData } from 'players-data';

const PAGINATOR_SIZE = 7;
const DEFAUL_FILTER = {
    quality: 'silver,rare_silver,gold,rare_gold',
    page: 1
};

const playersController = {
    show(context) {
        let filter;
        if (context.params.filter) {
            filter = JSON.parse(context.params.filter);
        } else {
            filter = $.extend({}, DEFAUL_FILTER);
        }

        return Promise
            .all([
                playersData.getPlayers(filter),
                templateLoader.load('players-list')
            ])
            .then((data) => {
                const playersData = data[0];
                const template = data[1];

                $('#container').html(template({
                    players: playersData.items,
                    currentPage: Number(filter.page),
                    pageCount: playersData.totalPages,
                    size: PAGINATOR_SIZE
                }));

                $('.pagination').on('click', 'a', (e) => {
                    e.preventDefault();

                    const targertPage = $(e.target).attr('href').slice(1);
                    filter.page = Number(targertPage);
                    context.redirect('#/marketplace', {
                        filter: JSON.stringify(filter)
                    });
                });
            });
    }
};

export { playersController };