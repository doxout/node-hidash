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
 * Convert an array of items to a dictionary.
 * 
 * @type {Function}
 * @param {Array} array - The array to convert
 * @param {Function,String} keyselector - Either function (item, k) => key or just property name
 * @param {Function,String} valselector - Either function (item, k) => key, property name or undefined. If not specified, the array item is used.
 * @return {*} A dictionary.
 */
function toDictionary(array, keyselector, valselector) {
    var o = {};
    if (typeof(keyselector) == 'string')
        keyselector = stringSelector(keyselector);
    if (typeof(valselector) == 'string')
        valselector = stringSelector(valselector);
    if (!valselector) 
        valselector = identity;
    return _(array).reduce(function(acc, el, k) {
        acc[keyselector(el, k)] = valselector(el, k);
        return acc;
    }, {});
}
self.toDictionary = self.toObject = toDictionary;

_.mixin(self);
