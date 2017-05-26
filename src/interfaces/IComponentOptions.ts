import {IModule} from "angular";

export interface IComponentOptions {
    selector: string;
    templateUrl?: string;
    template?: string;
    transclude?: boolean;
    controllerAs?: string;
    moduleName?: string;
    module?: IModule;

    // Has no functional reason: It is an easier way to
    // set the dependent directives/components. So instead
    // of importing them like "import './path/to/Component'"
    // we can now use:

    //       "import {Component} from './path/to/Component'"

    // and add "Component" to the directives array. If we
    // wouldn't add the "Component" reference, the ts -
    // compiler would identify "Component" as unused and
    // simply ignore this dependency and would not
    // importing it
    directives?: Array<any>;
}
