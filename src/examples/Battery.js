/**
 *  @fileoverview Initiliazes the battery example code
 */

const battery = () => {
  return `domain Battery
{
  Component ::= new (label : String, weight : Real).
  Battery ::= new (label : String, weight : Real, capacity : Real).
  
  // Energy consumption rate
  rate ::= (Real).
  
  // Duration to complete the MissionItem with the given name
  itemDuration ::= (String, Real).
  
  // Amount of energy consumed to carry out the Mission with given name
  missionConsumption ::= (String, Real).
  
  // Total battery capacity
  batteryCapacity ::= (Real).

  // (x,y) location of the drone
  Loc ::= new (x : Real, y : Real).
  
  // Each mission item involves moving from source to destination locs at given velocity
  MissionItem ::= new (label : String, src : Loc, dest : Loc, dist : Real, vel : Real).
  
  // Each mission is a list of mission items
  Mission ::= new (m : MissionItem, remainder : any Mission + {NIL}).

  rate(r) :- x = sum(0, {cw | cw = w*(9.8), Component(_, w)}),
    r = (x + bw*9.8)/(3*0.7), Battery(_, bw, _).

  batteryCapacity(c) :- c = sum(0, {bc | Battery(_, _, bc)}).

  itemDuration(name, t) :- MissionItem(name, _, _, dist, vel), t = dist/vel.

  missionConsumption(name, c) :- Mission(MissionItem(name, _, _, _, _),
  Mission(MissionItem(name2, _, _, _, _), _)),
  itemDuration(name, t1),
  missionConsumption(name2, c2),
  rate(r),
  c = t1*r + c2.
    missionConsumption(name, c) :- Mission(MissionItem(name, _, _, _, _), NIL),
  itemDuration(name, t),
  rate(r),
  c = t*r.
    insufficientBattery :- missionConsumption(_, x), batteryCapacity(c), x > c.
    conforms no insufficientBattery.
}

model d1 of Battery
{
  Component("payload1", 5).
  Component("payload2", 3).
  Component("body", 10).
  
  Battery("battery1", 5, 200).

  t1 is MissionItem("task1", Loc(40.00, 5.00), Loc(47.00, 8.00), 7.62, 0.4).
  t2 is MissionItem("task2", Loc(47.00, 8.00), Loc(52.00, 2.00), 7.81, 0.2).

  m1 is Mission(t1, m2).
  m2 is Mission(t2, NIL).
}

partial model pm of Battery
{
  Component("payload1", 5).
  Component("payload2", 3).
  Component("body", 10).

  // Battery capacity is symbolic
  Battery("battery1", 5, x).
  
  l1 is Loc(40.00, 5.00).
  l2 is Loc(47.00, 8.00).
  l3 is Loc(52.00, 2.00).

  t1 is MissionItem("task1", Loc(40.00, 5.00), Loc(47.00, 8.00), 7.62, 0.4).
  t2 is MissionItem("task2", Loc(47.00, 8.00), Loc(52.00, 2.00), 7.81, 0.2).

  m1 is Mission(t1, m2).
  m2 is Mission(t2, NIL).
  
  // rate = (225.4)/2.1 = 107.33
}`;
};

exports.battery = battery;
