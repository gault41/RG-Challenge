const assert = require("assert");

const OperatorNode = (operator, left, right) => {
  const result = function() {
	  return operators[operator](left.result(), right.result());
  };
  return {
    operator,
    left,
    right,
    result
  };
}

const EndNode = (value) => {
  const result = function() {
	  return value;
  };
  return {
    value,
    result
  };
}

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

/** @class NodePrinter used to handle printing of an expression tree in a number of formats. 
 * In future can be expanded to handle alternative requirements
*/
class NodePrinter {

  /**
   * Recursively prints an expression tree from the given tree node
   * 
   * @param {Node} node The node of the tree to be printed 
   * @return {String} The infix representation of the tree as a string
   */
  static print = function (node) {
    if (node.operator in operators) {
      return `(${this.print(node.left)} ` + node.operator.toString() + ` ${this.print(node.right)})`;
    }
    else return node.value.toString();
  };
  
  static printPreFix = function (node) {
    if (node.operator in operators) {
      return `(`+ node.operator.toString() +` ${this.printPreFix(node.left)} ${this.printPreFix(node.right)})`;
    }
    else return node.value.toString();
  };
  
  static printPostFix = function (node) {
    if (node.operator in operators) {
      return `(${this.printPostFix(node.left)} ${this.printPostFix(node.right)} `+ node.operator.toString() +`)`;
    }
    else return node.value.toString();
  };
}

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
          nodeStack.push(OperatorNode(operatorStack.pop(), left, right));
          numExpressions--;
          break;
        default:
          if (character in operators) {
            operatorStack.push(character);
          } else {
            nodeStack.push(EndNode(Number(character)));
          }
          break;
      }
    }
    return nodeStack.pop();
  }
}

// Original tests
assert.strictEqual("((7 + ((3 - 2) x 5)) ÷ 6)", NodePrinter.print(TreeFactory.parse("((7 + ((3 - 2) x 5)) ÷ 6)")));
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

// Test infix, prefix and postfix parsing
assert.strictEqual("((5 x 3) + 2)", NodePrinter.print(TreeFactory.parse("((5 x 3) + 2)")));
assert.strictEqual("((5 x 3) + 2)", NodePrinter.print(TreeFactory.parse("((5  3 x)  2 +)")));
assert.strictEqual("((5 x 3) + 2)", NodePrinter.print(TreeFactory.parse("(+ (x 5  3)  2)")));

// Test infix, prefix and postfix printing
assert.strictEqual("((7 + ((3 - 2) x 5)) ÷ 6)", NodePrinter.print(TreeFactory.parse("((7 + ((3 - 2) x 5)) ÷ 6)")));
assert.strictEqual("(÷ (+ 7 (x (- 3 2) 5)) 6)", NodePrinter.printPreFix(TreeFactory.parse("((7 + ((3 - 2) x 5)) ÷ 6)")));
assert.strictEqual("((7 ((3 2 -) 5 x) +) 6 ÷)", NodePrinter.printPostFix(TreeFactory.parse("((7 + ((3 - 2) x 5)) ÷ 6)")));

