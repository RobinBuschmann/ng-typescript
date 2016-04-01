///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>


namespace at.test {
    
    export class AttrController {
        
    }
    
    angular.module(MODULE_NAME).directive('attr', () => {

        return {
            controllerAs: 'vm',
            controller: AttrController,
            link: function (scope, element, attr, controllers) {}
        }
    })
}
