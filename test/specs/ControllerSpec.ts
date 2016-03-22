import Controller = at.test.Controller;
describe('@Controller', () => {

    const expect = chai.expect;

    let $scope = null;
    let controller: Controller = null;

    beforeEach(() => angular.mock.module(at.test.MODULE_NAME));

    beforeEach(angular.mock.inject(($controller, $rootScope) => {

        $scope = $rootScope.$new();

        controller = $controller(at.test.CONTROLLER_NAME, {$scope});
    }));

    it('should be defined', () => {

        expect(at.Controller).to.be.instanceOf(Function);
    });

    it('should instantiate decorated class', () => {

        expect(controller).to.be.instanceOf(at.test.Controller);
    });

    it('should have property "name" with specified name', () => {

        expect(controller.name).not.to.be.undefined;
        expect(controller.name).to.equals(at.test.CONTROLLER_NAME);
    });

    it('should have functions "getName" and "setName"', () => {

        expect(controller.getName).to.be.a('function');
        expect(controller.setName).to.be.a('function');
    });

});
