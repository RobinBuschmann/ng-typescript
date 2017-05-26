import {IAttributeOptions} from "../interfaces/IAttributeOptions";
import {Attribute} from "./Attribute";
import {IInputOptions} from "../interfaces/IInputOptions";

/**
 * Prepares input attribute for component directives.
 */
export function Input(options: IInputOptions = {}): PropertyDecorator {

    (options as IAttributeOptions).binding = '<';

    return Attribute(options);
}
