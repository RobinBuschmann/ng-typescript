import {IViewOptions} from "../interfaces/IViewOptions";
import {VIEW_KEY} from "../ng-typescript";

interface IViewMeta extends IViewOptions {
    controller?: Function;
}

/**
 * Stores meta data for configuring a view for ui.router
 */
export function View(options: IViewOptions): ClassDecorator {
    return (target: Function) => {

        let viewMeta: IViewMeta = options;

        if (!viewMeta.controllerAs) viewMeta.controllerAs = 'vm';
        viewMeta.controller = target;

        Reflect.defineMetadata(VIEW_KEY, viewMeta, target);
    }
}
