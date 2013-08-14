var _ = module.exports = require('lodash');

var self = {};

/**
 * Filter and map at the same time
 * @type {Function}
 * @param arr {Array} The array to filter-map
 * @param f - {Function} (item, k) => result-or-undefined
 *      If the function returns undefined, the item will be filtered out.
 * @return the resulting lodash array
 */
var filtermap = self.filtermap = function filmap(arr, f) {
    return _.reduce(arr, function(acc, el, k) {
        var res = f(el, k);
        if (res !== undefined) 
            acc.push(res);
        return acc;
    }, []);
};

/**
 * Get a join product of two arrays
 * @type {Function}
 * @param arr {Array} The first array
 * @param other {Array} The other array
 * @param f {Function} -> (item1, item2) => result
 *      If the function returns undefined, the pair will be filtered out.
 */
self.product = product;
function product(arr, other, f) {

    if (!f) f = function() { return true; }
    if (other.filtermap) // unpack
        other = other.value();

    return _.reduce(arr, function reductor(acc, el1) {
        function f2(el2) { return f(el1, el2); }
        return acc.concat(_.filtermap(other, f2));
    }, []);
}



function stringSelector(str) {
    return function getProperty(o) {
        return o[str];
    }
}

function identity(x) { return x; }


/**
 * Convert an array of items to a dictionary.
 * @type {Function}
 * @param arr {Array} the array to convert
 * @param keyselector Either function (item, k) => key or just property name
 * @param valselector
 *      Either function (item, k) => key, property name or undefined
 *      If not specified, the array item is used.
 * @returns {*} A dictionary.
 */
function toDictionary(arr, keyselector, valselector) {
    var o = {};
    if (typeof(keyselector) == 'string')
        keyselector = stringSelector(keyselector);
    if (typeof(valselector) == 'string')
        valselector = stringSelector(valselector);
    if (!valselector) 
        valselector = identity;
    return _(arr).reduce(function(acc, el, k) {
        acc[keyselector(el, k)] = valselector(el, k);
        return acc;
    }, {});
}

self.toDictionary = self.toObject = toDictionary;

_.mixin(self);
