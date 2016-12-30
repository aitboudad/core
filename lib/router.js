"use strict";
/** @coreapi @module core */ /** */
var urlMatcherFactory_1 = require("./url/urlMatcherFactory");
var urlRouter_1 = require("./url/urlRouter");
var urlRouter_2 = require("./url/urlRouter");
var transitionService_1 = require("./transition/transitionService");
var view_1 = require("./view/view");
var stateRegistry_1 = require("./state/stateRegistry");
var stateService_1 = require("./state/stateService");
var globals_1 = require("./globals");
/**
 * The master class used to instantiate an instance of UI-Router.
 *
 * UI-Router (for a specific framework) will create an instance of this class during bootstrap.
 * This class instantiates and wires the UI-Router services together.
 *
 * After a new instance of the UIRouter class is created, it should be configured for your app.
 * For instance, app states should be registered with the [[stateRegistry]].
 *
 * Tell UI-Router to monitor the URL by calling `uiRouter.urlRouter.listen()` ([[UrlRouter.listen]])
 */
var UIRouter = (function () {
    function UIRouter() {
        this.viewService = new view_1.ViewService();
        this.transitionService = new transitionService_1.TransitionService(this);
        this.globals = new globals_1.Globals(this.transitionService);
        this.urlMatcherFactory = new urlMatcherFactory_1.UrlMatcherFactory();
        this.urlRouterProvider = new urlRouter_1.UrlRouterProvider(this.urlMatcherFactory, this.globals.params);
        this.urlRouter = new urlRouter_2.UrlRouter(this.urlRouterProvider);
        this.stateRegistry = new stateRegistry_1.StateRegistry(this.urlMatcherFactory, this.urlRouterProvider);
        this.stateService = new stateService_1.StateService(this);
        this._plugins = {};
        this.viewService.rootContext(this.stateRegistry.root());
        this.globals.$current = this.stateRegistry.root();
        this.globals.current = this.globals.$current.self;
    }
    /**
     * Adds a plugin to UI-Router
     *
     * This method adds a UI-Router Plugin.
     * A plugin can enhance or change UI-Router behavior using any public API.
     *
     * #### Example:
     * ```js
     * import { MyCoolPlugin } from "ui-router-cool-plugin";
     *
     * var plugin = router.addPlugin(MyCoolPlugin);
     * ```
     *
     * ### Plugin authoring
     *
     * A plugin is simply a class (or constructor function) which accepts a [[UIRouter]] instance and (optionally) an options object.
     *
     * The plugin can implement its functionality using any of the public APIs of [[UIRouter]].
     * For example, it may configure router options or add a Transition Hook.
     *
     * The plugin can then be published as a separate module.
     *
     * #### Example:
     * ```js
     * export class MyAuthPlugin {
     *   constructor(router: UIRouter, options: any) {
     *     let $transitions = router.transitionService;
     *     let $state = router.stateService;
     *
     *     let authCriteria = {
     *       to: (state) => state.data && state.data.requiresAuth
     *     };
     *
     *     function authHook(transition: Transition) {
     *       let authService = transition.injector().get('AuthService');
     *       if (!authService.isAuthenticated()) {
     *         return $state.target('login');
     *       }
     *     }
     *
     *     $transitions.onStart(authCriteria, authHook);
     *   }
     * }
     * ```
     *
     * @param pluginFactory a function which accepts a [[UIRouter]] instance and returns a UI-Router Plugin instance
     * @param options options to pass to the plugin
     * @returns {T}
     */
    UIRouter.prototype.plugin = function (pluginFactory, options) {
        if (options === void 0) { options = {}; }
        var pluginInstance = pluginFactory(this, options);
        if (!pluginInstance.name)
            throw new Error("Required property `name` missing on plugin: " + pluginInstance);
        return this._plugins[pluginInstance.name] = pluginInstance;
    };
    UIRouter.prototype.getPlugin = function (pluginName) {
        return this._plugins[pluginName];
    };
    return UIRouter;
}());
exports.UIRouter = UIRouter;
//# sourceMappingURL=router.js.map