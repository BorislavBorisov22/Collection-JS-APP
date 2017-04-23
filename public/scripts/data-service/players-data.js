import { requester } from 'requester';

function getPlayers(filterOptions) {
    return new Promise((resolve, reject) => {
        const url = ((filterOptions) => {
            if (filterOptions) {
                filterOptions = '?jsonParamObject=' +
                    encodeURI(JSON.stringify(filterOptions));
            } else {
                filterOptions = '';
            }

            return ('/api/fut/item' + filterOptions);
        })(filterOptions);

        requester
            .getJSON(url)
            .then((data) => {
                const players = data.items;
                resolve(players);
            }, () => {
                reject();
            });
    });
}

const playersData = {
    getPlayers
};

export { playersData };