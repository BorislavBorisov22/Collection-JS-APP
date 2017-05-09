import { userController } from 'user-controller';
import { templateLoader } from 'template-loader';
import { userData } from 'user-data';
import { notificator } from 'notificator';
import { utils } from 'utils';
import { validator } from 'validator';

describe('* UserController tests', () => {
    describe('Login tests', () => {

        let templateSpy;
        beforeEach(() => {
            templateSpy = sinon.spy();
            sinon.stub(templateLoader, 'load')
                .returns(Promise.resolve(templateSpy));

            sinon.stub(userController, 'submitLogin');
            sinon.stub(userData, 'userIsLogged');

            sinon.stub($.fn, 'html');
            sinon.stub($.fn, 'on');
        });

        afterEach(() => {
            templateLoader.load.restore();
            userController.submitLogin.restore();
            userData.userIsLogged.restore();
            $.fn.html.restore();
            $.fn.on.restore();
        });

        it('expect not to call template loader when user is logged', () => {
            userData.userIsLogged.returns(true);

            const returnedvalue = userController.login();
            expect(returnedvalue).to.be.an('undefined');
            expect(templateLoader.load).to.not.have.been.called;
        });

        it('expect to call templateLoader.load once when user is not logged', (done) => {
            userData.userIsLogged.returns(false);

            userController.login()
                .then(() => {
                    expect(templateLoader.load).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call templateLoader.load with the correct name of the login template', (done) => {
            userData.userIsLogged.returns(false);

            userController.login()
                .then(() => {
                    expect(templateLoader.load).to.have.been.calledWith('login');
                })
                .then(done, done);
        });

        it('expect to call the resolved template function', (done) => {
            userData.userIsLogged.returns(false);

            userController.login()
                .then(() => {
                    expect(templateSpy).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call jQuery html function once', (done) => {
            userData.userIsLogged.returns(false);

            userController.login()
                .then(() => {
                    expect($.fn.html).to.be.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call jQuery html function with the result of the template function exectution', (done) => {
            userData.userIsLogged.returns(false);

            userController.login()
                .then(() => {
                    expect($.fn.html.firstCall.args[0]).to.deep.equal(templateSpy());
                })
                .then(done, done);
        });

        it('expect to call jQuery on function with submit as first parameter', (done) => {
            userData.userIsLogged.returns(false);

            userController.login()
                .then(() => {
                    expect($.fn.on).to.be.calledWith('submit');
                })
                .then(done, done);
        });

        it('expect to call jQuery on function once', (done) => {
            userData.userIsLogged.returns(false);

            userController.login()
                .then(() => {
                    expect($.fn.on).to.be.calledOnce;
                })
                .then(done, done);
        });
    });

    describe('submitLogin tests', () => {
        const username = "someUsername";
        const password = "somePassword";

        const context = {
            redirect: () => {}
        };

        beforeEach(() => {
            sinon.stub($.fn, 'val');
            $.fn.val.onCall(0).returns(username);
            $.fn.val.onCall(1).returns(password);

            sinon.stub(userData, 'userLogin');
            sinon.stub(context, 'redirect');

            sinon.stub(notificator, 'success');
            sinon.stub(notificator, 'error');
            sinon.stub(utils, 'disableButtonFor');
        });

        afterEach(() => {
            userData.userLogin.restore();
            $.fn.val.restore();
            notificator.success.restore();
            notificator.error.restore();
            utils.disableButtonFor.restore();
            context.redirect.restore();
        });

        it('expect to call userData.userLogin once', (done) => {
            userData.userLogin.returns(Promise.resolve()
                .then(() => {
                    expect(userData.userLogin).to.have.been.calledOnce;
                })
                .then(done, done));

            userController.submitLogin(context);
        });

        it('expect to call userData.userLogin with valid user object', (done) => {
            const expectedUser = {
                username,
                password
            };

            userData.userLogin.returns(Promise.resolve()
                .then(() => {
                    expect(userData.userLogin.firstCall.args[0]).to.deep.equal(expectedUser);
                })
                .then(done, done));

            userController.submitLogin(context);
        });

        it('expect to call notificator.success with valid message when userLogin promise is resolve', (done) => {
            const expectedMessage = `User ${username} logged successfully!`;
            userData.userLogin.returns(Promise.resolve());

            userController.submitLogin(context)
                .then(() => {
                    expect(notificator.success).to.have.been.been.calledWith(expectedMessage);
                })
                .then(done, done);
        });

        it('expect to call notificator success once whe userLogin promise is resolved', (done) => {
            userData.userLogin.returns(Promise.resolve());

            userController.submitLogin(context)
                .then(() => {
                    expect(notificator.success).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('exepct to call context.redirect with correct route whe userLogin promise is resolved', (done) => {
            userData.userLogin.returns(Promise.resolve());

            userController.submitLogin(context)
                .then(() => {
                    expect(context.redirect).to.have.been.calledWith('#/home');
                })
                .then(done, done);
        });

        it('exepct to call context.redirect with once when userLogin promise is resolved', (done) => {
            userData.userLogin.returns(Promise.resolve());

            userController.submitLogin(context)
                .then(() => {
                    expect(context.redirect).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call notificator.error with a correct arror message when userLoginPromise is rejected', (done) => {
            userData.userLogin.returns(Promise.reject());

            const expectedMessage = 'Invalid username or password!';

            userController.submitLogin(context)
                .then(() => {
                    expect(notificator.error).to.have.been.calledWith(expectedMessage);
                })
                .then(done, done);
        });

        it('expect to call notificator.error with once when userLoginPromise is rejected', (done) => {
            userData.userLogin.returns(Promise.reject());

            userController.submitLogin(context)
                .then(() => {
                    expect(notificator.error).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call utils.disableButtonFor once when userLogin promise is rejected', (done) => {
            userData.userLogin.returns(Promise.reject());

            userController.submitLogin(context)
                .then(() => {
                    expect(utils.disableButtonFor).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call utils.disableButtonFor a correct amount of time', (done) => {
            userData.userLogin.returns(Promise.reject());

            const expectedTime = 5000;

            userController.submitLogin(context)
                .then(() => {
                    expect(utils.disableButtonFor.firstCall.args[1]).to.equal(expectedTime);
                })
                .then(done, done);
        });
    });

    describe('register tests', () => {
        const template = sinon.spy();

        beforeEach(() => {
            sinon.stub(userData, 'userIsLogged');
            sinon.stub(templateLoader, 'load');

            sinon.stub($.fn, 'html');
            sinon.stub($.fn, 'on');
        });

        afterEach(() => {
            $.fn.html.restore();
            $.fn.on.restore();

            userData.userIsLogged.restore();
            templateLoader.load.restore();
        });

        it('expect not to call templateLoader load method when user is already logged in', () => {
            userData.userIsLogged.returns(true);

            templateLoader.load.returns(Promise.resolve(template));

            userController.register();
            expect(templateLoader.load).to.not.have.been.called;
        });

        it('expect to call templateLoader load method once when user is not logged in', (done) => {
            userData.userIsLogged.returns(false);

            templateLoader.load.returns(Promise.resolve(template));

            userController.register()
                .then(() => {
                    expect(templateLoader.load).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call templateLoader load method with correct template name when user is not logged in', (done) => {
            userData.userIsLogged.returns(false);

            templateLoader.load.returns(Promise.resolve(template));

            userController.register()
                .then(() => {
                    expect(templateLoader.load).to.have.been.calledWith('register');
                })
                .then(done, done);
        });

        it('expect to call resolved template function when user is not logged', (done) => {
            userData.userIsLogged.returns(false);

            templateLoader.load.returns(Promise.resolve(template));

            userController.register()
                .then(() => {
                    expect(template).to.have.been.called;
                })
                .then(done, done);
        });

        it('expect to call jQuery html function once when user is not logged', (done) => {
            userData.userIsLogged.returns(false);

            templateLoader.load.returns(Promise.resolve(template));

            userController.register()
                .then(() => {
                    expect($.fn.html).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call jQuery html function with the result of the template execution when user is not logged', (done) => {
            userData.userIsLogged.returns(false);

            templateLoader.load.returns(Promise.resolve(template));

            userController.register()
                .then(() => {
                    expect($.fn.html.firstCall.args[0]).to.deep.equal(template());
                })
                .then(done, done);
        });

        it('expect to call jQuery on function once when user is not logged in', (done) => {
            userData.userIsLogged.returns(false);

            templateLoader.load.returns(Promise.resolve(template));

            userController.register()
                .then(() => {
                    expect($.fn.on).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('exepct to call jQuery on function with submit as first parameter', (done) => {
            userData.userIsLogged.returns(false);

            templateLoader.load.returns(Promise.resolve(template));

            userController.register()
                .then(() => {
                    expect($.fn.on).to.have.been.calledWith('submit');
                })
                .then(done, done);
        });

    });

    describe('submitRegister tests', () => {
        const username = "someUsername";
        const password = "somePassword";

        const context = {
            redirect: () => {}
        };

        beforeEach(() => {
            sinon.stub($.fn, 'val');
            $.fn.val.onCall(0).returns(username);
            $.fn.val.onCall(1).returns(password);
            $.fn.val.onCall(2).returns(password);

            sinon.stub(userData, 'userRegister');
            sinon.stub(context, 'redirect');

            sinon.stub(validator, 'isValidPassword')
                .returns(Promise.resolve());
            sinon.stub(validator, 'isValidUsername')
                .returns(Promise.resolve());
            sinon.stub(validator, 'arePasswordsMatching')
                .returns(Promise.resolve());

            sinon.stub(notificator, 'success');
            sinon.stub(notificator, 'error');
            sinon.stub(utils, 'disableButtonFor');
        });

        afterEach(() => {
            validator.isValidPassword.restore();
            validator.arePasswordsMatching.restore();
            validator.isValidUsername.restore();

            userData.userRegister.restore();
            $.fn.val.restore();
            notificator.success.restore();
            notificator.error.restore();
            utils.disableButtonFor.restore();
            context.redirect.restore();
        });

        it('expect to call validator isValidUsername with the correct username as a parameter', (done) => {
            userData.userRegister.returns(Promise.resolve());

            userController.submitRegister(context)
                .then(() => {
                    expect(validator.isValidUsername).to.be.calledWith(username);
                })
                .then(done, done);
        });

        it('expect to call validator isValidPassword with the correct password as a parameter', (done) => {
            userData.userRegister.returns(Promise.resolve());

            userController.submitRegister(context)
                .then(() => {
                    expect(validator.isValidPassword).to.be.calledWith(password);
                })
                .then(done, done);
        });

        it('expect to call validator arePasswordsMatching with the correct username as a parameter', (done) => {
            userData.userRegister.returns(Promise.resolve());

            userController.submitRegister(context)
                .then(() => {
                    expect(validator.arePasswordsMatching).to.be.calledWith(password, password);
                })
                .then(done, done);
        });

        it('expect to call userdata.userRegister with correct userObject when all validations pass', (done) => {
            userData.userRegister.returns(Promise.resolve());

            const expectedUser = {
                username,
                password,
                coins: 60000,
                purchasedPlayers: [],
                squad: {}
            };

            userController.submitRegister(context)
                .then(() => {
                    expect(userData.userRegister.firstCall.args[0]).to.deep.equal(expectedUser);
                })
                .then(done, done);
        });

        it('expect to call notificator success with correct message when all validations pass and user is registered', (done) => {
            userData.userRegister.returns(Promise.resolve());

            userController.submitRegister(context)
                .then(() => {
                    expect(notificator.success).to.have.been.calledWith('', `User ${username} registered successfully`);
                })
                .then(done, done);
        });

        it('expect to call context redirect with correct route when all validations pass and user is registered', (done) => {
            userData.userRegister.returns(Promise.resolve());
            const expectedRoute = '#/home';

            userController.submitRegister(context)
                .then(() => {
                    expect(context.redirect).to.have.been.calledWith(expectedRoute);
                })
                .then(done, done);
        });


        it('expect to call notificator error with correct message when isValidPasswordValidation Fails', (done) => {
            userData.userRegister.returns(Promise.resolve());

            const rejectMessage = 'someRejection :(';
            validator.isValidPassword.returns(Promise.reject(rejectMessage));

            userController.submitRegister(context)
                .then(() => {
                    expect(notificator.error).to.have.been.calledWith(rejectMessage);
                })
                .then(done, done);
        });

        it('expect to call notificator error with correct message when isValidUsername Validation Fails', (done) => {
            userData.userRegister.returns(Promise.resolve());

            const rejectMessage = 'someRejection :(';
            validator.isValidUsername.returns(Promise.reject(rejectMessage));

            userController.submitRegister(context)
                .then(() => {
                    expect(notificator.error).to.have.been.calledWith(rejectMessage);
                })
                .then(done, done);
        });

        it('expect to call notificator error with correct message when arePasswordsMatching Validatrion Fails', (done) => {
            userData.userRegister.returns(Promise.resolve());

            const rejectMessage = 'someRejection :(';
            validator.arePasswordsMatching.returns(Promise.reject(rejectMessage));

            userController.submitRegister(context)
                .then(() => {
                    expect(notificator.error).to.have.been.calledWith(rejectMessage);
                })
                .then(done, done);
        });

        it('expect to call utils disableButtonFor for correct amount of time when any validation fails', (done) => {
            userData.userRegister.returns(Promise.resolve());

            const rejectMessage = 'someRejection :(';
            validator.arePasswordsMatching.returns(Promise.reject(rejectMessage));

            const expectedTime = 5000;

            userController.submitRegister(context)
                .then(() => {
                    expect(utils.disableButtonFor.firstCall.args[1]).to.equal(expectedTime);
                })
                .then(done, done);
        });

        it('expect to call notificator with user already exists message when userRegister promise is rejected', (done) => {
            const errObj = {
                getResponseHeader: 'some-header'
            };
            userData.userRegister.returns(Promise.reject(errObj));

            const expectedMessage = `User with username ${username} already exists`;

            userController.submitRegister(context)
                .then(() => {
                    expect(notificator.error).to.have.been.calledWith(expectedMessage);
                })
                .then(done, done);
        });
    });

    describe('userLogout tests', () => {
        const context = {
            redirect: () => {}
        };

        beforeEach(() => {
            sinon.stub(notificator, 'success');
            sinon.stub(context, 'redirect');
            sinon.stub(notificator, 'error');
            sinon.stub(userData, 'userLogout');
            sinon.stub(userData, 'userIsLogged');
        });

        afterEach(() => {
            notificator.success.restore();
            notificator.error.restore();
            context.redirect.restore();
            userData.userLogout.restore();
            userData.userIsLogged.restore();
        });

        it('expect to not call userDate.userLogout when user is already logged out', () => {
            userData.userIsLogged.returns(false);

            const returnedValue = userController.logout();
            expect(userData.userLogout).to.not.have.been.called;
            expect(returnedValue).to.be.a('undefined');
        });

        it('exepct to return a promise when user is logged in', (done) => {
            userData.userIsLogged.returns(true);
            userData.userLogout.returns(Promise.resolve());

            const returnedValue = userController.logout(context)
                .then(() => {
                    expect(returnedValue).to.be.a('promise');
                })
                .then(done, done);
        });


        it('exepct to call notificator success with correct message when user is logged out successfully', (done) => {
            userData.userIsLogged.returns(true);
            userData.userLogout.returns(Promise.resolve());

            const expectedMessage = 'You have logged out successfully!';

            userController.logout(context)
                .then(() => {
                    expect(notificator.success).to.have.been.calledWith(expectedMessage);
                })
                .then(done, done);
        });

        it('exepct to call context redirect with correct route when user is logged out successfully', (done) => {
            userData.userIsLogged.returns(true);
            userData.userLogout.returns(Promise.resolve());

            const expectedRoute = '#/home';

            userController.logout(context)
                .then(() => {
                    expect(context.redirect).to.have.been.calledWith(expectedRoute);
                })
                .then(done, done);
        });

        it('expect to call notificator error with correct error message when logout has not been successfull', (done) => {
            userData.userIsLogged.returns(true);
            userData.userLogout.returns(Promise.reject());

            userController.logout(context)
                .then(() => {
                    expect(notificator.error).to.have.been.calledWith('Please try again in a few moments', 'There was a problem logging out!');
                })
                .then(done, done);
        });
    });
});