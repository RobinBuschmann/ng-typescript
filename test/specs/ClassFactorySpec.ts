import Human = at.test.Human;

describe('@ClassFactory', () => {

    const expect = chai.expect;
    const ELISA_NAME = 'elisa';
    const ELISA_AGE = 24;

    let _Human: typeof Human = null;
    let elisa: Human = null;

    beforeEach(() => angular.mock.module(at.test.MODULE_NAME));

    beforeEach(angular.mock.inject((__Human_) => {

        _Human = __Human_;
        elisa = new _Human(ELISA_NAME, ELISA_AGE);
    }));

    it('should be defined', () => {

        expect(at.ClassFactory).to.be.instanceOf(Function);
    });

    it('should inject decorated class', () => {

        expect(_Human).to.be.instanceOf(Function);
    });

    it('should be an instance of Human', () => {

        expect(elisa).to.be.instanceOf(_Human);
    });

    it('should have getters and setter', () => {

        expect(elisa.getName()).to.equals(ELISA_NAME);
        expect(elisa.getAge()).to.equals(ELISA_AGE);
    });

    it('should have injected service', () => {

        expect(elisa.$$serviceA).to.be.instanceOf(at.test.ServiceA);
    });

});
