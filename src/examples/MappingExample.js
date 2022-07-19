/**
 *  @fileoverview Initiliazes the mapping example code
 */

const mappingExample = () => {
  return `domain Mapping
  {
    Component ::= new (id: Integer, utilization: Real).
    Processor ::= new (id: Integer).
    Mapping   ::= new (c: Component, p: Processor).
  
    // The utilization must be > 0
    invalidUtilization :- c is Component, c.utilization <= 0.
  
    badMapping :- p is Processor, 
      s = sum(0.0, { c.utilization |
               c is Component, Mapping(c, p) }), s > 100.
  
    conforms no badMapping, no invalidUtilization.
  }
  
  model m of Mapping
  {
    c1 is Component(0, 10).
    c2 is Component(1, 90).
    p1 is Processor(0).
    Mapping(c1, p1).
    Mapping(c2, p1).
  }
  
  partial model pm of Mapping
  {
    c1 is Component(0, x).
    c2 is Component(1, y).
    p1 is Processor(0).
    Mapping(c1, p1).
    Mapping(c2, p1).
  }`;
};

exports.mappingExample = mappingExample;
