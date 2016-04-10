///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>


namespace at.test {

    export const RESOLVED_SOME_ATTRIBUTE = 'hello, I\'m pretty well reolved';
    export const RESOLVED_ANOTHER_ATTRIBUTE = 1234;
    export const APP_STATE_NAME = 'app';
    export const APP_STATE_URL = '/';
    export const APP_STATE_DEFER_INTERCEPT = true;
    export const APP_STATE_OTHERWISE = '/';
    export const ION_STATE_NAME = 'ion';
    export const ION_STATE_URL = '/ion';
    export const ION_STATE_DEFER_INTERCEPT = false;

    @at.RouteConfig({
        module,
        stateConfigs: [
            {
                name: APP_STATE_NAME,
                url: APP_STATE_URL,

                component: Component,
                resolve: {
                    someAttribute: () => RESOLVED_SOME_ATTRIBUTE,
                    anotherAttribute: () => RESOLVED_ANOTHER_ATTRIBUTE
                },

                views: {
                    main: {
                        component: Component,
                        resolve: {
                            someAttribute: () => RESOLVED_SOME_ATTRIBUTE,
                            anotherAttribute: () => RESOLVED_ANOTHER_ATTRIBUTE
                        }
                    }
                }
            },
            {
                name: ION_STATE_NAME,
                url: ION_STATE_URL,

                ionView: IonViewA,

                views: {
                    main: {
                        ionView: IonViewA
                    }
                }
            }
        ],
        deferIntercept: APP_STATE_DEFER_INTERCEPT,
        otherwise: APP_STATE_OTHERWISE
    })
    export class App {
    }
}
