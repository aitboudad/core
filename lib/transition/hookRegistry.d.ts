import { HookRegOptions, HookMatchCriteria, IHookRegistration, TreeChanges, HookMatchCriterion, IMatchingNodes, HookFn } from "./interface";
import { State } from "../state/stateObject";
import { TransitionHookType } from "./transitionHookType";
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
export declare function matchState(state: State, criterion: HookMatchCriterion): boolean;
/**
 * @hidden
 * The registration data for a registered transition hook
 */
export declare class RegisteredHook implements RegisteredHook {
    hookType: TransitionHookType;
    callback: HookFn;
    matchCriteria: HookMatchCriteria;
    priority: number;
    bind: any;
    _deregistered: boolean;
    constructor(hookType: TransitionHookType, matchCriteria: HookMatchCriteria, callback: HookFn, options?: HookRegOptions);
    private static _matchingNodes(nodes, criterion);
    /**
     * Determines if this hook's [[matchCriteria]] match the given [[TreeChanges]]
     *
     * @returns an IMatchingNodes object, or null. If an IMatchingNodes object is returned, its values
     * are the matching [[PathNode]]s for each [[HookMatchCriterion]] (to, from, exiting, retained, entering)
     */
    matches(treeChanges: TreeChanges): IMatchingNodes;
}
/** @hidden */
export interface RegisteredHooks {
    [key: string]: RegisteredHook[];
}
/** @hidden Return a registration function of the requested type. */
export declare function makeHookRegistrationFn(registeredHooks: RegisteredHooks, type: TransitionHookType): IHookRegistration;
