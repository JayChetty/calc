var Matter = require('matter-js')
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;


window.onload = function(){
	console.log('app started', Matter);

  var engine = Engine.create(document.getElementById('main-view'));

  var height = 800;
  var width = 800;
  var bottomY = height - 20
  var centerX = width/2;
  var canvas = document.getElementsByTagName("canvas")[0];
  canvas.height = height;
  canvas.width = width;
  console.log('canvas', canvas)

  var pieceDiameter = 20

  var boxAngle = -Math.PI * 0.075
  var boxHeight = 10*pieceDiameter
  var boxHypotenuse = 10*pieceDiameter
  var boxWidth = boxHypotenuse * Math.cos(boxAngle)
  var boxHeightAdjust = -1 * (boxHypotenuse * Math.sin(boxAngle))

  console.log('boxHeightAdjust', boxHeightAdjust)

  var ballFriction = 0.00001;
  var ballRestitution = 0.0000;
  var ballDensity = 0.00000000001;
  var ballSlop = 0;

  var timesTable = 7;

  var ballBoxStartX = 500;
  var ballStartX = ballBoxStartX+ 10;
  var bottomWidth = 100
  

  // add ground
  World.add(engine.world, [
    Bodies.rectangle(centerX, bottomY, width, 1, { isStatic: true, angle: 0 }),
  ]);

  //add catch box
  World.add(engine.world, [
    //bottom
    Bodies.rectangle(centerX, bottomY - boxHeightAdjust/2, boxWidth, 1, { isStatic: true, angle: boxAngle }),
    //walls
    Bodies.rectangle(centerX - boxWidth/2, bottomY - boxHeight/2, boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }),
    Bodies.rectangle(centerX + boxWidth/2, bottomY - boxHeightAdjust - (boxHeight/2), boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }),
  ]);


  var feedAngle = -Math.PI * 0.04
  var feedPointX = centerX + boxWidth/2;
  var feedPointY = bottomY - boxHeight - boxHeightAdjust

  var feedTotalWidth = width - feedPointX
  var feedLength = feedTotalWidth / Math.cos(feedAngle)
  var feedHeight = (feedTotalWidth * Math.tan(feedAngle)) * -1
  var feedCenterX = feedPointX + feedTotalWidth/2
  var blockSize = pieceDiameter*3
  var holeSize = pieceDiameter*2

  console.log('feedCenterX', feedCenterX)
  console.log('feedLength', feedLength)
  console.log('feedHeight', feedHeight)
  console.log('feedTotalWidth', feedTotalWidth)
  // add feed
  World.add(engine.world, [
    //ramps
    Bodies.rectangle(feedCenterX, feedPointY - feedHeight/2, feedLength, 1, { isStatic: true, angle: feedAngle }),
    Bodies.rectangle(feedCenterX - holeSize/2, feedPointY - feedHeight - feedHeight/2 - holeSize/2, feedLength - holeSize, 1, { isStatic: true, angle: feedAngle*-1 }),
    //block
    Bodies.rectangle(feedPointX + feedTotalWidth, feedPointY - feedHeight - blockSize/2 , blockSize, 5, { isStatic: true, angle: Math.PI * 0.5 }),
    //guide
    Bodies.rectangle(feedPointX - pieceDiameter, feedPointY, pieceDiameter * 5, 1, { isStatic: true, angle: Math.PI * 0.5 }),
  ]);

  var boxStartX = feedPointX
  var gap = pieceDiameter*1
  var boxStartY = feedPointY - feedHeight*2  - holeSize/2  - gap
  var boxHeight = 10*pieceDiameter 
  var ballBoxBodies = [];

  //add box columns
  for(var i=0; i<11; i++){// we need 11 lines to create 10 boxes
    ballBoxBodies.push( Bodies.rectangle(boxStartX + (i*pieceDiameter), boxStartY - boxHeight/2, boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }) )   
  }

  World.add(engine.world, ballBoxBodies)

  //add protector
  World.add(engine.world, [
    Bodies.rectangle(boxStartX, boxStartY + gap/2, gap, 1, { isStatic: true, angle: Math.PI * 0.5 }),
  ]);

  //add bottom  
  var bottomWidth = 10*pieceDiameter 
  var bottom = Bodies.rectangle(boxStartX + bottomWidth/2, boxStartY, bottomWidth, 1, { isStatic: true, angle: 0 });
  World.add(engine.world, [bottom])


  // add pieces
  var ballStartX = boxStartX + pieceDiameter/2
  var ballStartY = boxStartY - pieceDiameter/2
  var pieces = []
  for(var i=0; i<10; i++){
    for(var j=0; j<7; j++){
      pieces.push( Bodies.circle(ballStartX + i*pieceDiameter, pieceDiameter - j*pieceDiameter, pieceDiameter/2, { friction: ballFriction, restitution: ballRestitution, density: ballDensity, slop:ballSlop }) )
    }
  }

  World.add(engine.world, pieces)

  Engine.run(engine);


  var button = document.getElementById('drop-button')
  console.log('butto dn', button)
  button.addEventListener('click', function(ev){
    Matter.Body.translate(bottom, {x:20, y:0})
  });

}

