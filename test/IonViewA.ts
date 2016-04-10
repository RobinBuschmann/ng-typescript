///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>


namespace at.test {

    export const ION_VIEW_A_NAME = 'component';
    export const ION_VIEW_A_TEMPLATE = `<ion-view></ion-view>`;

    @at.IonView({
        template: ION_VIEW_A_TEMPLATE
    })
    export class IonViewA {
        
        constructor() {}

        name: string = ION_VIEW_A_NAME;

    }
}
