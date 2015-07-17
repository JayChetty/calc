var Matter = require('matter-js')
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;


window.onload = function(){
	console.log('app started', Matter);

  var boxHeight = 100
  var pieceWidth = 10
  var boxAngle = -Math.PI * 0.06



  var engine = Engine.create(document.body);
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true  });

  var circles = [] 
  for(var i=0; i<10; i++){
    var circle = Bodies.circle(600 + i*5, 100, 10, { friction: 0.00001, restitution: 0.3, density: 0.001 });
    circles.push(circle)
  }


   // add ground
  World.add(engine.world, [ground]);

  //add catch box
  World.add(engine.world, [
    //bottom
    Bodies.rectangle(400, 500, 900, 20, { isStatic: true, angle: -Math.PI * 0.03 }),
    //walls
    Bodies.rectangle(290, 400, 300, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    Bodies.rectangle(500, 400, 300, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    //catch helper
    Bodies.rectangle(470, 280, 100, 2, { isStatic: true, angle: Math.PI * 0.5 }),
    // feed
    Bodies.rectangle(640, 235, 300, 2, { isStatic: true, angle: -Math.PI * 0.03 }),
    // Bodies.rectangle(100, 300, 400, 20, { isStatic: true, angle: Math.PI * 0.5 })

  ]);

  //add circles
  World.add(engine.world, circles);
  

  // run the engine
  Engine.run(engine);
}

