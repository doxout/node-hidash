/**
 * # Hidash 
 * A mixin extension of lodash
 *
 */

var _ = module.exports = require('lodash');
var self = {};

/**
 * Filter and map at the same time
 * 
 * Example: 
 *
 *      _.filtermap([1,2,3], function(x) { if (x > 1) return x * x; });
 *
 * @type {Function}
 * @param {Array} array - The array to filter-map
 * @param {Function} f - function(item, k) => result or undefined
 *        If the function returns undefined, the item will be filtered out.
 * @return {Array} the resulting lodash array
 */

function filtermap(array, f) {
    return _.reduce(array, function(acc, el, k) {
        var res = f(el, k);
        if (res !== undefined) 
            acc.push(res);
        return acc;
    }, []);
}
self.filtermap = filtermap;


/**
 * Get a join product of two arrays
 * 
 * @type {Function}
 * @param {Array} array - The first array
 * @param {Array} other - The other array
 * @param {Function} f - (item1, item2) => result. If the function returns undefined, the pair will be filtered out.
 * @return {Array} - the resulting product.
 */
function product(array, other, f) {

    if (!f) f = function(x, y) { return [x, y]; }
    if (other.filtermap) // unpack
        other = other.value();

    return _.reduce(array, function reductor(acc, el1) {
        function f2(el2) { return f(el1, el2); }
        return acc.concat(_.filtermap(other, f2));
    }, []);
}
self.product = product;


function stringSelector(str) {
    return function getProperty(o) {
        return o[str];
    }
}

function identity(x) { return x; }


/**
 * Map an array (or a dictionary) of items to a dictionary.
 * 
 * @type {Function}
 * @alias toObject,toDictionary
 * @param {Array} array - The array to convert
 * @param {Function,String} keyfn - Either function (item, key) => newkey or just property name. If unspecified, the key remains the same.
 * @param {Function,String} valfn - Either function (item, kew) => newkey, property name or undefined. If unspecified, the value remains the same
 * @return {*} A dictionary.
 */
function omap(array, keyfn, valfn) {
    var o = {};
    if (typeof(keyfn) == 'string')
        keyfn = stringSelector(keyfn);
    if (typeof(valfn) == 'string')
        valfn = stringSelector(valfn);
    if (!keyfn)
        keyfn = function(el, k) { return k; }
    if (!valfn) 
        valfn = identity;
    return _(array).reduce(function(acc, el, k) {
        acc[keyfn(el, k)] = valfn(el, k);
        return acc;
    }, {});
}
self.toDictionary = self.toObject = self.omap = omap;


_.mixin(self);
