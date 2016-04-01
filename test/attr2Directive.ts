///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>


namespace at.test {
    
    export class Attr2Controller {
        
    }
    
    angular.module(MODULE_NAME).directive('attr2', () => {

        return {
            controllerAs: 'vm',
            controller: Attr2Controller,
            link: function (scope, element, attr, controllers) {}
        }
    })
}
