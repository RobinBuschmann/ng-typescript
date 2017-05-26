import {IComponentOptions} from "./IComponentOptions";
import {IDirectiveFactory} from "angular";

export interface IComponentDirective extends IComponentOptions, IDirectiveFactory {

    controller: Function;
    scope: any;
    require: Array<string>;
}
