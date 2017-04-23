Handlebars.registerHelper('pagination', (currentPage, totalPages, size, options) => {
    size = size % 2 === 0 ? size + 1 : size;
    
    const middle = Math.floor(size / 2);
    let startPage = currentPage - middle;
    let endPage = currentPage + middle;

    if (startPage <= 0) {
        endPage -= (startPage - 1);
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

    const pagesList = [];
    for (var i = startPage; i <= endPage; i++) {
        pagesList.push(i === currentPage ? i.toString() : i)
    }

    let leftArrow = !(startPage === 1);
    if (leftArrow) {
        leftArrow = currentPage - size;
        if (leftArrow < 1) {
            leftArrow = 1;
        }
    }
    let rightArrow = !(endPage === totalPages);
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

    const context = {
        leftArrow,
        rightArrow,
        pages
    };

    return options.fn(context);
});