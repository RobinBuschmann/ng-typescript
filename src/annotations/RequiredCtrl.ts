import {REQUIRED_CTRL_KEY} from "../ng-typescript";

/**
 * Processes required controller for components property.
 * Property is initialized with controller instance
 * of required component or directive through preLink.
 */
export function RequiredCtrl(option: string): PropertyDecorator {

    return (target: any, key: string) => {

        let requiredControllersMeta = Reflect.getMetadata(REQUIRED_CTRL_KEY, target);

        if (!requiredControllersMeta) {

            requiredControllersMeta = [];
            Reflect.defineMetadata(REQUIRED_CTRL_KEY, requiredControllersMeta, target);
        }

        // Add required controller meta data to the component meta data;
        requiredControllersMeta.push({key, option});
    }
}
