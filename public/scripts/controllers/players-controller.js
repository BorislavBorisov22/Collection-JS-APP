import { requester } from 'requester';
import { templateLoader } from 'template-loader';
import { playersData } from 'players-data';

const BASE_URL = '#/marketplace';
const PAGINATOR_SIZE = 7;
const DEFAUL_FILTER = {
    quality: 'silver,rare_silver,gold,rare_gold',
    page: 1
};

const playersController = {
    show(context) {
        // Preserves only own properties
        let filter = JSON.parse(JSON.stringify(context.params));
        if ($.isEmptyObject(filter)) {
            filter = JSON.parse(JSON.stringify(DEFAUL_FILTER));
        }

        return Promise
            .all([
                playersData.getPlayers(filter),
                templateLoader.load('players-list')
            ])
            .then((data) => {
                const playersResponse = data[0];
                const template = data[1];

                $('#container').html(template({
                    players: playersResponse.items,
                    currentPage: Number(filter.page),
                    pageCount: playersResponse.totalPages,
                    paginatorSize: PAGINATOR_SIZE,
                    filter: filter
                }));

                $('#filters').on('change', 'input', (e) => {
                    const $target = $(e.target);
                    const value = $target.val();

                    let keyToBeChanged;
                    if ($target.is('#filter-name')) {
                        keyToBeChanged = 'name';
                    }
                    else if ($target.is('#filter-country')) {
                        keyToBeChanged = 'country';
                    }

                    if (value) {
                        filter[keyToBeChanged] = value;
                    } else {
                        delete filter[keyToBeChanged];
                    }

                    context.redirect(BASE_URL, filter);
                });

                $('.pagination').on('click', 'a', (e) => {
                    e.preventDefault();

                    const targertPage = $(e.target).attr('href').slice(1);
                    filter.page = Number(targertPage);
                    context.redirect(BASE_URL, filter);
                });
            });
    }
};

export { playersController };