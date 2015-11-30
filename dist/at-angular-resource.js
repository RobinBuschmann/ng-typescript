///<reference path="../typings/angularjs/angular.d.ts"/>
///<reference path="../typings/angularjs/angular-resource.d.ts"/>
///<reference path="at-angular.ts"/>
var at;
(function (at) {
    'use strict';
    function combineResource(instance, model) {
        angular.extend(instance, instance.$_Resource(model));
    }
    var ResourceClass = (function () {
        function ResourceClass(model) {
            combineResource(this, model);
        }
        ResourceClass.prototype.$get = function (params) { return this.$promise; };
        ResourceClass.prototype.$query = function (params) { return this.$promiseArray; };
        ResourceClass.prototype.$remove = function (params) { return this.$promise; };
        ResourceClass.prototype.$save = function (params) { return this.$promise; };
        ResourceClass.prototype.$delete = function (params) { return this.$promise; };
        return ResourceClass;
    })();
    at.ResourceClass = ResourceClass;
    function Resource(moduleName, className, url, options) {
        return function (target) {
            function resourceClassFactory($resource, $injector) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                prepareActionDataMapping(target.prototype.__rActions, $injector);
                var newResource = $resource(url, target.params, target.prototype.__rActions, options);
                return at.AttachInjects.apply(void 0, [angular.extend(newResource, angular.extend(target, newResource, {
                    prototype: angular.extend(newResource.prototype, extendWithPrototype({}, angular.extend(target.prototype, {
                        $_Resource: newResource
                    })))
                }))].concat(args));
            }
            resourceClassFactory.$inject = (['$resource', '$injector']).concat(target.$inject || []);
            angular.module(moduleName).factory(className, resourceClassFactory);
        };
    }
    at.Resource = Resource;
    function extendWithPrototype(dist, src) {
        for (var key in src) {
            if (!dist[key]) {
                dist[key] = src[key];
            }
        }
        return dist;
    }
    var REMOVE_STARTING_$_REGEX = /^\$/;
    function Action(options) {
        return function (target, key) {
            if (!target.__rActions) {
                target.__rActions = {};
            }
            key = key.replace(REMOVE_STARTING_$_REGEX, '');
            target.__rActions[key] = options;
        };
    }
    at.Action = Action;
    function prepareActionDataMapping(actions, $injector) {
        var keys = Object.keys(actions);
        keys.forEach(function (key) {
            var action = actions[key];
            if (action.mapper) {
                if (action.transformResponse) {
                    throw new Error('Both "mapper" and "transformResponse" are not working on an action');
                }
                var dependencies = [];
                if (action.mapperDependencies) {
                    action.mapperDependencies.forEach(function (key) {
                        dependencies.push($injector.get(key));
                    });
                }
                action.transformResponse = function (data) {
                    return JSON.parse(data).map(function (entry) {
                        return action.mapper.apply(null, [entry].concat(dependencies));
                    });
                };
            }
        });
    }
})(at || (at = {}));
//# sourceMappingURL=at-angular-resource.js.map