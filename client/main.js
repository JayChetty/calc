var Matter = require('matter-js')
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;


window.onload = function(){
	console.log('app started', Matter);

  var engine = Engine.create(document.getElementById('main-view'));

  var height = 800;
  var width = 800;
  var canvas = document.getElementsByTagName("canvas")[0];
  canvas.height = height;
  canvas.width = width;
  console.log('canvas', canvas)

  var boxHeight = 100
  var pieceDiameter = 10
  var boxAngle = -Math.PI * 0.075

  var ballFriction = 0.00001;
  var ballRestitution = 0.0000;
  var ballDensity = 0.00000000001;
  var ballSlop = 0;


  
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true  });


   // add ground
  World.add(engine.world, [ground]);
  var ballBoxStartX = 500;
  var ballStartX = ballBoxStartX+ 10;
  var bottomWidth = 100
  var bottom = Bodies.rectangle(ballBoxStartX + bottomWidth/2, 120, 100, 1, { isStatic: true, angle: 0 });

  //add catch box
  World.add(engine.world, [
    //bottom
    Bodies.rectangle(400, 500, 900, 20, { isStatic: true, angle: boxAngle }),
    //walls
    Bodies.rectangle(306, 400, 300, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    Bodies.rectangle(500, 400, 300, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    // wee adjuster
    // Bodies.rectangle(313, 512, 40, 20, { isStatic: true, angle: Math.PI * 0.5 }),
    //catch helper

    
    //Ball Boxes
    Bodies.rectangle(ballBoxStartX, 70, 100, 1, { isStatic: true, angle: Math.PI * 0.5 }),
    Bodies.rectangle(ballBoxStartX + 20, 70, 100, 1, { isStatic: true, angle: Math.PI * 0.5 }),
    Bodies.rectangle(ballBoxStartX + 40, 70, 100, 1, { isStatic: true, angle: Math.PI * 0.5 }),
    //bottom
    bottom,
    
    Bodies.circle(ballStartX, 60, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop }),
    Bodies.circle(ballStartX, 40, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop }),
    Bodies.circle(ballStartX, 20, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop }),
    Bodies.circle(ballStartX, 0, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop }),

    Bodies.circle(ballStartX+20, 60, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop }),
    Bodies.circle(ballStartX+20, 40, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop }),
    Bodies.circle(ballStartX+20, 20, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop }),
    Bodies.circle(ballStartX+20, 0, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop }),

    // feed
    Bodies.rectangle(640, 210, 300, 2, { isStatic: true, angle: boxAngle }),
    Bodies.rectangle(ballBoxStartX + 75, 150, 150, 2, { isStatic: true, angle: Math.PI * 0.04 })
    ,
    Bodies.rectangle(465, 281, 100, 2, { isStatic: true, angle: Math.PI * 0.5 }),


    // Bodies.trapezoid(600, 100, 15, 15, -0.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop })
    // Bodies.rectangle(100, 300, 400, 20, { isStatic: true, angle: Math.PI * 0.5 })
    //guide
    // Bodies.rectangle(275, 499, 300, 1, { isStatic: true, angle: boxAngle }),
    // Bodies.rectangle(275, 479, 300, 1, { isStatic: true, angle: boxAngle }),
    // Bodies.rectangle(275, 457, 300, 1, { isStatic: true, angle: boxAngle }),
    // Bodies.rectangle(275, 436, 300, 1, { isStatic: true, angle: boxAngle }),

  ]);

  //add circles


  // var dropBalls = function(){
  //   var newCircles = []
    
  //   for(var i=0; i<1; i++){
  //     var circle = Bodies.circle(600 + i*5, 100, 9.5, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop });
  //     // var circle = Bodies.trapezoid(600, 100, 15, 15, 0.9, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop })
  //     // var circle = Bodies.trapezoid(600, 100, 15, 15, 0.9, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop })
  //     newCircles.push(circle)
  //   }
  //   World.add(engine.world, newCircles)
  // }



  // run the engine
  Engine.run(engine);

  //test drop random balls
  // for(var i=0; i<21; i++){
  //   setTimeout(dropBalls, i*500);
  // }

  // setTimeout(function(){
  //   World.add(engine.world,[Bodies.rectangle(480, 452, 18, 1, { isStatic: true, angle: boxAngle, restitution: ballRestitution })]);
  // }, 8000)


  var button = document.getElementById('drop-button')
  console.log('butto dn', button)
  button.addEventListener('click', function(ev){
    console.log('the button was clicked', bottom);
    Matter.Body.translate(bottom, {x:20, y:0})
    // World.add(engine.world, [bottom])
  });

}

