import {expect} from 'chai';
import {Service} from "./Service";
import {Inject} from "./Inject";
import * as angular from "angular";
import * as ng from "angular";
import {ClassFactory} from "./ClassFactory";

describe('Inject', () => {

    const MODULE_NAME = 'inject.test';
    const module = angular.module(MODULE_NAME, []);

    it('should be defined', () => {

        expect(Inject).not.to.be.undefined;
    });

    it('should not throw', () => {

        expect(() => Inject('$q')(class C {
        })).not.to.throw();
    });

    it('should add static $inject property with corresponding dependencies', () => {

        const dependencies = ['$q', '$timeout'];

        @Inject(...dependencies)
        class C {
        }

        expect(C).to.have.property('$inject').that.eqls(dependencies);
    });

    beforeEach(() => angular.mock.module(MODULE_NAME));

    describe('Service', () => {

        @Service(module)
        class DService {
        }

        @Inject()
        @Service(module)
        class CService {
            constructor(@Inject('$q') protected $q: ng.IQService,
                        protected dService: DService) {
            }
        }

        const $q: new () => ng.IQService = (() => {}) as any;
        class $QService extends $q { private constructor() { super(); } static $injectName = '$q' }

        @Service(module)
        class BService {
            constructor(@Inject('$q') protected $q: $QService,
                        @Inject(CService) protected cService: CService) {

            }
        }

        @Inject('$q', BService)
        @Service(module, 'aService')
        class AService {
            constructor(protected $q: ng.IQService,
                        protected bService: BService) {
            }
        }

        let aService: AService;

        beforeEach(angular.mock.inject((_aService_) => {

            aService = _aService_;
        }));

        it('should inject appropriate services', () => {

            expect(aService).to.have.property('$q');
            expect(aService).to.have.property('bService').that.is.an.instanceof(BService);
            expect(aService).to.have.property('bService')
                .that.have.property('$q');
            expect(aService).to.have.property('bService')
                .that.have.property('cService')
                .that.have.property('dService');
        });

    });

    describe('ClassFactory', () => {

        @ClassFactory(module, 'User')
        class User {

            @Inject('$q')
            $q: ng.IQService;

            constructor(public name: string) {
            }
        }

        let _User: typeof User;

        beforeEach(angular.mock.inject((_User_) => {

            _User = _User_;
        }));

        it('should inject appropriate services inline', () => {

            expect(_User.prototype).to.have.property('$q');
        });

    });

});
