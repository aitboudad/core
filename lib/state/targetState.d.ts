/** @coreapi @module state */ /** for typedoc */
import { StateDeclaration, StateOrName } from "./interface";
import { ParamsOrArray } from "../params/interface";
import { TransitionOptions } from "../transition/interface";
import { State } from "./stateObject";
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
export declare class TargetState {
    private _identifier;
    private _definition;
    private _options;
    private _params;
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
    constructor(_identifier: StateOrName, _definition?: State, _params?: ParamsOrArray, _options?: TransitionOptions);
    name(): String;
    identifier(): StateOrName;
    params(): ParamsOrArray;
    $state(): State;
    state(): StateDeclaration;
    options(): TransitionOptions;
    exists(): boolean;
    valid(): boolean;
    error(): string;
    toString(): string;
}
