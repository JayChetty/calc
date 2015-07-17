var Matter = require('matter-js')
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;


window.onload = function(){
	console.log('app started', Matter);

  var boxHeight = 100
  var pieceWidth = 10
  var boxAngle = -Math.PI * 0.04

  var ballFriction = 0.00001;
  var ballRestitution = 0;
  var ballDensity = 200;
  var ballSlop = 0;


  var engine = Engine.create(document.body);
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true  });
  var circles = [] 
  for(var i=0; i<10; i++){
    var circle = Bodies.circle(600 + i*5, 100, 10, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop});
    circles.push(circle)
  }


   // add ground
  World.add(engine.world, [ground]);

  //add catch box
  World.add(engine.world, [
    //bottom
    Bodies.rectangle(400, 500, 900, 20, { isStatic: true, angle: boxAngle }),
    //walls
    Bodies.rectangle(290, 400, 300, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    Bodies.rectangle(500, 400, 300, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    // wee adjuster
    // Bodies.rectangle(302, 510, 40, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    //catch helper
    Bodies.rectangle(465, 280, 100, 2, { isStatic: true, angle: Math.PI * 0.5 }),
    // feed
    Bodies.rectangle(640, 220, 300, 2, { isStatic: true, angle: boxAngle }),
    // Bodies.rectangle(100, 300, 400, 20, { isStatic: true, angle: Math.PI * 0.5 })

  ]);

  //add circles
  World.add(engine.world, circles);


  var dropBalls = function(){
    console.log('doing set timeout', circles)
    var newCircles = []
    var rec = Bodies.rectangle(400, 470, 900, 2, { isStatic: true, angle: boxAngle })
    for(var i=0; i<10; i++){
      var circle = Bodies.circle(600 + i*5, 100, 10, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop });
      newCircles.push(circle)
    }
    // World.add(engine.world, rec)
    World.add(engine.world, newCircles)    
  }


  

  // run the engine
  Engine.run(engine);

  setTimeout(dropBalls, 4000);
  // setTimeout(dropBalls, 8000);
  // setTimeout(dropBalls, 12000);

  // setTimeout(function(){
  //   console.log('doing set timeout', circles)
  //   var newCircles = []
  //   for(var i=0; i<9; i++){
  //     var circle = Bodies.circle(600 + i*5, 100, 10, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop });
  //     newCircles.push(circle)
  //   }
  //   World.add(engine.world, newCircles)
  // //   Engine.run(engine);
  // }, 8000)
}

