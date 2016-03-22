///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>


namespace at.test {

    export const SERVICE_A_NAME = 'serviceA';

    @at.Service(MODULE_NAME, SERVICE_A_NAME)
    export class ServiceA {

        name: string;

        constructor(@at.Inject('serviceB') public serviceB: at.test.ServiceB) {

            this.name = SERVICE_A_NAME;
        }

        getName() {

            return this.name;
        }

        setName(name: string) {

            this.name = name;
        }
    }
}
