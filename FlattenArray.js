const assert = require("assert");
/**
 * Flatten array making use of recurision due to unkown depth
 */

const flattenArray = (array) => {
   if (array instanceof Array) {
      if (array.length === 0) return [];
      return flattenArray(array[0]).concat(flattenArray(array.slice(1)));
   }
   return [array];
}

assert.deepEqual([], flattenArray([]));
assert.deepEqual(["x"], flattenArray("x"));
assert.deepEqual(["x", "y"], flattenArray([["x"], "y"]));
assert.deepEqual(["x", "y"], flattenArray([[["x"]], [["y"]]]));
assert.deepEqual([1, 2, 3, 4, 5], flattenArray([1, [2], [3, 4, [5]]])); 
assert.deepEqual([1, "a", "test"], flattenArray([1, [], ["a", [["test"]]]])); 
assert.deepEqual([1, 0, {}, -10, "x"], flattenArray([1, [0, [{}, [[-10], ["x"]]]]])); 