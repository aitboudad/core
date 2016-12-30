/** @coreapi @module transition */ /** for typedoc */
import { IHookRegistry, TransitionOptions, TransitionHookPhase, TransitionCreateHookFn } from "./interface";
import { HookMatchCriteria, HookRegOptions, TransitionStateHookFn, TransitionHookFn } from "./interface";
import { Transition } from "./transition";
import { RegisteredHook } from "./hookRegistry";
import { TargetState } from "../state/targetState";
import { PathNode } from "../path/node";
import { ViewService } from "../view/view";
import { UIRouter } from "../router";
import { TransitionHookType } from "./transitionHookType";
/**
 * The default [[Transition]] options.
 *
 * Include this object when applying custom defaults:
 * let reloadOpts = { reload: true, notify: true }
 * let options = defaults(theirOpts, customDefaults, defaultOptions);
 */
export declare let defaultTransOpts: TransitionOptions;
/**
 * This class provides services related to Transitions.
 *
 * - Most importantly, it allows global Transition Hooks to be registered.
 * - It allows the default transition error handler to be set.
 * - It also has a factory function for creating new [[Transition]] objects, (used internally by the [[StateService]]).
 *
 * At bootstrap, [[UIRouter]] creates a single instance (singleton) of this class.
 */
export declare class TransitionService implements IHookRegistry {
    private _router;
    /**
     * Registers a [[TransitionHookFn]], called *while a transition is being constructed*.
     *
     * Registers a transition lifecycle hook, which is invoked during transition construction.
     *
     * This low level hook should only be used by plugins.
     * This can be a useful time for plugins to add resolves or mutate the transition as needed.
     * The Sticky States plugin uses this hook to modify the treechanges.
     *
     * ### Lifecycle
     *
     * `onBefore` hooks are invoked *while a transition is being constructed*.
     *
     * ### Return value
     *
     * The hook's return value is ignored
     *
     * @internalapi
     * @param matchCriteria defines which Transitions the Hook should be invoked for.
     * @param callback the hook function which will be invoked.
     * @returns a function which deregisters the hook.
     */
    onCreate: (criteria: HookMatchCriteria, callback: TransitionCreateHookFn, options?: HookRegOptions) => Function;
    /** @inheritdoc */
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
    /** @hidden */
    $view: ViewService;
    /** @hidden The transition hook types, such as `onEnter`, `onStart`, etc */
    private _transitionHookTypes;
    /** @hidden The registered transition hooks */
    private _transitionHooks;
    /**
     * This object has hook de-registration functions for the built-in hooks.
     * This can be used by third parties libraries that wish to customize the behaviors
     *
     * @hidden
     */
    _deregisterHookFns: {
        redirectTo: Function;
        onExit: Function;
        onRetain: Function;
        onEnter: Function;
        eagerResolve: Function;
        lazyResolve: Function;
        loadViews: Function;
        activateViews: Function;
        updateUrl: Function;
        lazyLoad: Function;
    };
    constructor(_router: UIRouter);
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
    create(fromPath: PathNode[], targetState: TargetState): Transition;
    /** @hidden */
    private registerTransitionHookTypes();
    /**
     * Defines a transition hook type and returns a transition hook registration
     * function (which can then be used to register hooks of this type).
     * @internalapi
     */
    registerTransitionHookType(hookType: TransitionHookType): (matchCriteria: HookMatchCriteria, callback: TransitionHookFn | TransitionStateHookFn | TransitionCreateHookFn, options?: HookRegOptions) => Function;
    getTransitionHookTypes(phase?: TransitionHookPhase): TransitionHookType[];
    /** @hidden */
    getHooks(hookName: string): RegisteredHook[];
    /** @hidden */
    private registerTransitionHooks();
}
