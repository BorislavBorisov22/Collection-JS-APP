import { requester } from 'requester';

const PLAYER_PRICE_MULTIPLIER = 100;

const playersData = {
    getPlayers(filterOptions) {
        return new Promise((resolve, reject) => {
            const url = ((filterOptions) => {
                if (filterOptions) {
                    filterOptions = '?jsonParamObject=' +
                        JSON.stringify(filterOptions);
                } else {
                    filterOptions = '';
                }

                return ('/api/fut/item' + filterOptions);
            })(filterOptions);

            requester
                .getJSON(url)
                .then((data) => {
                    data.items.forEach(p => p.price = p.rating * PLAYER_PRICE_MULTIPLIER);

                    resolve(data);
                }, () => {
                    reject();
                });
        });
    }
};

export { playersData };