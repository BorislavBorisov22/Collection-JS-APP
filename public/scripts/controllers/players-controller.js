function getPlayers(filterOptions) {
    return new Promise((resolve, reject) => {
        const url = ((filterOptions) => {
            if (filterOptions) {
                filterOptions = '?jsonParamObject=' +
                    encodeURI(JSON.stringify(filterOptions));
            }
            return ('/api/fut/item' + filterOptions);
        })(filterOptions);

        $.getJSON(url, (data) => {
            const players = data.items;
            resolve(players);
        }).fail(() => {
            reject();
        });
    });
}

function getTemplate(url) {
    return new Promise((resolve, reject) => {
        $.get(url, (data) => {
            const template = Handlebars.compile(data);
            resolve(template);
        }).fail(() => {
            reject();
        });
    });
}