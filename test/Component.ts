///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>


namespace at.test {

    export const COMPONENT_NAME = 'component';

    @at.Component({
        componentName: COMPONENT_NAME,
        moduleName: MODULE_NAME
    })
    @at.Inject('serviceA', 'serviceB')
    export class Component implements at.IPostLink, at.IPreLink, at.IDestroy{

        @at.RequiredCtrl('^attr')
        attrCtrl: AttrController;

        @at.RequiredCtrl('^attr2')
        attr2Ctrl: Attr2Controller;

        @at.Input()
        someAttribute: string;

        @at.Attribute({name: 'anotherAttribute'})
        anotherNum: number;

        @at.Output({eventParamNames: ['$someAttribute']})
        someListener: (params: {$someAttribute: string}) => {};

        constructor() {

            if(this.someListener) this.someListener({$someAttribute: this.someAttribute});
        }

        onPostLink(element: JQuery) {}

        onPreLink(element: JQuery) {}

        onDestroy() {}

    }
}
