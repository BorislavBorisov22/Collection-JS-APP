import { homeController } from 'home-controller';
import { templateLoader } from 'template-loader';
import { utils } from 'utils';

describe('* HomeController tests', () => {
    describe('show tests', () => {
        let template;

        beforeEach(() => {
            template = sinon.spy();
            sinon.stub(templateLoader, 'load')
                .returns(Promise.resolve(template));
            sinon.stub($.fn, 'html');
            sinon.stub(utils, 'toggleUserInfoDisplay');
        });

        afterEach(() => {
            templateLoader.load.restore();
            utils.toggleUserInfoDisplay.restore();
            $.fn.html.restore();
        });

        it('expect home controller to be a function', () => {
            const result = homeController.check;
            expect(result).to.be.a('function');
        });


        it('expect to call templateLoader once', (done) => {
            homeController.check()
                .then(() => {
                    expect(templateLoader.load).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call templateLoader load with correct name for the home page template', (done) => {
            homeController.show()
                .then(() => {
                    expect(templateLoader.load).to.have.been.calledWith('home');
                })
                .then(done, done);
        });

        it('expect to call jquery html function once when temlate is gotten successfully', (done) => {
            homeController.show()
                .then(() => {
                    expect($.fn.html).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to execute the recieved template when template is loaded successfully', (done) => {
            homeController.show()
                .then(() => {
                    expect(template).to.have.been.calledOnce;
                })
                .then(done, done);
        });


        it('expect to call utils toggleUserInfoDisplay when template is loaded successfully', (done) => {
            homeController.show()
                .then(() => {
                    expect(utils).to.have.been.calleOnce;
                })
                .then(done, done);
        });
    });
});
