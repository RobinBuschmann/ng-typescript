///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>

namespace at.test {

    export const CONTROLLER_NAME = 'controller';

    @at.Controller(MODULE_NAME, CONTROLLER_NAME)
    @at.Inject('serviceA', ServiceB)
    export class Controller {

        name: string;

        constructor(public serviceA: ServiceA, public serviceB: ServiceB) {

            this.name = CONTROLLER_NAME;
        }

        getName() {

            return this.name;
        }

        setName(name: string) {

            this.name = name;
        }

    }
}
