import {expect} from 'chai';
import * as angular from "angular";
import {ClassFactory} from "./ClassFactory";

describe('ClassFactory', () => {

    const MODULE_NAME = 'classFactory.test';
    const module = angular.module(MODULE_NAME, []);

    beforeEach(() => angular.mock.module(MODULE_NAME));


    @ClassFactory(module, 'User')
    class User {

        constructor(public name: string) {
        }
    }

    let _User: typeof User;

    beforeEach(angular.mock.inject((_User_) => {

        _User = _User_;
    }));

    it('should be defined', () => {

        expect(ClassFactory).not.to.be.undefined;
    });

    it('should not throw', () => {

        expect(() => ClassFactory(module)(class C {})).not.to.throw();
    });

    it('should inject annotated class', () => {

        expect(_User).to.equal(User);
    });


});
