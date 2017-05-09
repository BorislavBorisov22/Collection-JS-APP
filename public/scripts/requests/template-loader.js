import { requester } from 'requester';

class TemplateLoader {
    constructor() {
        this.templatesCache = {};
    }

    load(templateName) {
        const self = this;

        if (self.templatesCache[templateName]) {
            return Promise.resolve(self.templatesCache[templateName]);
        }

        return requester.get(`../templates/${templateName}.handlebars`)
            .then(data => {
                const template = Handlebars.compile(data);
                self.templatesCache[templateName] = template;
                return template;
            });
    }
}

const templateLoader = new TemplateLoader();

export { templateLoader };