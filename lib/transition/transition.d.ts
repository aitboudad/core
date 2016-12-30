import { StateDeclaration, StateOrName } from "../state/interface";
import { TransitionOptions, TreeChanges, IHookRegistry } from "./interface";
import { RegisteredHook } from "./hookRegistry";
import { HookBuilder } from "./hookBuilder";
import { PathNode } from "../path/node";
import { State } from "../state/stateObject";
import { TargetState } from "../state/targetState";
import { Resolvable } from "../resolve/resolvable";
import { ViewConfig } from "../view/interface";
import { UIRouter } from "../router";
import { UIInjector } from "../interface";
/**
 * Represents a transition between two states.
 *
 * When navigating to a state, we are transitioning **from** the current state **to** the new state.
 *
 * This object contains all contextual information about the to/from states, parameters, resolves.
 * It has information about all states being entered and exited as a result of the transition.
 */
export declare class Transition implements IHookRegistry {
    /** @hidden */
    static diToken: typeof Transition;
    /**
     * A unique identifier for the transition.
     *
     * This is an auto incrementing integer, starting from `0`.
     */
    $id: number;
    /**
     * A reference to the [[UIRouter]] instance
     *
     * This reference can be used to access the router services, such as the [[StateService]]
     */
    router: UIRouter;
    /** @hidden */
    private _deferred;
    /**
     * This promise is resolved or rejected based on the outcome of the Transition.
     *
     * When the transition is successful, the promise is resolved
     * When the transition is unsuccessful, the promise is rejected with the [[TransitionRejection]] or javascript error
     */
    promise: Promise<any>;
    /**
     * A boolean which indicates if the transition was successful
     *
     * After a successful transition, this value is set to true.
     * After a failed transition, this value is set to false.
     */
    success: boolean;
    /** @hidden */
    private _error;
    /** @hidden Holds the hook registration functions such as those passed to Transition.onStart() */
    private _transitionHooks;
    /** @hidden */
    private _options;
    /** @hidden */
    private _treeChanges;
    /** @hidden */
    private _targetState;
    /** @hidden */
    onBefore: any;
    /** @inheritdoc */
    onStart: any;
    /** @inheritdoc */
    onExit: any;
    /** @inheritdoc */
    onRetain: any;
    /** @inheritdoc */
    onEnter: any;
    /** @inheritdoc */
    onFinish: any;
    /** @inheritdoc */
    onSuccess: any;
    /** @inheritdoc */
    onError: any;
    /** @hidden
     * Creates the transition-level hook registration functions
     * (which can then be used to register hooks)
     */
    private createTransitionHookRegFns();
    /** @hidden @internalapi */
    getHooks(hookName: string): RegisteredHook[];
    /**
     * Creates a new Transition object.
     *
     * If the target state is not valid, an error is thrown.
     *
     * @internalapi
     *
     * @param fromPath The path of [[PathNode]]s from which the transition is leaving.  The last node in the `fromPath`
     *        encapsulates the "from state".
     * @param targetState The target state and parameters being transitioned to (also, the transition options)
     * @param router The [[UIRouter]] instance
     */
    constructor(fromPath: PathNode[], targetState: TargetState, router: UIRouter);
    private applyViewConfigs(router);
    private applyRootResolvables(router);
    /**
     * @internalapi
     *
     * @returns the internal from [State] object
     */
    $from(): State;
    /**
     * @internalapi
     *
     * @returns the internal to [State] object
     */
    $to(): State;
    /**
     * Returns the "from state"
     *
     * Returns the state that the transition is coming *from*.
     *
     * @returns The state declaration object for the Transition's ("from state").
     */
    from(): StateDeclaration;
    /**
     * Returns the "to state"
     *
     * Returns the state that the transition is  going *from*.
     *
     * @returns The state declaration object for the Transition's target state ("to state").
     */
    to(): StateDeclaration;
    /**
     * Gets the Target State
     *
     * A transition's [[TargetState]] encapsulates the [[to]] state, the [[params]], and the [[options]] as a single object.
     *
     * @returns the [[TargetState]] of this Transition
     */
    targetState(): TargetState;
    /**
     * Determines whether two transitions are equivalent.
     */
    is(compare: (Transition | {
        to?: any;
        from?: any;
    })): boolean;
    /**
     * Gets transition parameter values
     *
     * Returns the parameter values for a transition as key/value pairs.
     *
     * By default, returns the new parameter values (for the "to state").
     * To return the previous parameter values,  supply `'from'` as the `pathname` argument.
     *
     * @param pathname the name of the treeChanges path to get parameter values for:
     *   (`'to'`, `'from'`, `'entering'`, `'exiting'`, `'retained'`)
     *
     * @returns transition parameter values for the desired path.
     */
    params(pathname?: string): {
        [key: string]: any;
    };
    /**
     * Creates a [[UIInjector]] Dependency Injector
     *
     * Returns a Dependency Injector for the Transition's target state (to state).
     * The injector provides resolve values which the target state has access to.
     *
     * The `UIInjector` can also provide values from the native root/global injector (ng1/ng2).
     *
     * If a `state` is provided, the injector that is returned will be limited to resolve values that the provided state has access to.
     *
     * @param state Limits the resolves provided to only the resolves the provided state has access to.
     * @returns a [[UIInjector]]
     */
    injector(state?: StateOrName): UIInjector;
    /**
     * Gets all available resolve tokens (keys)
     *
     * This method can be used in conjunction with [[getResolve]] to inspect the resolve values
     * available to the Transition.
     *
     * The returned tokens include those defined on [[StateDeclaration.resolve]] blocks, for the states
     * in the Transition's [[TreeChanges.to]] path.
     *
     * @param pathname resolve context's path name (e.g., `to` or `from`)
     *
     * @returns an array of resolve tokens (keys)
     */
    getResolveTokens(pathname?: string): any[];
    /**
     * Gets resolved values
     *
     * This method can be used in conjunction with [[getResolveTokens]] to inspect what resolve values
     * are available to the Transition.
     *
     * Given a token, returns the resolved data for that token.
     * Given an array of tokens, returns an array of resolved data for those tokens.
     *
     * If a resolvable hasn't yet been fetched, returns `undefined` for that token
     * If a resolvable doesn't exist for the token, throws an error.
     *
     * @param token the token (or array of tokens)
     * @param pathname resolve context's path name (e.g., `to` or `from`)
     *
     * @returns an array of resolve tokens (keys)
     */
    getResolveValue(token: any[], pathname?: string): any[];
    getResolveValue(token: any, pathname?: string): any;
    /**
     * Gets a [[Resolvable]] primitive
     *
     * This is a lower level API that returns a [[Resolvable]] from the Transition for a given token.
     *
     * @param token the DI token
     * @param pathname resolve context's path name (e.g., `to` or `from`)
     *
     * @returns the [[Resolvable]] in the transition's to path, or undefined
     */
    getResolvable(token: any, pathname?: string): Resolvable;
    /**
     * Dynamically adds a new [[Resolvable]] (`resolve`) to this transition.
     *
     * @param resolvable an [[Resolvable]] object
     * @param state the state in the "to path" which should receive the new resolve (otherwise, the root state)
     */
    addResolvable(resolvable: Resolvable, state?: StateOrName): void;
    /**
     * If the current transition is a redirect, returns the transition that was redirected.
     *
     * Gets the transition from which this transition was redirected.
     *
     *
     * #### Example:
     * ```js
     * let transitionA = $state.go('A').transitionA
     * transitionA.onStart({}, () => $state.target('B'));
     * $transitions.onSuccess({ to: 'B' }, (trans) => {
     *   trans.to().name === 'B'; // true
     *   trans.redirectedFrom() === transitionA; // true
     * });
     * ```
     *
     * @returns The previous Transition, or null if this Transition is not the result of a redirection
     */
    redirectedFrom(): Transition;
    /**
     * Get the transition options
     *
     * @returns the options for this Transition.
     */
    options(): TransitionOptions;
    /**
     * Gets the states being entered.
     *
     * @returns an array of states that will be entered during this transition.
     */
    entering(): StateDeclaration[];
    /**
     * Gets the states being exited.
     *
     * @returns an array of states that will be exited during this transition.
     */
    exiting(): StateDeclaration[];
    /**
     * Gets the states being retained.
     *
     * @returns an array of states that are already entered from a previous Transition, that will not be
     *    exited during this Transition
     */
    retained(): StateDeclaration[];
    /**
     * Get the [[ViewConfig]]s associated with this Transition
     *
     * Each state can define one or more views (template/controller), which are encapsulated as `ViewConfig` objects.
     * This method fetches the `ViewConfigs` for a given path in the Transition (e.g., "to" or "entering").
     *
     * @param pathname the name of the path to fetch views for:
     *   (`'to'`, `'from'`, `'entering'`, `'exiting'`, `'retained'`)
     * @param state If provided, only returns the `ViewConfig`s for a single state in the path
     *
     * @returns a list of ViewConfig objects for the given path.
     */
    views(pathname?: string, state?: State): ViewConfig[];
    /**
     * Return the transition's tree changes
     *
     * A transition goes from one state/parameters to another state/parameters.
     * During a transition, states are entered and/or exited.
     *
     * This function returns various branches (paths) which represent the changes to the
     * active state tree that are caused by the transition.
     *
     * @param pathname The name of the tree changes path to get:
     *   (`'to'`, `'from'`, `'entering'`, `'exiting'`, `'retained'`)
     */
    treeChanges(pathname: string): PathNode[];
    treeChanges(): TreeChanges;
    /**
     * Creates a new transition that is a redirection of the current one.
     *
     * This transition can be returned from a [[TransitionService]] hook to
     * redirect a transition to a new state and/or set of parameters.
     *
     * @internalapi
     *
     * @returns Returns a new [[Transition]] instance.
     */
    redirect(targetState: TargetState): Transition;
    /** @hidden If a transition doesn't exit/enter any states, returns any [[Param]] whose value changed */
    private _changedParams();
    /**
     * Returns true if the transition is dynamic.
     *
     * A transition is dynamic if no states are entered nor exited, but at least one dynamic parameter has changed.
     *
     * @returns true if the Transition is dynamic
     */
    dynamic(): boolean;
    /**
     * Returns true if the transition is ignored.
     *
     * A transition is ignored if no states are entered nor exited, and no parameter values have changed.
     *
     * @returns true if the Transition is ignored.
     */
    ignored(): boolean;
    /**
     * @hidden
     */
    hookBuilder(): HookBuilder;
    /**
     * Runs the transition
     *
     * This method is generally called from the [[StateService.transitionTo]]
     *
     * @internalapi
     *
     * @returns a promise for a successful transition.
     */
    run(): Promise<any>;
    /**
     * Checks if this transition is currently active/running.
     */
    isActive: () => boolean;
    /**
     * Checks if the Transition is valid
     *
     * @returns true if the Transition is valid
     */
    valid(): boolean;
    /**
     * The Transition error reason.
     *
     * If the transition is invalid (and could not be run), returns the reason the transition is invalid.
     * If the transition was valid and ran, but was not successful, returns the reason the transition failed.
     *
     * @returns an error message explaining why the transition is invalid, or the reason the transition failed.
     */
    error(): any;
    /**
     * A string representation of the Transition
     *
     * @returns A string representation of the Transition
     */
    toString(): string;
}
