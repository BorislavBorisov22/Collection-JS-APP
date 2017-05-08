import { requester } from 'requester';
import { localStorer } from 'local-storer'
import { squadData } from 'squad-data';

describe('* SquadData Tests', () => {
    const BASE_URL = 'https://baas.kinvey.com';
    const APP_KEY = 'kid_S1wy8b41W';
    const APP_SECRET = 'a69edf81880b4454ae540916a7625cd9';
    const AUTH_TOKEN_STORAGE = 'auth-token';
    const USERNAME_STORAGE = 'username';

    describe('getSquad tests', () => {
        const getItemValue = 'someValue';

        const data = {
            squad: 'some-squad'
        };

        beforeEach(() => {
            sinon.stub(localStorer, 'getItem')
                .returns(getItemValue);

            sinon.stub(requester, 'getJSON')
                .returns(Promise.resolve(data));
        });

        afterEach(() => {
            localStorer.getItem.restore();
            requester.getJSON.restore();
        });

        it('expect to call localStorer.getItem twice', (done) => {
            squadData.getSquad()
                .then(() => {
                    expect(localStorer.getItem).to.be.calledTwice;
                })
                .then(done, done);
        });

        it('expect to call localStorer.getItem with correct auth token storage string', (done) => {
            squadData.getSquad()
                .then(() => {
                    expect(localStorer.getItem).to.be.calledWith(AUTH_TOKEN_STORAGE);
                })
                .then(done, done);
        });

        it('expect to call localStorer.getItem with correct username storage string', (done) => {
            squadData.getSquad()
                .then(() => {
                    expect(localStorer.getItem).to.be.calledWith(USERNAME_STORAGE);
                })
                .then(done, done);
        });

        it('expect to call requester.getJSON once', (done) => {
            squadData.getSquad()
                .then(() => {
                    expect(requester.getJSON).to.be.calledOnce;
                })
                .then(done, done);
        });


        it('expect to call requester.getJSON witch correct url', (done) => {
            const expectedUrl = `${BASE_URL}/appdata/${APP_KEY}/squads/${getItemValue}`;
            squadData.getSquad()
                .then(() => {
                    expect(requester.getJSON).to.be.calledWith(expectedUrl);
                })
                .then(done, done);
        });

        it('expect to call requester.getJSON witch correct header object', (done) => {
            const expectedHeader = {
                Authorization: `Kinvey ${getItemValue}`
            };

            squadData.getSquad()
                .then(() => {
                    expect(requester.getJSON.firstCall.args[1]).to.deep.equal(expectedHeader);
                })
                .then(done, done);
        });

        it('expect to return a promise', (done) => {
            const returnValue = squadData.getSquad()
                .then(() => {
                    expect(returnValue).to.be.a('promise');
                })
                .then(done, done);
        });

        it('expect to recieve only the squad from the requested data when calling then on the returned promise', (done) => {
            squadData.getSquad()
                .then((squad) => {
                    expect(squad).to.deep.equal(data.squad);
                })
                .then(done, done);
        });
    });

    describe('saveToSquad tests', () => {
        const getItemValue = "someValue";
        const squad = {};

        const playerPosition = 'forward';
        const playerInfo = 'some-info';
        const putJSONReturnValue = 'putJSON return value';

        beforeEach(() => {
            sinon.stub(localStorer, 'getItem')
                .returns(getItemValue);

            sinon.stub(squadData, 'getSquad')
                .returns(Promise.resolve(squad));

            sinon.stub(requester, 'putJSON')
                .returns(Promise.resolve(putJSONReturnValue));
        });

        afterEach(() => {
            localStorer.getItem.restore();
            squadData.getSquad.restore();
            requester.putJSON.restore();
        });

        it('expect to return a promise', (done) => {
            const returned = squadData.saveToSquad(playerPosition, playerInfo)
                .then(() => {
                    expect(returned).to.be.a('promise');
                })
                .then(done, done);
        });

        it('expect call localStorer.getItem twice', (done) => {
            const returned = squadData.saveToSquad(playerPosition, playerInfo)
                .then(() => {
                    expect(localStorer.getItem).to.be.calledTwice;
                })
                .then(done, done);
        });

        it('expect call localStorer.getItem with valid auth token storage string', (done) => {
            const returned = squadData.saveToSquad(playerPosition, playerInfo)
                .then(() => {
                    expect(localStorer.getItem).to.be.calledWith(AUTH_TOKEN_STORAGE);
                })
                .then(done, done);
        });

        it('expect call localStorer.getItem with valid auth username storage string', (done) => {
            const returned = squadData.saveToSquad(playerPosition, playerInfo)
                .then(() => {
                    expect(localStorer.getItem).to.be.calledWith(USERNAME_STORAGE);
                })
                .then(done, done);
        });

        it('expect to call requester.putJSON with the correct url when promise return from getSquad is resolved', (done) => {
            squadData.saveToSquad(playerPosition, playerInfo)
                .then(() => {
                    const expectedUrl = `${BASE_URL}/appdata/${APP_KEY}/squads/${getItemValue}`;
                    expect(requester.putJSON).to.be.calledWith(expectedUrl);
                })
                .then(done, done);
        });

        it('expect to call requester.putJSON with the correct header when promise return from getSquad is resolved', (done) => {
            squadData.saveToSquad(playerPosition, playerInfo)
                .then(() => {
                    const expectedHeader = {
                        Authorization: `Kinvey ${getItemValue}`
                    };

                    expect(requester.putJSON.firstCall.args[2]).to.deep.equal(expectedHeader);
                })
                .then(done, done);
        });

        it('expect to call requester.putJSON with the correct squad object as a body parameter', (done) => {
            const expectedBody = {
                squad: {
                    [playerPosition]: playerInfo
                }
            };

            squadData.saveToSquad(playerPosition, playerInfo)
                .then(() => {
                    expect(requester.putJSON.firstCall.args[1]).to.deep.equal(expectedBody);
                })
                .then(done, done);
        });

        it('expect to return the same value returned from requester.putJSON in then of the getSquad promise', (done) => {
            const expectedData =
                squadData.saveToSquad(playerPosition, playerInfo)
                .then((data) => {
                    expect(data).to.equal(putJSONReturnValue);
                })
                .then(done, done);
        });
    });

    describe('saveAll tests', () => {
        const getItemValue = "someValue";
        const squad = {};

        beforeEach(() => {
            sinon.stub(localStorer, 'getItem')
                .returns(getItemValue);

            sinon.stub(requester, 'putJSON')
                .returns(Promise.resolve());
        });

        afterEach(() => {
            localStorer.getItem.restore();
            requester.putJSON.restore();
        });

        it('expect to return a promise', (done) => {
            const returned = squadData.saveAll(squad)
                .then(() => {
                    expect(returned).to.be.a('promise');
                })
                .then(done, done);
        });

        it('expect call localStorer.getItem twice', (done) => {
            squadData.saveAll(squad)
                .then(() => {
                    expect(localStorer.getItem).to.be.calledTwice;
                })
                .then(done, done);
        });

        it('expect call localStorer.getItem with valid auth token storage string', (done) => {
            const returned = squadData.saveAll(squad)
                .then(() => {
                    expect(localStorer.getItem).to.be.calledWith(AUTH_TOKEN_STORAGE);
                })
                .then(done, done);
        });

        it('expect call localStorer.getItem with valid auth username storage string', (done) => {
            const returned = squadData.saveAll(squad)
                .then(() => {
                    expect(localStorer.getItem).to.be.calledWith(USERNAME_STORAGE);
                })
                .then(done, done);
        });

        it('expect to call requester.putJSON with the correct url when promise return from getSquad is resolved', (done) => {
            squadData.saveAll(squad)
                .then(() => {
                    const expectedUrl = `${BASE_URL}/appdata/${APP_KEY}/squads/${getItemValue}`;
                    expect(requester.putJSON).to.be.calledWith(expectedUrl);
                })
                .then(done, done);
        });

        it('expect to call requester.putJSON with the correct header when promise return from getSquad is resolved', (done) => {
            squadData.saveAll(squad)
                .then(() => {
                    const expectedHeader = {
                        Authorization: `Kinvey ${getItemValue}`
                    };

                    expect(requester.putJSON.firstCall.args[2]).to.deep.equal(expectedHeader);
                })
                .then(done, done);
        });

        it('expect to call requester.putJSON with the correct squad object as a body parameter', (done) => {
            const expectedBody = {
                squad: squad
            };

            squadData.saveAll(squad)
                .then(() => {
                    expect(requester.putJSON.firstCall.args[1]).to.deep.equal(expectedBody);
                })
                .then(done, done);
        });
    });

    describe('initialize Squad tests', () => {
        beforeEach(() => {
            sinon.stub(squadData, 'saveAll')
                .returns(Promise.resolve());
        });

        afterEach(() => {
            squadData.saveAll.restore();
        });

        it('expect to return a promise', () => {
            const returnedValue = squadData.initializeSquad();
            expect(returnedValue).to.be.a('promise');
        });

        it('expect to call squadData.saveAll once', () => {
            squadData.initializeSquad();
            expect(squadData.saveAll).to.be.calledOnce;
        });

        it('expect to call squadData.saveAll with an empty objet as parameter', () => {
            squadData.initializeSquad();
            expect(squadData.saveAll.firstCall.args[0]).to.deep.equal({});
        });
    });

    describe('removePlayer tests', () => {
        let player, squad;

        beforeEach(() => {
            player = {
                id: 33
            };

            squad = {
                'leftforward': {
                    id: 33
                }
            };

            sinon.stub(squadData, 'getSquad')
                .returns(Promise.resolve(squad));

            sinon.stub(squadData, 'saveAll')
                .returns(Promise.resolve());
        });

        afterEach(() => {
            squadData.saveAll.restore();
            squadData.getSquad.restore();
        });

        it('expect to return a promise', (done) => {
            const returnedValue = squadData.removePlayer(player)
                .then(() => {
                    expect(returnedValue).to.be.a('promise');
                })
                .then(done, done);
        });

        it('expect to remove all playerPositions that have an object with the passed player id', (done) => {
            squadData.removePlayer(player)
                .then(() => {
                    expect(squad).to.not.have.ownProperty('leftforward');
                })
                .then(done, done);
        });

        it('expect to call saveAll function with the passed squad object', (done) => {
            squadData.removePlayer(player)
                .then(() => {
                    expect(squadData.saveAll.firstCall.args[0]).to.deep.equal(squad);
                })
                .then(done, done);
        });

        it('expect to call saveAll function once when getSuad returned promise is resolved', (done) => {
            squadData.removePlayer(player)
                .then(() => {
                    expect(squadData.saveAll).to.be.calledOnce;
                })
                .then(done, done);
        });

        it('expect not to change the passed squad object when there is no player with the passeed player id', (done) => {
            player.id = 1;
            const expectedSquad = {
                'leftforward': {
                    id: 33
                }
            };

            squadData.removePlayer(player)
                .then(() => {
                    expect(squad).to.deep.equal(expectedSquad);
                })
                .then(done, done);
        });

        it('expect not to call squadData.saveAll when getSquad returned promise is rejected', (done) => {
            squadData.getSquad.returns(Promise.reject());

            squadData.removePlayer(player)
                .then(() => {}, () => {
                    expect(squadData.saveAll).to.have.not.been.called;
                })
                .then(done, done);
        });
    });
});