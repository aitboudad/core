"use strict";
(function (TransitionHookPhase) {
    TransitionHookPhase[TransitionHookPhase["CREATE"] = 0] = "CREATE";
    TransitionHookPhase[TransitionHookPhase["BEFORE"] = 1] = "BEFORE";
    TransitionHookPhase[TransitionHookPhase["ASYNC"] = 2] = "ASYNC";
    TransitionHookPhase[TransitionHookPhase["SUCCESS"] = 3] = "SUCCESS";
    TransitionHookPhase[TransitionHookPhase["ERROR"] = 4] = "ERROR";
})(exports.TransitionHookPhase || (exports.TransitionHookPhase = {}));
var TransitionHookPhase = exports.TransitionHookPhase;
(function (TransitionHookScope) {
    TransitionHookScope[TransitionHookScope["TRANSITION"] = 0] = "TRANSITION";
    TransitionHookScope[TransitionHookScope["STATE"] = 1] = "STATE";
})(exports.TransitionHookScope || (exports.TransitionHookScope = {}));
var TransitionHookScope = exports.TransitionHookScope;
//# sourceMappingURL=interface.js.map