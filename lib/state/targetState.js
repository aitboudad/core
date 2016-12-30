/** @coreapi @module state */ /** for typedoc */
"use strict";
var common_1 = require("../common/common");
/**
 * Encapsulate the target (destination) state/params/options of a [[Transition]].
 *
 * This class is frequently used to redirect a transition to a new destination.
 *
 * See:
 *
 * - [[HookResult]]
 * - [[TransitionHookFn]]
 * - [[TransitionService.onStart]]
 *
 * To create a `TargetState`, use [[StateService.target]].
 *
 * ---
 *
 * This class wraps:
 *
 * 1) an identifier for a state
 * 2) a set of parameters
 * 3) and transition options
 * 4) the registered state object (the [[StateDeclaration]])
 *
 * Many UI-Router APIs such as [[StateService.go]] take a [[StateOrName]] argument which can
 * either be a *state object* (a [[StateDeclaration]] or [[State]]) or a *state name* (a string).
 * The `TargetState` class normalizes those options.
 *
 * A `TargetState` may be valid (the state being targeted exists in the registry)
 * or invalid (the state being targeted is not registered).
 */
var TargetState = (function () {
    /**
     * The TargetState constructor
     *
     * Note: Do not construct a `TargetState` manually.
     * To create a `TargetState`, use the [[StateService.target]] factory method.
     *
     * @param _identifier An identifier for a state.
     *    Either a fully-qualified state name, or the object used to define the state.
     * @param _definition The internal state representation, if exists.
     * @param _params Parameters for the target state
     * @param _options Transition options.
     */
    function TargetState(_identifier, _definition, _params, _options) {
        if (_params === void 0) { _params = {}; }
        if (_options === void 0) { _options = {}; }
        this._identifier = _identifier;
        this._definition = _definition;
        this._options = _options;
        this._params = _params || {};
    }
    TargetState.prototype.name = function () {
        return this._definition && this._definition.name || this._identifier;
    };
    TargetState.prototype.identifier = function () {
        return this._identifier;
    };
    TargetState.prototype.params = function () {
        return this._params;
    };
    TargetState.prototype.$state = function () {
        return this._definition;
    };
    TargetState.prototype.state = function () {
        return this._definition && this._definition.self;
    };
    TargetState.prototype.options = function () {
        return this._options;
    };
    TargetState.prototype.exists = function () {
        return !!(this._definition && this._definition.self);
    };
    TargetState.prototype.valid = function () {
        return !this.error();
    };
    TargetState.prototype.error = function () {
        var base = this.options().relative;
        if (!this._definition && !!base) {
            var stateName = base.name ? base.name : base;
            return "Could not resolve '" + this.name() + "' from state '" + stateName + "'";
        }
        if (!this._definition)
            return "No such state '" + this.name() + "'";
        if (!this._definition.self)
            return "State '" + this.name() + "' has an invalid definition";
    };
    TargetState.prototype.toString = function () {
        return "'" + this.name() + "'" + common_1.toJson(this.params());
    };
    return TargetState;
}());
exports.TargetState = TargetState;
//# sourceMappingURL=targetState.js.map