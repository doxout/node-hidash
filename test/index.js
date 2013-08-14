var t = require('tap'),
    _ = require('../hidash');


t.test('filtermap', function(t) {
    var onlyOddSquared = _([1,2,3,4,5]).filtermap(function(e) {
        if (e % 2) return e * e;
    }).value();
    t.deepEquals(onlyOddSquared, [1,9,25]);
    t.end();
});

var items = _([ 
    {a:1, b:2},
    {a:2, b:3},
    {a:3, b:4},
    {a:4, b:5}])

t.test('product', function(t) {
    var product = items.product(items, function(i1, i2) {
        if (i1.a == i2.b)
            return {i1: i1, i2: i2};
    });


    t.deepEquals(product.first(),
        {i1: {a:2, b: 3}, i2: {a: 1, b:2}});

    t.end(0);        
});

t.test('toDictionary', function(t) {

    var dict1 = items.toDictionary('a', 'b');
    t.deepEquals(dict1.value(), {1:2, 2:3, 3:4, 4:5});

    var dict2 = items.toDictionary('a');
    t.deepEquals(dict2.value()[1], {a: 1, b:2});

    var dict3 = items.toDictionary(function(x) {
        return x.a + '+' + x.b;
    }, function(x) { return x.a + x.b });

    t.equals(dict3.value()['1+2'], 3);

    t.end()
});
