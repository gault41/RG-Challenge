const assert = require("assert");

const Node = (operator, value, left, right) => {
  const result = function () {
    if (operator in operators) {
      return operators[operator](left.result(), right.result());
    }
    else return value;
  };

  const toString = function () {
    if (operator in operators) {
      return `(${left.toString()} ` + operator.toString() + ` ${right.toString()})`;
    }
    else return value.toString();
  };

  return {
    operator,
    value,
    left,
    right,
    result,
    toString
  };
};

  /**
   * Split out operators to a dictionary to comply with the Open-Closed principle
   * Additional operators can be added or removed without modifying the tree
   */
const operators = {
	'x': function(left, right) {
		return left * right;
	},
	'÷': function(left, right) {
		return left / right;
	},
	'+': function(left, right) {
		return left + right;
	},
	'-': function(left, right) {
		return left - right;
	}
};

/** @class TreeFactory used to easily generate a Tree representation. */
class TreeFactory {

  /**
   * Parses a series of expressions (nested between brackets) and generates an expression tree
   * The provided expression may be infix, prefix or postfix
   * 
   * @param {String} expression The full expression to be parsed
   * @return {Node} The root node of the generated expressiontree
   */
  static parse(expression) {
    var nodeStack = [];
    var operatorStack = [];
    var numExpressions = 0;
    for (var i = 0; i < expression.length; i++) {
      var character = expression.charAt(i);
      switch (character) {
        case ' ':
          continue;
        case '(':
          numExpressions++;
          break;
        case ')':
          var right = nodeStack.pop();
          var left = nodeStack.pop();
          nodeStack.push(Node(operatorStack.pop(), null, left, right));
          numExpressions--;
          break;
        default:
          if (character in operators) {
            operatorStack.push(character);
          } else {
            nodeStack.push(Node(null, Number(character), null, null));
          }
          break;
      }
    }
    return nodeStack.pop();
  }
}

// Original tests
assert.strictEqual("((7 + ((3 - 2) x 5)) ÷ 6)", TreeFactory.parse("((7 + ((3 - 2) x 5)) ÷ 6)").toString());
assert.strictEqual(2, TreeFactory.parse("((7 + ((3 - 2) x 5)) ÷ 6)").result());

// Results tests
assert.strictEqual(0, TreeFactory.parse("0").result());
assert.strictEqual(24, TreeFactory.parse("(3 x 8)").result());
assert.strictEqual(4.5, TreeFactory.parse("(9 ÷ 2)").result());
assert.strictEqual(Infinity, TreeFactory.parse("(9 ÷ 0)").result());

// Test infix, prefix and postfix results
assert.strictEqual(17, TreeFactory.parse("((5 x 3) + 2)").result());
assert.strictEqual(17, TreeFactory.parse("((5  3 x)  2 +)").result());
assert.strictEqual(17, TreeFactory.parse("(+ (x 5  3)  2)").result());

assert.strictEqual("((5 x 3) + 2)", TreeFactory.parse("((5 x 3) + 2)").toString());
assert.strictEqual("((5 x 3) + 2)", TreeFactory.parse("((5  3 x)  2 +)").toString());
assert.strictEqual("((5 x 3) + 2)", TreeFactory.parse("(+ (x 5  3)  2)").toString());

