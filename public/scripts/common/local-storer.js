class LocalStorer {
    getItem(itemName) {
        const documentCookie = document.cookie;

        const startIndexCookie = documentCookie.indexOf(itemName);
        if (startIndexCookie < 0) {
            return "";
        }

        let endIndexCookie = documentCookie.indexOf(';', startIndexCookie);
        endIndexCookie = endIndexCookie >= 0 ? endIndexCookie : documentCookie.length + 1;

        const cookie = documentCookie.substring(startIndexCookie, endIndexCookie);
        const itemValue = cookie.split(`${itemName}=`)[1];

        return itemValue;
    }

    setItem(itemName, itemValue) {
        document.cookie = `${itemName}=${itemValue}; expires=Thu, 18 Dec 2020 12:00:00 UTC; path=/;`;
    }

    removeItem(itemName) {
        document.cookie = `${itemName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

const localStorer = new LocalStorer();

export { localStorer };