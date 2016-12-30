"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
/**
 * Naive, pure JS implementation of core ui-router services
 *
 * @module justjs
 */ /** */
__export(require("./index"));
var coreservices_1 = require("./common/coreservices");
var strings_1 = require("./common/strings");
var predicates_1 = require("./common/predicates");
var common_1 = require("./common/common");
/** $q-like promise api */
coreservices_1.services.$q = (function (executor) { return new Promise(executor); });
coreservices_1.services.$q.when = function (val) { return Promise.resolve(val); };
coreservices_1.services.$q.reject = function (val) { return Promise.reject(val); };
coreservices_1.services.$q.defer = function () {
    var deferred = {};
    deferred.promise = new Promise(function (resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
};
coreservices_1.services.$q.all = function (promises) {
    if (predicates_1.isArray(promises)) {
        return Promise.all(promises);
    }
    if (predicates_1.isObject(promises)) {
        var p = promises;
        // Convert promises map to promises array.
        // When each promise resolves, map it to a tuple { key: key, val: val }
        var objectToTuples = Object.keys(promises)
            .map(function (key) { return p[key].then(function (val) { return ({ key: key, val: val }); }); });
        var tuplesToObject = function (values) {
            return values.reduce(function (acc, tuple) { acc[tuple.key] = tuple.val; return acc; }, {});
        };
        // Then wait for all promises to resolve, and convert them back to an object
        return coreservices_1.services.$q.all(objectToTuples).then(tuplesToObject);
    }
};
// angular1-like injector api
// globally available injectables
var globals = {};
coreservices_1.services.$injector = {
    get: function (name) { return globals[name]; },
    has: function (name) { return coreservices_1.services.$injector.get(name) != null; },
    invoke: function (fn, context, locals) {
        var all = common_1.extend({}, globals, locals || {});
        var params = coreservices_1.services.$injector.annotate(fn);
        var ensureExist = common_1.assertPredicate(function (key) { return all.hasOwnProperty(key); }, function (key) { return ("Could not find Dependency Injection token: " + strings_1.stringify(key)); });
        var args = params.filter(ensureExist).map(function (x) { return all[x]; });
        if (predicates_1.isFunction(fn))
            return fn.apply(context, args);
        return fn.slice(-1)[0].apply(context, args);
    },
    // http://stackoverflow.com/questions/1007981
    annotate: function (fn) {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var ARGUMENT_NAMES = /([^\s,]+)/g;
        if (!predicates_1.isInjectable(fn))
            throw new Error("Not an injectable function: " + fn);
        if (fn && fn['$inject'])
            return fn['$inject'];
        if (predicates_1.isArray(fn))
            return fn.slice(0, -1);
        var fnStr = fn.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        return result || [];
    }
};
var loc = coreservices_1.services.location;
loc.hash = function () { return ""; };
loc.path = function () { return location.hash.replace(/^#/, ""); };
loc.search = function () { return location.search; };
loc.setUrl = function (url, replace) {
    if (replace === void 0) { replace = true; }
    if (url)
        location.hash = url;
};
loc.onChange = function (cb) {
    window.addEventListener("hashchange", cb, false);
};
var locCfg = coreservices_1.services.locationConfig;
locCfg.port = function () { return location.port; };
locCfg.protocol = function () { return location.protocol; };
locCfg.host = function () { return location.host; };
locCfg.baseHref = function () { return ""; };
locCfg.html5Mode = function () { return false; };
locCfg.hashPrefix = function () { return ""; };
//# sourceMappingURL=justjs.js.map