import {IAttributeOptions} from "../interfaces/IAttributeOptions";
import {Attribute} from "./Attribute";
import {IOutputOptions} from "../interfaces/IOutputOptions";

/**
 * Prepares output attributes for component directives.
 * The consumer of the corresponding component can pass
 * event listeners to this attribute. This attribute is
 * defined for a specified action. Every time this action
 * occurs, the event listener will be executed.
 */
export function Output(options: IOutputOptions = {}): PropertyDecorator {

    // Attribute defaults for listener
    (options as IAttributeOptions).isOptional = true;
    (options as IAttributeOptions).binding = '&';

    return Attribute(options);
}
