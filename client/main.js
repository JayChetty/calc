var Matter = require('matter-js')
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;


window.onload = function(){
	console.log('app started', Matter);

  var boxHeight = 100
  var pieceWidth = 10
  var boxAngle = -Math.PI * 0.075

  var ballFriction = 0.00000001;
  var ballRestitution = 0.0000;
  var ballDensity = 0.00000000001;
  var ballSlop = 0;


  var engine = Engine.create(document.body);
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true  });



   // add ground
  World.add(engine.world, [ground]);

  //add catch box
  World.add(engine.world, [
    //bottom
    Bodies.rectangle(400, 500, 900, 20, { isStatic: true, angle: boxAngle }),
    //walls
    Bodies.rectangle(306, 400, 300, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    Bodies.rectangle(500, 400, 300, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    // wee adjuster
    Bodies.rectangle(313, 512, 40, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    //catch helper
    Bodies.rectangle(465, 280, 100, 2, { isStatic: true, angle: Math.PI * 0.5 }),
    // feed
    Bodies.rectangle(640, 218, 300, 2, { isStatic: true, angle: boxAngle }),

    Bodies.trapezoid(600, 100, 10, 10, -0.1, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop })
    // Bodies.rectangle(100, 300, 400, 20, { isStatic: true, angle: Math.PI * 0.5 })
    //guide
    // Bodies.rectangle(275, 499, 300, 1, { isStatic: true, angle: boxAngle }),
    // Bodies.rectangle(275, 479, 300, 1, { isStatic: true, angle: boxAngle }),
    // Bodies.rectangle(275, 457, 300, 1, { isStatic: true, angle: boxAngle }),
    // Bodies.rectangle(275, 436, 300, 1, { isStatic: true, angle: boxAngle }),
    // Bodies.rectangle(275, 415, 300, 1, { isStatic: true, angle: boxAngle }),

  ]);

  //add circles


  var dropBalls = function(){
    var newCircles = []
    
    for(var i=0; i<1; i++){
      var circle = Bodies.circle(600 + i*5, 100, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop });
      newCircles.push(circle)
    }
    World.add(engine.world, newCircles)    
  }


  // run the engine
  Engine.run(engine);
  // for(var i=0; i<60; i++){
  //   setTimeout(dropBalls, i*500);
  // }


  // setTimeout(dropBalls, 12000);
}

