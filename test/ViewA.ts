///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>


namespace at.test {

    export const VIEW_VIEW_A_NAME = 'component';
    export const VIEW_VIEW_A_TEMPLATE = `<ion-view></ion-view>`;

    @at.View({
        template: VIEW_VIEW_A_TEMPLATE
    })
    export class ViewA {
        
        constructor() {}

        name: string = VIEW_VIEW_A_NAME;

    }
}
