module at {

  import IModule = angular.IModule;

  interface IComponentDirective extends IComponentOptions {
    controller: Function|{prototype:{__componentAttributes:any;__componentRequirements:Array<string>}};
    scope: any;
    require: Array<string>;
  }

  export interface IComponentOptions {
    componentName: string;
    templateUrl?: string;
    template?: string;
    controllerAs?: string;
    moduleName?: string;
    module?: IModule;
  }

  var componentDefaultOptions = {
    restrict: 'E',
    controllerAs: 'vm',
    transclude: true,
    bindToController: true,
    controller: null
  };

  export interface IPreLink {
    onPreLink: (element?: JQuery) => void;
  }
  export interface IPostLink {
    onPostLink: (element?: JQuery) => void;
  }
  export interface IDestroy {
    onDestroy: (element?: JQuery) => void;
  }

  export function Component(options: IComponentOptions): at.IClassAnnotationDecorator {
    return (target: Function) => {

      var config: IComponentDirective =
        angular.extend({}, componentDefaultOptions, options || {});

      target['__componentName'] = options.componentName;

      // attribute meta data is defined through Attribute annotation
      let attributeMeta = target.prototype.__componentAttributes || [];

      config.controller = target;
      config.scope = {};

      // set scope hashes for controller scope
      angular.forEach(attributeMeta, meta => {
        config.scope[meta.propertyName] = meta.scopeHash;
      });

      // If onPreLink or onPostLink is implemented by targets
      // prototype, prepare these events:
      if (target.prototype.onPreLink || target.prototype.onPostLink || target.prototype.onDestroy) {

        let link: {pre?: Function; post?: Function} = {};

        if (target.prototype.onPreLink || target.prototype.onDestroy) {
          link.pre = (scope, element, attrs, componentInstance) => {
            if (componentInstance.onPreLink) componentInstance.onPreLink(element);
            if (componentInstance.onDestroy) scope.$on('$destroy', () => componentInstance.onDestroy(element));
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
        .directive(config.componentName, () => config);
    }
  }
}
