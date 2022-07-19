/**
 *  @fileoverview Initiliazes the default example code
 */

const defaultExample = () => {
  return `
  domain Mapping
  {
    Component ::= new (id: Integer, utilization: Real).
    Processor ::= new (id: Integer).
    Mapping   ::= new (c: Component, p: Processor).
  
    badMapping :- p is Processor,
          s = sum(0.0, { c.utilization |
                     c is Component, Mapping(c, p) }), s > 100.
  }`;
};

exports.defaultExample = defaultExample;
