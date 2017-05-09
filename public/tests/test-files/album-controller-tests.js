import { userData } from 'user-data';
import { playersData } from 'players-data';
import { squadData } from 'squad-data';
import { templateLoader } from 'template-loader';
import { utils } from 'utils';
import { notificator } from 'notificator';
import { albumController } from 'album-controller';



describe('Album Controller Tests', () => {
    const getItemValue = 'correctValue';
    const filterOptions = {
        id: 11
    };
    let data;

    beforeEach(() => {
        data = sinon.spy();
        sinon.stub(utils, 'showLoadingAnimation');  
        sinon.stub(templateLoader, 'load')
            .returns(Promise.resolve(data));
        sinon.stub(userData, 'userGetInfo');
        sinon.stub(userData, 'userIsLogged')
            .returns(true);
        sinon.stub(playersData, 'getPlayers')
            .returns(Promise.resolve(filterOptions));
    });
    afterEach(() => {
        templateLoader.load.restore();
        playersData.getPlayers.restore();
        userData.userGetInfo.restore();
        userData.userIsLogged.restore();
        utils.showLoadingAnimation.restore();
    });

    it('expect album controller to be a function', () => {
        var result = albumController.show;
        expect(result).to.be.a('function');
    });

    it('expect to call templateLoader once', () => {
            albumController.show();
            expect(templateLoader.load).to.have.been.calledOnce;

    });      

    it('expect to call showLoadingAnimation once', () => {
            albumController.show();
            expect(utils.showLoadingAnimation).to.have.been.calledOnce;

    });

    it('expect userData to return correct value when the user IS logged', () => {
            albumController.show();
            expect(userData.userIsLogged).to.have.been.calledOnce;
    });
    //////////////////////////

    it('expect to return a promise', (done) => {
        let playersIds;
        playersIds = ["11"];
        const resultValue = albumController.show();
        albumController.show()
            .then(() => {
                expect(resultValue).to.be.a("promise");
            })
            .then(done, done);
    });

    it('expect to have players ids', (done) => {
        let playersIds;
        playersIds = ["11"];

        albumController.show()
                .then(() => {
                    expect(playersIds).to.have.ownProperty('id');
                })
                .then(done, done);
        
    });
});
