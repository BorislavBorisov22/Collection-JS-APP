import { requester } from 'requester';

const templatesCache = {};

const templateLoader = (() => {
    function load(templateName) {
        if (templatesCache[templateName]) {
            return Promise.resolve(templatesCache[templateName]);
        }

        return requester.get(`../templates/${templateName}.html`)
            .then(data => {
                const template = Handlebars.compile(data);
                templatesCache[templateName] = template;
                return template;
            });
    }

    return {
        load
    };
})();

export { templateLoader };