

import Component = at.test.Component;
import AttrController = at.test.AttrController;
describe('@Component', () => {

    const expect = chai.expect;
    const SOME_STRING = 'elisa';
    const SOME_NUMBER = 1234;
    const SOME_LISTENER = sinon.spy();

    let $scope: ng.IScope|any;
    let componentElement: ng.IAugmentedJQuery = null;
    let componentController: Component = null;

    beforeEach(() => angular.mock.module(at.test.MODULE_NAME));

    beforeEach(angular.mock.inject(($controller, $rootScope, $compile) => {

        // prepare scope
        $scope = $rootScope.$new();
        $scope.someString = SOME_STRING;
        $scope.someListener = SOME_LISTENER;
        $scope.someNumber = SOME_NUMBER;

        // prepare Component for spies
        // (wraps original functions in a sinon spy)
        Component.prototype.onPreLink = sinon.spy(Component.prototype.onPreLink);
        Component.prototype.onPostLink = sinon.spy(Component.prototype.onPostLink);
        Component.prototype.onDestroy = sinon.spy(Component.prototype.onDestroy);

        // create and compile component element
        componentElement = angular.element(`
                    <component attr
                               attr2
                               some-attribute="someString"
                               another-attribute="someNumber"
                               some-listener="someListener($someAttribute)"></component>
                               `);
        $compile(componentElement)($scope);
        $rootScope.$digest();

        // retrieve component controller instance from element
        componentController = componentElement.controller("component");

    }));

    it('should be instance of Component', () => {

        expect(componentController).to.be.instanceOf(at.test.Component);
    });

    it('should have attribute with specified value', () => {

        expect(componentController.someAttribute).to.equal(SOME_STRING);
    });

    it('should have attribute (which has a different name than the controller property) with specified value', () => {

        expect(componentController.anotherNum).to.equal(SOME_NUMBER);
    });

    it('should call passed listener', () => {

        expect(SOME_LISTENER).to.has.been.called;
        expect(SOME_LISTENER).to.has.been.calledWith(SOME_STRING);
    });

    it('should call onPreLink', () => {

        expect(componentController.onPreLink).to.has.been.calledWith(componentElement);
    });

    it('should call onPostLink', () => {

        expect(componentController.onPostLink).to.has.been.calledWith(componentElement);
    });

    it('should call onDestroy', () => {

        $scope.$destroy();
        expect(componentController.onDestroy).to.has.been.called;
    });

    it('should not call onDestroy', () => {

        expect(componentController.onDestroy).not.to.been.called;
    });

    it('should call component events (onPreLink, onPostLink) in order', () => {

        expect(componentController.onPreLink).to.has.been.calledBefore(<any>componentController.onPostLink);
    });

    it('should have attrCtrl, which is an instance of AttrController', () => {

        expect(componentController.attrCtrl).to.be.instanceOf(at.test.AttrController);
    });

    it('should have attr2Ctrl, which is an instance of Attr2Controller', () => {

        expect(componentController.attr2Ctrl).to.be.instanceOf(at.test.Attr2Controller);
    });

});
