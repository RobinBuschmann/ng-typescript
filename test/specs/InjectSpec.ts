
describe('@Inject', () => {

    const expect = chai.expect;

    let $scope = null;
    let controller: at.test.Controller = null;

    beforeEach(() => angular.mock.module(at.test.MODULE_NAME));

    beforeEach(angular.mock.inject(($controller, $rootScope) => {

        $scope = $rootScope.$new();

        controller = $controller(at.test.CONTROLLER_NAME, {$scope});
    }));

    it('should assign proper $inject array to service constructor', () => {

        expect(at.test.Controller.$inject).to.deep.equal([at.test.SERVICE_A_NAME, at.test.SERVICE_B_NAME]);
    });

    it('should have public accessable dependencies', () => {

        expect(controller.serviceA).to.be.instanceOf(at.test.ServiceA);
        expect(controller.serviceB).to.be.instanceOf(at.test.ServiceB);
        expect(controller.serviceA.serviceB).to.be.instanceOf(at.test.ServiceB);
    });

});
