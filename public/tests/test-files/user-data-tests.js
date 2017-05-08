import { userData } from 'user-data';
import { localStorer } from 'local-storer';
import { requester } from 'requester';
import { encryptor } from 'encryptor';
import { squadData } from 'squad-data';

mocha.setup('bdd');
const { expect } = chai;


describe('userData Tests', () => {
    const AUTH_TOKEN_STORAGE = 'auth-token';
    const USERNAME_STORAGE = 'username';
    const USER_ID_STORAGE = 'user-id';

    const APP_KEY = 'kid_S1wy8b41W';
    const APP_SECRET = 'a69edf81880b4454ae540916a7625cd9';
    const APP_BASE_URL = 'https://baas.kinvey.com';

    describe('userIsLogged tests', () => {
        afterEach(() => {
            localStorer.getItem.restore();
        });

        it('expect to call localStorer getItem() twice when the at least first call returns non-empty string', () => {
            sinon.stub(localStorer, 'getItem')
                .returns("non-empty-string");

            const isLogged = userData.userIsLogged();
            expect(localStorer.getItem).to.be.calledTwice;
        });

        it('expect to call localStorer getItem() once when first call returns empty string', () => {
            sinon.stub(localStorer, 'getItem')
                .returns("");

            const isLogged = userData.userIsLogged();
            expect(localStorer.getItem).to.be.calledOnce;
        });

        it('expect localStorer.getItem to be called with correct auth token storage string', () => {
            sinon.stub(localStorer, 'getItem')
                .returns("non-empty-string");

            const isLogged = userData.userIsLogged();
            expect(localStorer.getItem).to.be.calledWith(AUTH_TOKEN_STORAGE);
        });

        it('expect localStorer.getItem to be called with correct username storage string', () => {
            sinon.stub(localStorer, 'getItem')
                .returns("non-empty-string");

            const isLogged = userData.userIsLogged();
            expect(localStorer.getItem).to.be.calledWith(USERNAME_STORAGE);
        });

        it('expect to return false when both times localStorerG.gtItem returns empty string', () => {
            sinon.stub(localStorer, 'getItem')
                .returns("");

            const isLogged = userData.userIsLogged();

            expect(isLogged).to.be.false;
        });

        it('expect to return false when localStorer.getItem returns empty string only when called with authtoken storage', () => {
            sinon.stub(localStorer, 'getItem')
                .onCall(0)
                .returns("")
                .onCall(1)
                .returns("non empty string");

            const isLogged = userData.userIsLogged();

            expect(isLogged).to.be.false;
        });

        it('expect to return false when localStorer.getItem returns empty string only when called with username storage', () => {
            sinon.stub(localStorer, 'getItem')
                .onCall(0)
                .returns("non empty string")
                .onCall(1)
                .returns("");

            const isLogged = userData.userIsLogged();

            expect(isLogged).to.be.false;
        });

        it('expect to return true when localStorer.getItem returns non-empty string both times', () => {
            sinon.stub(localStorer, 'getItem')
                .returns("none-empty string :)");

            const isLogged = userData.userIsLogged();

            expect(isLogged).to.be.true;
        });
    });

    describe('userLogin tests', () => {
        const user = {
            username: "Penka",
            password: 'Sladuranata42'
        };

        const data = {
            username: 'Penka',
            _kmd: {
                authtoken: 'some-token',
            },
            _id: 1
        };

        beforeEach(() => {
            sinon.stub(localStorer, 'setItem')
                .returns('dsds');

            sinon.stub(encryptor, 'toBase64')
                .returns("based64");

            sinon.stub(encryptor, 'SHA1')
                .returns('encrypted');

            sinon.stub(requester, 'postJSON')
                .returns(Promise.resolve(data));
        });

        afterEach(() => {
            requester.postJSON.restore();
            encryptor.toBase64.restore();
            encryptor.SHA1.restore();
            localStorer.setItem.restore();
        });

        it('expect to return a promise', (done) => {
            const returnedValue = userData.userLogin(user)
                .then(() => {
                    expect(returnedValue).to.be.a('promise');
                })
                .then(done, done);
        });

        it('expect to call requester.postJSON once', (done) => {
            userData.userLogin(user)
                .then(() => {
                    expect(requester.postJSON).to.be.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call requester.postJSON with the correct url', (done) => {
            const expectedURL = `${APP_BASE_URL}/user/${APP_KEY}/login`;

            userData.userLogin(user)
                .then(() => {
                    expect(requester.postJSON).to.be.calledWith(expectedURL);
                })
                .then(done, done);
        });

        it('expect to call requester.postJSON with correct data', (done) => {
            const expectedData = {
                username: user.username,
                password: encryptor.SHA1(user.password)
            };

            userData.userLogin(user)
                .then(() => {
                    expect(requester.postJSON.firstCall.args[1]).to.deep.equal(expectedData);
                })
                .then(done, done);
        });

        it('expect to call requester.postJSON with the correct headers object', (done) => {
            const expectedHeaders = {
                Authorization: `Basic based64`
            };

            userData.userLogin(user)
                .then(() => {
                    expect(requester.postJSON.firstCall.args[2]).to.deep.equal(expectedHeaders);
                })
                .then(done, done);
        });

        it('expect localStorer.SetItem to be called with correct parameters when storing username', (done) => {
            userData.userLogin(user)
                .then(() => {
                    expect(localStorer.setItem).to.be.calledWith(USERNAME_STORAGE, data.username);
                })
                .then(done, done);
        });

        it('expect localStorer.SetItem to be called with correct parameters when storing authtoken', (done) => {
            userData.userLogin(user)
                .then(() => {
                    expect(localStorer.setItem).to.be.calledWith(AUTH_TOKEN_STORAGE, data._kmd.authtoken);
                })
                .then(done, done);
        });

        it('expect localStorer.SetItem to be called with correct parameters when storing user id', (done) => {
            userData.userLogin(user)
                .then(() => {
                    expect(localStorer.setItem).to.be.calledWith(USER_ID_STORAGE, data._id);
                })
                .then(done, done);
        });

        it('expect to call localStorer.setItem three times when requester.postJSON promise is resolved', (done) => {
            userData.userLogin(user)
                .then(() => {
                    expect(localStorer.setItem).to.be.calledThrice;
                })
                .then(done, done);
        });

        it('expect to call encryptor.SHA1 once', (done) => {
            userData.userLogin(user)
                .then(() => {
                    expect(encryptor.SHA1).to.be.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call encryptor.SHA1 with the passed user password as parameter', (done) => {
            userData.userLogin(user)
                .then(() => {
                    expect(encryptor.SHA1).to.be.calledWith(user.password);
                })
                .then(done, done);
        });

        it('expect to call encryptor.toBase64 once', (done) => {
            userData.userLogin(user)
                .then(() => {
                    expect(encryptor.toBase64).to.be.calledOnce;
                })
                .then(done, done);
        });

        it('expect encryptor.toBase64 to be called with the correct parameters', (done) => {
            const expectedParameter = `${APP_KEY}:${APP_SECRET}`;

            userData.userLogin(user)
                .then(() => {
                    expect(encryptor.toBase64).to.be.calledWith(expectedParameter);
                })
                .then(done, done);
        });
    });

    describe('UserLogout tests', () => {
        const getItemReturnValue = "someString";

        beforeEach(() => {
            sinon.stub(localStorer, 'getItem')
                .returns(getItemReturnValue);

            sinon.stub(localStorer, 'removeItem')
                .returns(undefined);

            sinon.stub(requester, 'postJSON')
                .returns(Promise.resolve());
        });

        afterEach(() => {
            localStorer.getItem.restore();
            localStorer.removeItem.restore();
            requester.postJSON.restore();
        });

        it('expect to return a promise', () => {
            const returnedValue = userData.userLogout();

            expect(returnedValue).to.be.a('promise');
        });

        it('expect to call localStorer.getItem once', () => {
            userData.userLogout();

            expect(localStorer.getItem).to.be.calledOnce;
        });

        it('expect to call localStorers.getItem with valid the correct authtoken storage string', () => {
            userData.userLogout();

            expect(localStorer.getItem).to.be.calledWith(AUTH_TOKEN_STORAGE);
        });

        it('expect to call requester.postJSON with correct user', () => {
            const expectedUrl = `${APP_BASE_URL}/user/${APP_KEY}/_logout`;

            userData.userLogout();
            expect(requester.postJSON).to.be.calledWith(expectedUrl);
        });

        it('exepct to call requester.postJSON once', () => {
            userData.userLogout();
            expect(requester.postJSON).to.be.calledOnce;
        });

        it('expect to call requester.postJSON with an empty object as a body', () => {
            userData.userLogout();

            expect(requester.postJSON.firstCall.args[1]).to.deep.equal({});
        });

        it('expect to call requester.postJSON with correct header object', () => {
            const expectedHeader = {
                Authorization: `Kinvey ${getItemReturnValue}`
            };

            userData.userLogout();
            expect(requester.postJSON.firstCall.args[2]).to.deep.equal(expectedHeader);
        });

        it('expect to call localStorer.removeItem with correct username storage string when requester.postJSON promise is resolve correctly', (done) => {
            userData.userLogout()
                .then(() => {
                    expect(localStorer.removeItem).to.be.calledWith(USERNAME_STORAGE);
                })
                .then(done, done);
        });

        it('expect to call localStorer.removeItem with correct auth token storage string when requester.postJSON promise is resolve correctly', (done) => {
            userData.userLogout()
                .then(() => {
                    expect(localStorer.removeItem).to.be.calledWith(AUTH_TOKEN_STORAGE);
                })
                .then(done, done);
        });

        it('expect to call localStorer.removeItem with correct user id storage string when requester.postJSON promise is resolve correctly', (done) => {
            userData.userLogout()
                .then(() => {
                    expect(localStorer.removeItem).to.be.calledWith(USER_ID_STORAGE);
                })
                .then(done, done);
        });
    });

    describe('UserRegister tests', () => {
        const encryptionResult = "encrypted";
        const base64Result = 'someBase64';

        const data = {
            username: 'someUsername',
            _kmd: {
                authtoken: 'someToken'
            },
            _id: "someId",
        };

        const user = {
            username: 'someUsername',
            password: 'somePass'
        };

        beforeEach(() => {
            sinon.stub(requester, 'postJSON')
                .returns(Promise.resolve(data));

            sinon.stub(localStorer, 'setItem')
                .returns(undefined);

            sinon.stub(encryptor, 'toBase64')
                .returns(base64Result);

            sinon.stub(encryptor, 'SHA1')
                .returns(encryptionResult);

            sinon.stub(squadData, 'initializeSquad')
                .returns('nothing');
        });

        afterEach(() => {
            requester.postJSON.restore();
            localStorer.setItem.restore();
            encryptor.SHA1.restore();
            encryptor.toBase64.restore();
            squadData.initializeSquad.restore();
        });

        it('expect to call encryptor.toBase64 once', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(encryptor.toBase64).to.be.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call encryptor.toBase64 with correct parameter', (done) => {
            const expectedParameter = `${APP_KEY}:${APP_SECRET}`;
            userData.userRegister(user)
                .then(() => {
                    expect(encryptor.toBase64).to.be.calledWith(expectedParameter);
                })
                .then(done, done);
        });

        it('expect to call encryptor SHA1 once', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(encryptor.SHA1).to.be.calledOnce;
                })
                .then(done, done);
        });


        it('expect to call encryptor SHA1 with passed users password', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(encryptor.SHA1).to.be.calledWith(user.password);
                })
                .then(done, done);
        });

        it('expect to call requester.postJSON with correct url', (done) => {
            const expectedUrl = `${APP_BASE_URL}/user/${APP_KEY}`;
            userData.userRegister(user)
                .then(() => {
                    expect(requester.postJSON).to.be.calledWith(expectedUrl);
                })
                .then(done, done);
        });

        it('expect to call requester.postJSON with correct body object', (done) => {
            const expectedBody = {
                username: user.username,
                password: encryptionResult
            };
            userData.userRegister(user)
                .then(() => {
                    expect(requester.postJSON.firstCall.args[1]).to.deep.equal(expectedBody);
                })
                .then(done, done);
        });

        it('expect to call requester.postJSON with correct headers object', (done) => {
            const expectedHeader = {
                Authorization: `Basic ${base64Result}`
            };
            userData.userRegister(user)
                .then(() => {
                    expect(requester.postJSON.firstCall.args[2]).to.deep.equal(expectedHeader);
                })
                .then(done, done);
        });

        it('expect to call requester.postJSON once', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(requester.postJSON).to.be.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call localStorer.setItem with valid username storage parameters', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(localStorer.setItem).to.be.calledWith(USERNAME_STORAGE, data.username);
                })
                .then(done, done);
        });

        it('expect to call localStorer.setItem three times when request.postJSON promise is resolved', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(localStorer.setItem).to.be.calledThrice;
                })
                .then(done, done);
        });

        it('expect to call localStorer.setItem with valid authtoken storage parameters', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(localStorer.setItem).to.be.calledWith(AUTH_TOKEN_STORAGE, data._kmd.authtoken);
                })
                .then(done, done);
        });

        it('expect to call localStorer.setItem with valid user id storage parameters', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(localStorer.setItem).to.be.calledWith(USER_ID_STORAGE, data._id);
                })
                .then(done, done);
        });

        it('expect to call squadData.initializeSquad once', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(squadData.initializeSquad).to.be.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call squadData.initializeSquad with an empty object as parameter', (done) => {
            userData.userRegister(user)
                .then(() => {
                    expect(squadData.initializeSquad.firstCall.args[0]).to.deep.equal({});
                })
                .then(done, done);
        });

        it('expect to return a promise', (done) => {
            const returnedValue = userData.userRegister(user)
                .then(() => {
                    expect(returnedValue).to.be.a('promise');
                })
                .then(done, done);
        });
    });

    describe('userGetInfo tests', () => {
        const getItemReturnValue = 'someValue';

        beforeEach(() => {
            sinon.stub(userData, 'userIsLogged');

            sinon.stub(localStorer, 'getItem')
                .returns(getItemReturnValue);

            sinon.stub(requester, 'getJSON')
                .returns(Promise.resolve());
        });

        afterEach(() => {
            localStorer.getItem.restore();
            requester.getJSON.restore();
            userData.userIsLogged.restore();
        });

        it('expect to return empty object when user is not logged in', () => {
            userData.userIsLogged.returns(false);
            const returnedValue = userData.userGetInfo();

            expect(returnedValue).to.deep.equal({});
            expect(returnedValue).not.to.be.a('promise');
        });

        it('expect to call localStorer.getItem once when user is logged', () => {
            userData.userIsLogged.returns(true);

            userData.userGetInfo();

            expect(localStorer.getItem).to.be.calledOnce;
        });

        it('expect to call localStore.getIitem with valid parameter when user is logged', () => {
            userData.userIsLogged.returns(true);

            userData.userGetInfo();

            expect(localStorer.getItem).to.be.calledWith(AUTH_TOKEN_STORAGE);
        });

        it('expect to call requester.getJSON once when user is logged', () => {
            userData.userIsLogged.returns(true);

            userData.userGetInfo();

            expect(requester.getJSON).to.be.calledOnce;
        });

        it('expect to call requester.getJSON with valid url parameter when user is logged', () => {
            userData.userIsLogged.returns(true);
            const expectedUrl = `${APP_BASE_URL}/user/${APP_KEY}/_me`;

            userData.userGetInfo();

            expect(requester.getJSON).to.be.calledWith(expectedUrl);
        });

        it('expect to call requester.getJSON with valid url parameter when user is logged', () => {
            userData.userIsLogged.returns(true);
            const expectedUrl = `${APP_BASE_URL}/user/${APP_KEY}/_me`;

            userData.userGetInfo();

            expect(requester.getJSON).to.be.calledWith(expectedUrl);
        });

        it('expect to call requester.getJSON with correct header parameter when user is logged', () => {
            userData.userIsLogged.returns(true);
            const expectedHeader = {
                Authorization: `Kinvey ${getItemReturnValue}`
            };

            userData.userGetInfo();

            expect(requester.getJSON.firstCall.args[1]).to.deep.equal(expectedHeader);
        });

        it('expect to return a promise when user is logged', () => {
            userData.userIsLogged.returns(true);

            const returnedValue = userData.userGetInfo();
            expect(returnedValue).to.be.a('promise');
        });
    });

    describe('userUpdateInfo tests', () => {
        const getItemReturnValue = 'someValue';

        beforeEach(() => {
            sinon.stub(localStorer, 'getItem')
                .returns(getItemReturnValue);

            sinon.stub(requester, 'putJSON')
                .returns(Promise.resolve());
        });

        afterEach(() => {
            localStorer.getItem.restore();
            requester.putJSON.restore();
        });

        it('expect to call localStorer.getItem twice', () => {
            userData.userUpdateInfo();

            expect(localStorer.getItem).to.be.calledTwice;
        });

        it('expect to call localStorer.getItem with valid authtoken storage string', () => {
            userData.userUpdateInfo();

            expect(localStorer.getItem).to.be.calledWith(AUTH_TOKEN_STORAGE);
        });

        it('expect to call localStorer.getItem with valid user id storage strign', () => {
            userData.userUpdateInfo();

            expect(localStorer.getItem).to.be.calledWith(USER_ID_STORAGE);
        });

        it('expect to call requester.putJSON once', () => {
            userData.userUpdateInfo();

            expect(requester.putJSON).to.be.calledOnce;
        });

        it('expect to call requester.putJSON with valid url', () => {
            const expectedUrl = `${APP_BASE_URL}/user/${APP_KEY}/${getItemReturnValue}`;

            userData.userUpdateInfo();

            expect(requester.putJSON).to.be.calledWith(expectedUrl);
        });

        it('expect to call requester.putJSON with the passed info object as body parameter when such object is passed', () => {
            const info = {
                someInfo: 'some'
            };

            userData.userUpdateInfo(info);

            expect(requester.putJSON.firstCall.args[1]).to.deep.equal(info);
        });

        it('expect to call requester.putJSON with empty object for body parameter no info object is passed', () => {
            const info = {
                someInfo: 'some'
            };

            userData.userUpdateInfo();

            expect(requester.putJSON.firstCall.args[1]).to.deep.equal({});
        });


        it('expect to call requester.putJSON with correct object for header parameter ', () => {
            const expectedHeader = {
                Authorization: `Kinvey ${getItemReturnValue}`
            };

            userData.userUpdateInfo();

            expect(requester.putJSON.firstCall.args[2]).to.deep.equal(expectedHeader);
        });

    });
});

mocha.run();