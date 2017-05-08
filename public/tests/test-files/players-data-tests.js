import { playersData } from 'players-data';
import { requester } from 'requester';

describe('* PlayersData tests', () => {
    const PLAYER_PRICE_MULTIPLIER = 100;

    describe('getPlayers tests', () => {

        const stringifiedValue = "someString";
        const filterOptions = "someFitlerOptions";

        const items = [
            { rating: 1 },
            { rating: 2 },
            { rating: 3 }
        ];
        const data = {
            items: items
        };

        beforeEach(() => {
            sinon.stub(JSON, 'stringify')
                .returns(stringifiedValue);

            sinon.stub(requester, 'getJSON')
                .returns(Promise.resolve(data));
        });

        afterEach(() => {
            JSON.stringify.restore();
            requester.getJSON.restore();
        });

        it('expect to return a promise', (done) => {
            const returnedValue = playersData.getPlayers(filterOptions)
                .then(() => {
                    expect(returnedValue).to.be.a('promise');
                })
                .then(done, done);
        });

        it('expect to call JSON.stringify once', (done) => {
            playersData.getPlayers(filterOptions)
                .then(() => {
                    expect(JSON.stringify).to.be.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call JSON.stringify with the passed filterOptions parameter', (done) => {
            playersData.getPlayers(filterOptions)
                .then(() => {
                    expect(JSON.stringify).to.be.calledWith(filterOptions);
                })
                .then(done, done);
        });

        it('expect to call request.getJSON with correctly processed url', (done) => {
            const expectedURl = '/api/fut/item?jsonParamObject=' + stringifiedValue;
            playersData.getPlayers(filterOptions)
                .then(() => {
                    expect(requester.getJSON).to.be.calledWith(expectedURl);
                })
                .then(done, done);
        });

        it('expect to call requester.getJSON once', (done) => {
            playersData.getPlayers(filterOptions)
                .then(() => {
                    expect(requester.getJSON).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to correctly calculate the data items returned from the getJSON request', (done) => {
            playersData.getPlayers(filterOptions)
                .then(data => {
                    data.items.forEach((item) => {
                        expect(item.price).to.equal(item.rating * PLAYER_PRICE_MULTIPLIER);
                    });
                })
                .then(done, done);
        });

        it('expect to call requester with the correct url when no filter options are passed', (done) => {
            const expectedUrl = '/api/fut/item';
            playersData.getPlayers()
                .then(() => {
                    expect(requester.getJSON).to.have.been.calledWith(expectedUrl);
                })
                .then(done, done);
        });
    });

    describe('getPlayerPrice tests', () => {
        it('expect to return a correct price when passed rating convertible to number', () => {
            const rating = "5";
            const expectedPrice = 500;
            const returnedPrice = playersData.getPlayerPrice(rating);

            expect(returnedPrice).to.equal(expectedPrice);
        });

        it('exepct to throw when passed rating is not convertible to number', () => {
            const rating = "invalidRating";

            expect(() => playersData.getPlayerPrice(rating)).to.throw();
        });
    });

    describe('getPlayerById tests', () => {

        beforeEach(() => {
            sinon.stub(playersData, 'getPlayers');
        });

        afterEach(() => {
            playersData.getPlayers.restore();
        });

        it('expect to return a promise', () => {
            const data = {
                items: ["Ronaldo"]
            };

            playersData.getPlayers.returns(Promise.resolve(data));

            const returnedValue = playersData.getPlayerById(1);
            expect(returnedValue).to.be.a('promise');
        });

        it('expect to call playersData.getPlayers once', (done) => {
            const data = {
                items: ["Ronaldo"]
            };

            playersData.getPlayers.returns(Promise.resolve(data));

            playersData.getPlayerById(1)
                .then(() => {
                    expect(playersData.getPlayers).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect to call playersData.getPlayers with correct filterOptions object', (done) => {
            const data = {
                items: ["Ronaldo"]
            };

            const id = 1;

            const expectedFilterOptions = {
                id
            };

            playersData.getPlayers.returns(Promise.resolve(data));

            playersData.getPlayerById(id)
                .then(() => {
                    expect(playersData.getPlayers.firstCall.args[0]).to.deep.equal(expectedFilterOptions);
                })
                .then(done, done);
        });

        it('expect to resolve with the first of the returned players when there is at least one player with that id returned', (done) => {
            const data = {
                items: ["Ronaldo"]
            };

            const id = 1;

            playersData.getPlayers.returns(Promise.resolve(data));

            playersData.getPlayerById(1)
                .then((player) => {
                    expect(player).to.equal(data.items[0]);
                })
                .then(done, done);
        });

        it('expect to reject with correct string message when there are no player with such id', (done) => {
            const data = {
                items: []
            };

            const id = 1;

            playersData.getPlayers.returns(Promise.resolve(data));

            const expectedMessage = "Cannot find player with such id";
            playersData.getPlayerById(1)
                .then(() => {}, (message) => {
                    expect(message).to.equal(expectedMessage);
                })
                .then(done, done);
        });
    });
});