"use strict";
var coreservices_1 = require("../common/coreservices");
/**
 * A [[TransitionHookFn]] that performs lazy loading
 *
 * When entering a state "abc" which has a `lazyLoad` function defined:
 * - Invoke the `lazyLoad` function (unless it is already in process)
 *   - Flag the hook function as "in process"
 *   - The function should return a promise (that resolves when lazy loading is complete)
 * - Wait for the promise to settle
 *   - If the promise resolves to a [[LazyLoadResult]], then register those states
 *   - Flag the hook function as "not in process"
 * - If the hook was successful
 *   - Remove the `lazyLoad` function from the state declaration
 * - If all the hooks were successful
 *   - Retry the transition (by returning a TargetState)
 *
 * ```
 * .state('abc', {
 *   component: 'fooComponent',
 *   lazyLoad: () => System.import('./fooComponent')
 *   });
 * ```
 *
 * See [[StateDeclaration.lazyLoad]]
 */
var lazyLoadHook = function (transition) {
    var lazyStates = transition.entering().filter(function (state) { return !!state.lazyLoad; }).map(function (state) { return state.name; });
    var transitionSource = function (trans) {
        return trans.redirectedFrom() ? transitionSource(trans.redirectedFrom()) : trans.options().source;
    };
    function retryOriginalTransition() {
        if (transitionSource(transition) === 'url') {
            var $loc = coreservices_1.services.location, path_1 = $loc.path(), search_1 = $loc.search(), hash_1 = $loc.hash();
            var matchState = function (state) {
                return [state, state.url && state.url.exec(path_1, search_1, hash_1)];
            };
            var matches = transition.router.stateRegistry.get()
                .map(function (s) { return s.$$state(); })
                .map(matchState)
                .filter(function (_a) {
                var state = _a[0], params = _a[1];
                return !!params;
            })
                .filter(function (_a) {
                var state = _a[0], params = _a[1];
                return lazyStates.some(function (lazyState) { return !!state.name.match(lazyState.replace('.**', '.*')); });
            });
            if (matches.length) {
                var _a = matches[0], state = _a[0], params = _a[1];
                return transition.router.stateService.target(state, params, transition.options());
            }
            transition.router.urlRouter.sync();
            return;
        }
        // The original transition was not triggered via url sync
        // The lazy state should be loaded now, so re-try the original transition
        var orig = transition.targetState();
        return transition.router.stateService.target(orig.identifier(), orig.params(), orig.options());
    }
    var promises = transition.entering()
        .filter(function (state) { return !!state.lazyLoad; })
        .map(function (state) { return lazyLoadState(transition, state); });
    return coreservices_1.services.$q.all(promises).then(retryOriginalTransition);
};
exports.registerLazyLoadHook = function (transitionService) {
    return transitionService.onBefore({ entering: function (state) { return !!state.lazyLoad; } }, lazyLoadHook);
};
/**
 * Invokes a state's lazy load function
 *
 * @param transition a Transition context
 * @param state the state to lazy load
 * @returns A promise for the lazy load result
 */
function lazyLoadState(transition, state) {
    var lazyLoadFn = state.lazyLoad;
    // Store/get the lazy load promise on/from the hookfn so it doesn't get re-invoked
    var promise = lazyLoadFn['_promise'];
    if (!promise) {
        var success = function (result) {
            delete state.lazyLoad;
            delete state.$$state().lazyLoad;
            delete lazyLoadFn['_promise'];
            return result;
        };
        var error = function (err) {
            delete lazyLoadFn['_promise'];
            return coreservices_1.services.$q.reject(err);
        };
        promise = lazyLoadFn['_promise'] =
            coreservices_1.services.$q.when(lazyLoadFn(transition, state))
                .then(updateStateRegistry)
                .then(success, error);
    }
    /** Register any lazy loaded state definitions */
    function updateStateRegistry(result) {
        if (result && Array.isArray(result.states)) {
            result.states.forEach(function (state) { return transition.router.stateRegistry.register(state); });
        }
        return result;
    }
    return promise;
}
exports.lazyLoadState = lazyLoadState;
//# sourceMappingURL=lazyLoad.js.map