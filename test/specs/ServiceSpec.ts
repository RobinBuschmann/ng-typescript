import ServiceA = at.test.ServiceA;

describe('@Service', () => {

    const expect = chai.expect;

    let serviceA: ServiceA = null;

    beforeEach(() => angular.mock.module(at.test.MODULE_NAME));

    beforeEach(angular.mock.inject((_serviceA_) => {

        serviceA = _serviceA_;
    }));

    it('should be defined', () => {

        expect(at.Service).to.be.instanceOf(Function);
    });

    it('should instantiate decorated class as new service', () => {

        expect(serviceA).to.be.instanceOf(at.test.ServiceA);
    });

    it('should have property "name" with specified name', () => {

        expect(serviceA.name).not.to.be.undefined;
        expect(serviceA.name).to.equals(at.test.SERVICE_A_NAME);
    });

    it('should have functions "getName" and "setName"', () => {

        expect(serviceA.getName).to.be.a('function');
        expect(serviceA.setName).to.be.a('function');
    });

});
