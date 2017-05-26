import {expect} from 'chai';
import {Component} from "./Component";
import * as angular from "angular";
import {IAugmentedJQuery} from "angular";

describe('Component', () => {

    const MODULE_NAME = 'component.test';
    const COMPONENT_SELECTOR = 'test-app';
    const module = angular.module(MODULE_NAME, []);

    @Component({
        selector: COMPONENT_SELECTOR,
        module
    })
    class TestComponent {}

    let componentController: TestComponent = null;

    beforeEach(() => angular.mock.module(MODULE_NAME));

    beforeEach(inject(($controller, $rootScope, $compile) => {

        // prepare scope
        const $scope = $rootScope.$new();

        // create and compile component element
        const componentElement: IAugmentedJQuery = angular.element(`<${COMPONENT_SELECTOR}></${COMPONENT_SELECTOR}>`);
        $compile(componentElement)($scope);
        $rootScope.$digest();

        // retrieve component controller instance from element
        componentController = componentElement.controller(COMPONENT_SELECTOR);

    }));

    it('should be defined', () => {

        expect(Component).not.to.be.undefined;
    });

    it('should not throw', () => {

        expect(() => Component({
            selector: 'a',
            module: angular.module('_', [])
        })(class C {})).not.to.throw();
    });

    it('should create component controller instance', () => {

        expect(componentController).to.be.an.instanceof(TestComponent);
    });
});
