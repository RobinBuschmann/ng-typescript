///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>


namespace at.test {

    export const SERVICE_B_NAME = 'serviceB';

    @at.Service(MODULE_NAME, SERVICE_B_NAME)
    export class ServiceB {

    }
}
