import {IComponentState} from "./IComponentState";
import {IModule} from "angular";

export interface IRouteConfigOptions {
    stateConfigs: Array<IComponentState>,
    module: IModule,
    conditions?: Array<{ when: string | any, then: string | Function }>,
    rules?: Array<Function>,
    otherwise?: string | Function,
    invokable?: Function | Array<string | Function>,
    deferIntercept?: boolean
}