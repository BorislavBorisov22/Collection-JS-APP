$.getJSON('/api/fut/item', (data) => {
    data.items.forEach((item) => {
        console.log(item);
    });
});