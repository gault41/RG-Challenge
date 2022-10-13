const assert = require("assert");

const Node = (operator, value, left, right) => {
  const result = function () {
    switch (operator) {
      case "+":
        return left.result() + right.result();
      case "-":
        return left.result() - right.result();
      case "x":
        return left.result() * right.result();
      case "÷":
        return left.result() / right.result();
      default:
        return value;
    }
  };

  const toString = function () {
    switch (operator) {
      case "+":
        return `(${left.toString()} + ${right.toString()})`;
      case "-":
        return `(${left.toString()} - ${right.toString()})`;
      case "x":
        return `(${left.toString()} x ${right.toString()})`;
      case "÷":
        return `(${left.toString()} ÷ ${right.toString()})`;
      default:
        return value.toString();
    }
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
        case '+':
        case '-':
        case 'x':
        case '÷':
          operatorStack.push(character);
          break;
        default:
          nodeStack.push(Node(null, Number(character), null, null));
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

