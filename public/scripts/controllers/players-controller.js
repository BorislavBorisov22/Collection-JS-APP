import { requester } from 'requester';
import { templateLoader } from 'template-loader';
import { playersData } from 'players-data';
import { utils } from 'utils';

const BASE_URL = '#/marketplace';
const PAGINATOR_SIZE = 7;
const QUALITY_LIST = ['bronze', 'rare_bronze', 'silver', 'rare_silver', 'gold', 'rare_gold', 'legend'];
const DEFAULT_QUALITY = QUALITY_LIST.slice(0, -1).join(',');
const DEFAULT_FILTER = {
    quality: DEFAULT_QUALITY,
    page: 1
};

const playersController = {
    show(context) {
        // Preserves only own properties
        let filter = JSON.parse(JSON.stringify(context.params));
        filter = $.extend({}, DEFAULT_FILTER, filter);

        utils.showLoadingAnimation();
        Promise
            .all([
                playersData.getPlayers(filter),
                templateLoader.load('players-list')
            ])
            .then((data) => {
                const playersResponse = data[0];
                const template = data[1];

                // Template data
                $('#container').html(template({
                    players: playersResponse.items,
                    currentPage: Number(filter.page),
                    pageCount: playersResponse.totalPages,
                    paginatorSize: PAGINATOR_SIZE,
                    filter: filter,
                    qualityList: QUALITY_LIST.map((x) => {
                        const checked = filter.quality.split(',');
                        return {
                            value: x,
                            name: utils.firstLetterToUpper(x.replace('_', ' ')),
                            checked: checked.some((y) => y === x)
                        };
                    })
                }));

                // Filter UI
                $('#filters').on('change', 'input', (e) => {
                    const $target = $(e.target);

                    let keyToBeChanged;
                    let value;
                    if ($target.is('#filter-name')) {
                        keyToBeChanged = 'name';
                        value = $target.val();
                    }
                    else if ($target.is('#filter-country')) {
                        keyToBeChanged = 'country';
                        value = $target.val();
                    }
                    else if ($target.parents('#filter-quality').length) {
                        keyToBeChanged = 'quality';

                        const selectedQualities = [];
                        $('#filter-quality input').each((i, el) => {
                            if (el.checked) {
                                selectedQualities.push(el.value);
                            }
                        });
                        value = selectedQualities.join(',');
                    }

                    if (value) {
                        filter[keyToBeChanged] = value;
                    } else {
                        delete filter[keyToBeChanged];
                    }

                    filter.page = DEFAULT_FILTER.page;
                    context.redirect(BASE_URL, filter);
                });

                // Pages UI
                $('.pagination').on('click', 'a', (e) => {
                    e.preventDefault();

                    const targertPage = $(e.target).attr('href').slice(1);
                    filter.page = Number(targertPage);
                    context.redirect(BASE_URL, filter);
                });
            })
            .then(() => utils.hideLoadingAnimation(400));
    }
};

export { playersController };