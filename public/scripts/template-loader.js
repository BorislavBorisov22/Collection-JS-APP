import { requester } from 'requester';

const templateLoader = (() => {
    function load(templateName) {
        return requester.get(`../templates/${templateName}.html`)
            .then(data => {
                const template = Handlebars.compile(data);
                return template;
            });
    }

    return {
        load
    };
})();

export { templateLoader };