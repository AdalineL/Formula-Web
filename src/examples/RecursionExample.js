/**
 *  @fileoverview Initiliazes the recursion example code
 */

const recursionExample = () => {
  return `domain RecursionExample
{
  A ::= new (x : Integer).

  // Recursively derive new A's
  A(y) :- A(x), x > 0, y = x - 1.

  // A model is godo if it contains exactly 2 A's
  goodModel :- c = count({ a | a is A}), c = 2.

  conforms goodModel.
}

partial model pm of RecursionExample
[solver_RecursionBound = 20]
{
  A(x).
}`;
};

exports.recursionExample = recursionExample;
