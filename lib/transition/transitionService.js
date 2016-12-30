"use strict";
/** @coreapi @module transition */ /** for typedoc */
var interface_1 = require("./interface");
var transition_1 = require("./transition");
var hookRegistry_1 = require("./hookRegistry");
var resolve_1 = require("../hooks/resolve");
var views_1 = require("../hooks/views");
var url_1 = require("../hooks/url");
var redirectTo_1 = require("../hooks/redirectTo");
var onEnterExitRetain_1 = require("../hooks/onEnterExitRetain");
var lazyLoad_1 = require("../hooks/lazyLoad");
var transitionHookType_1 = require("./transitionHookType");
var transitionHook_1 = require("./transitionHook");
var predicates_1 = require("../common/predicates");
/**
 * The default [[Transition]] options.
 *
 * Include this object when applying custom defaults:
 * let reloadOpts = { reload: true, notify: true }
 * let options = defaults(theirOpts, customDefaults, defaultOptions);
 */
exports.defaultTransOpts = {
    location: true,
    relative: null,
    inherit: false,
    notify: true,
    reload: false,
    custom: {},
    current: function () { return null; },
    source: "unknown"
};
/**
 * This class provides services related to Transitions.
 *
 * - Most importantly, it allows global Transition Hooks to be registered.
 * - It allows the default transition error handler to be set.
 * - It also has a factory function for creating new [[Transition]] objects, (used internally by the [[StateService]]).
 *
 * At bootstrap, [[UIRouter]] creates a single instance (singleton) of this class.
 */
var TransitionService = (function () {
    function TransitionService(_router) {
        this._router = _router;
        /** @hidden The transition hook types, such as `onEnter`, `onStart`, etc */
        this._transitionHookTypes = [];
        /** @hidden The registered transition hooks */
        this._transitionHooks = {};
        this.$view = _router.viewService;
        this._deregisterHookFns = {};
        this.registerTransitionHookTypes();
        this.registerTransitionHooks();
    }
    /**
     * Creates a new [[Transition]] object
     *
     * This is a factory function for creating new Transition objects.
     * It is used internally by the [[StateService]] and should generally not be called by application code.
     *
     * @param fromPath the path to the current state (the from state)
     * @param targetState the target state (destination)
     * @returns a Transition
     */
    TransitionService.prototype.create = function (fromPath, targetState) {
        return new transition_1.Transition(fromPath, targetState, this._router);
    };
    /** @hidden */
    TransitionService.prototype.registerTransitionHookTypes = function () {
        var _this = this;
        var Scope = interface_1.TransitionHookScope;
        var Phase = interface_1.TransitionHookPhase;
        var TH = transitionHook_1.TransitionHook;
        var hookTypes = [
            new transitionHookType_1.TransitionHookType("onCreate", Phase.CREATE, Scope.TRANSITION, 0, "to", false, TH.IGNORE_RESULT, TH.THROW_ERROR, false),
            new transitionHookType_1.TransitionHookType("onBefore", Phase.BEFORE, Scope.TRANSITION, 0, "to", false, TH.HANDLE_RESULT),
            new transitionHookType_1.TransitionHookType("onStart", Phase.ASYNC, Scope.TRANSITION, 0, "to"),
            new transitionHookType_1.TransitionHookType("onExit", Phase.ASYNC, Scope.STATE, 10, "exiting", true),
            new transitionHookType_1.TransitionHookType("onRetain", Phase.ASYNC, Scope.STATE, 20, "retained"),
            new transitionHookType_1.TransitionHookType("onEnter", Phase.ASYNC, Scope.STATE, 30, "entering"),
            new transitionHookType_1.TransitionHookType("onFinish", Phase.ASYNC, Scope.TRANSITION, 40, "to"),
            new transitionHookType_1.TransitionHookType("onSuccess", Phase.SUCCESS, Scope.TRANSITION, 0, "to", false, TH.IGNORE_RESULT, TH.LOG_ERROR, false),
            new transitionHookType_1.TransitionHookType("onError", Phase.ERROR, Scope.TRANSITION, 0, "to", false, TH.IGNORE_RESULT, TH.LOG_ERROR, false),
        ];
        hookTypes.forEach(function (type) { return _this[type.name] = _this.registerTransitionHookType(type); });
    };
    /**
     * Defines a transition hook type and returns a transition hook registration
     * function (which can then be used to register hooks of this type).
     * @internalapi
     */
    TransitionService.prototype.registerTransitionHookType = function (hookType) {
        this._transitionHookTypes.push(hookType);
        return hookRegistry_1.makeHookRegistrationFn(this._transitionHooks, hookType);
    };
    TransitionService.prototype.getTransitionHookTypes = function (phase) {
        var transitionHookTypes = predicates_1.isDefined(phase) ?
            this._transitionHookTypes.filter(function (type) { return type.hookPhase === phase; }) :
            this._transitionHookTypes.slice();
        return transitionHookTypes.sort(function (l, r) {
            var byphase = l.hookPhase - r.hookPhase;
            return byphase === 0 ? l.hookOrder - r.hookOrder : byphase;
        });
    };
    /** @hidden */
    TransitionService.prototype.getHooks = function (hookName) {
        return this._transitionHooks[hookName];
    };
    /** @hidden */
    TransitionService.prototype.registerTransitionHooks = function () {
        var fns = this._deregisterHookFns;
        // Wire up redirectTo hook
        fns.redirectTo = redirectTo_1.registerRedirectToHook(this);
        // Wire up onExit/Retain/Enter state hooks
        fns.onExit = onEnterExitRetain_1.registerOnExitHook(this);
        fns.onRetain = onEnterExitRetain_1.registerOnRetainHook(this);
        fns.onEnter = onEnterExitRetain_1.registerOnEnterHook(this);
        // Wire up Resolve hooks
        fns.eagerResolve = resolve_1.registerEagerResolvePath(this);
        fns.lazyResolve = resolve_1.registerLazyResolveState(this);
        // Wire up the View management hooks
        fns.loadViews = views_1.registerLoadEnteringViews(this);
        fns.activateViews = views_1.registerActivateViews(this);
        // After globals.current is updated at priority: 10000
        fns.updateUrl = url_1.registerUpdateUrl(this);
        // Lazy load state trees
        fns.lazyLoad = lazyLoad_1.registerLazyLoadHook(this);
    };
    return TransitionService;
}());
exports.TransitionService = TransitionService;
//# sourceMappingURL=transitionService.js.map