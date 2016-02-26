module at {

  import IModule = angular.IModule;

  interface IComponentDirective extends IComponentOptions {
    controller: Function|{prototype:{__componentAttributes:any;__componentRequirements:Array<string>}};
    scope: any;
    require: Array<string>;
  }

  export interface IComponentOptions {
    templateUrl?: string;
    template?: string;
    controllerAs?: string;
    moduleName?: string;
    module?: IModule;
    selector: string;
    delegate?: typeof Delegate;
  }

  var componentDefaultOptions = {
    restrict: 'E',
    controllerAs: 'vm',
    transclude: true,
    bindToController: true,
    controller: null
  };

  export interface IPreLink {
    onPreLink: (element: JQuery) => void;
  }
  export interface IPostLink {
    onPostLink: (element: JQuery) => void;
  }

  let delegateHandleMeta = {
    name: "delegateHandle",
    binding: "=",
    isOptional: true,
    scopeHash: "=?"
  };

  export function Component(options: IComponentOptions): at.IClassAnnotationDecorator {
    return (target: Function) => {

      var config: IComponentDirective =
        angular.extend({}, componentDefaultOptions, options || {});

      target['__componentSelector'] = options.selector;

      // attribute meta data is defined through Attribute annotation
      let attributeMeta = target.prototype.__componentAttributes || [];

      config.controller = target;
      config.scope = {};

      let factory;
      let delegateService;

      // process delegate stuff, if defined
      if (options.delegate) {

        if (!(<any>options.delegate.prototype).__delegateServiceName) {

          throw new Error(`Delegate must have DelegateService annotation`);
        }

        /**
         * @ngdoc directive
         * @name delegateHandle
         * @type string
         * @restrict A
         * @description Delegate handle key, which allows a consumer of a component,
         *              to interact via a delegate with a component
         */
        attributeMeta.push(delegateHandleMeta);

        // if delegate is defined, inject the specified delegate by its service name
        factory = [(<any>options.delegate.prototype).__delegateServiceName, (__delegateService) => {
          delegateService = __delegateService;
          return config;
        }]
      } else {

        factory = () => config;
      }

      // set scope hashes for controller scope
      angular.forEach(attributeMeta, meta => {
        config.scope[meta.propertyName] = meta.scopeHash;
      });

      // If onPreLink or onPostLink is implemented by targets
      // prototype, prepare these events:
      if (target.prototype.onPreLink || target.prototype.onPostLink || options.delegate) {

        let link: {pre?: Function; post?: Function} = {};

        if (target.prototype.onPreLink || options.delegate) {
          link.pre = (scope, element, attrs, componentInstance) => {
            if (componentInstance.onPreLink) componentInstance.onPreLink(element);
            if (delegateService) delegateService.registerComponentInstance(componentInstance, componentInstance.delegateHandle);
            if (delegateService) scope.$on('$destroy', () => delegateService.removeDelegate(componentInstance.delegateHandle));
          }
        }
        if (target.prototype.onPostLink) {
          link.post = (scope, element, attrs, componentInstance) => {
            if (componentInstance.onPostLink) componentInstance.onPostLink(element);
          }
        }

        (<any>config).compile = () => link;
      }

      if (!config.moduleName && !config.module) {

        throw new Error('Either "moduleName" or "module" has to be defined')
      }

      angular.module(config.moduleName || config.module.name)
        .directive(config.selector, factory);
    }
  }
}
