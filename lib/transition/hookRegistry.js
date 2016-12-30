"use strict";
/** @coreapi @module transition */ /** for typedoc */
var common_1 = require("../common/common");
var predicates_1 = require("../common/predicates");
var glob_1 = require("../common/glob");
/**
 * Determines if the given state matches the matchCriteria
 *
 * @hidden
 *
 * @param state a State Object to test against
 * @param criterion
 * - If a string, matchState uses the string as a glob-matcher against the state name
 * - If an array (of strings), matchState uses each string in the array as a glob-matchers against the state name
 *   and returns a positive match if any of the globs match.
 * - If a function, matchState calls the function with the state and returns true if the function's result is truthy.
 * @returns {boolean}
 */
function matchState(state, criterion) {
    var toMatch = predicates_1.isString(criterion) ? [criterion] : criterion;
    function matchGlobs(_state) {
        var globStrings = toMatch;
        for (var i = 0; i < globStrings.length; i++) {
            var glob = new glob_1.Glob(globStrings[i]);
            if ((glob && glob.matches(_state.name)) || (!glob && globStrings[i] === _state.name)) {
                return true;
            }
        }
        return false;
    }
    var matchFn = (predicates_1.isFunction(toMatch) ? toMatch : matchGlobs);
    return !!matchFn(state);
}
exports.matchState = matchState;
/**
 * @hidden
 * The registration data for a registered transition hook
 */
var RegisteredHook = (function () {
    function RegisteredHook(hookType, matchCriteria, callback, options) {
        if (options === void 0) { options = {}; }
        this.hookType = hookType;
        this.callback = callback;
        this.matchCriteria = common_1.extend({ to: true, from: true, exiting: true, retained: true, entering: true }, matchCriteria);
        this.priority = options.priority || 0;
        this.bind = options.bind || null;
        this._deregistered = false;
    }
    RegisteredHook._matchingNodes = function (nodes, criterion) {
        if (criterion === true)
            return nodes;
        var matching = nodes.filter(function (node) { return matchState(node.state, criterion); });
        return matching.length ? matching : null;
    };
    /**
     * Determines if this hook's [[matchCriteria]] match the given [[TreeChanges]]
     *
     * @returns an IMatchingNodes object, or null. If an IMatchingNodes object is returned, its values
     * are the matching [[PathNode]]s for each [[HookMatchCriterion]] (to, from, exiting, retained, entering)
     */
    RegisteredHook.prototype.matches = function (treeChanges) {
        var mc = this.matchCriteria, _matchingNodes = RegisteredHook._matchingNodes;
        var matches = {
            to: _matchingNodes([common_1.tail(treeChanges.to)], mc.to),
            from: _matchingNodes([common_1.tail(treeChanges.from)], mc.from),
            exiting: _matchingNodes(treeChanges.exiting, mc.exiting),
            retained: _matchingNodes(treeChanges.retained, mc.retained),
            entering: _matchingNodes(treeChanges.entering, mc.entering),
        };
        // Check if all the criteria matched the TreeChanges object
        var allMatched = ["to", "from", "exiting", "retained", "entering"]
            .map(function (prop) { return matches[prop]; })
            .reduce(common_1.allTrueR, true);
        return allMatched ? matches : null;
    };
    return RegisteredHook;
}());
exports.RegisteredHook = RegisteredHook;
/** @hidden Return a registration function of the requested type. */
function makeHookRegistrationFn(registeredHooks, type) {
    var name = type.name;
    registeredHooks[name] = [];
    return function (matchObject, callback, options) {
        if (options === void 0) { options = {}; }
        var registeredHook = new RegisteredHook(type, matchObject, callback, options);
        registeredHooks[name].push(registeredHook);
        return function deregisterEventHook() {
            registeredHook._deregistered = true;
            common_1.removeFrom(registeredHooks[name])(registeredHook);
        };
    };
}
exports.makeHookRegistrationFn = makeHookRegistrationFn;
//# sourceMappingURL=hookRegistry.js.map