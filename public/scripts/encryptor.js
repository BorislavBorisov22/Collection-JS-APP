class Encyptor {
    SHA1(message) {
        return CryptoJS.SHA1(message).toString();
    }

    toBase64(message) {
        return btoa(message);
    }
}

const encryptor = new Encyptor();

export { encryptor };