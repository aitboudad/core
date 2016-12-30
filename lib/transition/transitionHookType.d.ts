import { TransitionHookScope, TransitionHookPhase } from "./interface";
import { GetErrorHandler, GetResultHandler } from "./transitionHook";
/**
 * This class defines a type of hook, such as `onBefore` or `onEnter`.
 * Plugins can define custom hook types, such as sticky states does for `onInactive`.
 *
 * @interalapi
 * @module transition
 */
export declare class TransitionHookType {
    name: string;
    hookPhase: TransitionHookPhase;
    hookScope: TransitionHookScope;
    hookOrder: number;
    criteriaMatchPath: string;
    reverseSort: boolean;
    getResultHandler: GetResultHandler;
    getErrorHandler: GetErrorHandler;
    rejectIfSuperseded: boolean;
    constructor(name: string, hookPhase: TransitionHookPhase, hookScope: TransitionHookScope, hookOrder: number, criteriaMatchPath: string, reverseSort?: boolean, getResultHandler?: GetResultHandler, getErrorHandler?: GetErrorHandler, rejectIfSuperseded?: boolean);
}
