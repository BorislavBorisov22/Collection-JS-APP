Handlebars.registerHelper('pagination', (currentPage, totalPages, size, options) => {
    size = size % 2 === 0 ? size + 1 : size;

    const middle = Math.floor(size / 2);
    let startPage = currentPage - middle;
    let endPage = currentPage + middle;

    if (startPage <= 0) {
        endPage = size;
        startPage = 1;
    }

    if (endPage > totalPages) {
        endPage = totalPages;
        if (endPage - size + 1 > 0) {
            startPage = endPage - size + 1;
        } else {
            startPage = 1;
        }
    }

    let leftArrow = startPage !== 1;
    if (leftArrow) {
        leftArrow = currentPage - size;
        if (leftArrow < 1) {
            leftArrow = 1;
        }
    }

    let rightArrow = endPage !== totalPages;
    if (rightArrow) {
        rightArrow = currentPage + size;
        if (rightArrow > totalPages) {
            rightArrow = totalPages;
        }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i += 1) {
        pages.push({
            page: i,
            isCurrent: i === currentPage,
        });
    }

    const leftMiddle = Math.ceil(startPage / 2);
    const rightMiddle = Math.ceil(endPage + (totalPages - endPage) / 2);
    const context = {
        leftArrow,
        rightArrow,
        totalPages,
        leftMiddle,
        rightMiddle,
        pages
    };

    return options.fn(context);
});