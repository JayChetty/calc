var Matter = require('matter-js')
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Events = Matter.Events;


window.onload = function(){
	console.log('app started', Matter);

  var height = 650;
  var width = 800;

  var engine = Engine.create(document.getElementById('main-view'),{

    render: {
      // controller: Matter.RenderPixi,
      options: {
        //should be able to set background color here
        height:height,
        width:width,
        wireframes: false
      }
    }
  });

  var bottomY = height - 20
  var centerX = width/2;
  var canvas = document.getElementsByTagName("canvas")[0];
  // canvas.height = height;
  // canvas.width = width;
  // console.log('canvas', canvas)

  var pieceDiameter = 19
  var adjust = pieceDiameter * 0.5
  var boxAngle = -Math.PI * 0.03
  var boxHeight = 11*pieceDiameter
  var boxHypotenuse = 10*pieceDiameter - adjust
  var boxWidth = boxHypotenuse * Math.cos(boxAngle)
  var boxHeightAdjust = -1 * (boxHypotenuse * Math.sin(boxAngle))

  console.log('boxHeightAdjust', boxHeightAdjust)

  var ballFriction = 0.00001;
  var ballRestitution = 0.0000001;
  var ballDensity = 0.00000001;
  var ballSlop = 0.0000000;
  var ballFrictionAir = 0.02;

  var timesTable = 10;

  var ballBoxStartX = 500;
  var ballStartX = ballBoxStartX+ 10;
  var bottomWidth = 100

  var firstLineTopY = bottomY - boxHeightAdjust - pieceDiameter;

  var boxLeftX = centerX - boxWidth/2
  var boxRightX = centerX + boxWidth/2
  

  // add ground
  World.add(engine.world, [
    Bodies.rectangle(centerX, bottomY, width, 1, { isStatic: true, angle: 0 }),
  ]);

  console.log('engine.world',engine.world)

  //add catch box
  World.add(engine.world, [
    //bottom
    Bodies.rectangle(centerX, bottomY - boxHeightAdjust/2, boxWidth+pieceDiameter/2, 1, { isStatic: true, angle: boxAngle }),
    //walls
    Bodies.rectangle(boxLeftX, bottomY - boxHeight/2, boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }),
    Bodies.rectangle(boxRightX, bottomY - boxHeightAdjust - (boxHeight/2), boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }),
  ]);


  var feedAngle = -Math.PI * 0.04
  var feedPointX = centerX + boxWidth/2;
  var feedPointY = bottomY - boxHeight - boxHeightAdjust - pieceDiameter

  var feedTotalWidth = width - feedPointX
  var feedLength = feedTotalWidth / Math.cos(feedAngle)
  var feedHeight = (feedTotalWidth * Math.tan(feedAngle)) * -1
  var feedCenterX = feedPointX + feedTotalWidth/2
  var blockSize = pieceDiameter*3
  var holeSize = pieceDiameter * 1.2

  console.log('feedCenterX', feedCenterX)
  console.log('feedLength', feedLength)
  console.log('feedHeight', feedHeight)
  console.log('feedTotalWidth', feedTotalWidth)

  var feedGuide = Bodies.rectangle(feedPointX - pieceDiameter, feedPointY, pieceDiameter * 5, 1, { isStatic: true, angle: Math.PI * 0.5 })
  // add feed
  World.add(engine.world, [
    //ramps
    Bodies.rectangle(feedCenterX, feedPointY - feedHeight/2, feedLength, 1, { isStatic: true, angle: feedAngle }),
    Bodies.rectangle(feedCenterX - holeSize/2, feedPointY - feedHeight - feedHeight/2 - holeSize*0.8, feedLength - holeSize, 1, { isStatic: true, angle: feedAngle*-1 }),
    //block
    Bodies.rectangle(feedPointX + feedTotalWidth, feedPointY - feedHeight - blockSize/2 , blockSize, 5, { isStatic: true, angle: Math.PI * 0.5 }),
    //guide
    feedGuide,
    Bodies.rectangle(feedPointX, feedPointY + pieceDiameter, pieceDiameter * 2, 1, { isStatic: true, angle: -Math.PI * 0.5 })
  ]);

  var boxStartX = feedPointX
  var gap = pieceDiameter*1
  var boxStartY = feedPointY - feedHeight*2  - holeSize*0.8  - gap
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

  var colours = {
    0:"#991111",
    1:"#945671",
    2:"#001111",
    3:"#991199",
    4:"#991111",
    5:"#661111",
    6:"#99ee11",
    7:"#9911aa",
    8:"#995511",
    9:"#221111",
  }
  for(var i=0; i<10; i++){
    for(var j=0; j<timesTable; j++){
      pieces.push( Bodies.circle(ballStartX + i*pieceDiameter, ballStartY - j*pieceDiameter, pieceDiameter/2, { friction: ballFriction, restitution: ballRestitution, 
        frictionAir: ballFrictionAir, density: ballDensity, slop:ballSlop, render: { fillStyle: colours[i] } }) )
    }
  }

  World.add(engine.world, pieces)

  Engine.run(engine);

  var hasSupport1 = false
  var hasSupport2 = false
  var hasSupport3 = false
  var hasSupport4 = false
  var button = document.getElementById('drop-button')


  var baseHeight = bottomY - (boxHeightAdjust/2)
  var channelHeight = pieceDiameter + 2
  var hasSupport = []
  var heightForGuide = function(num){
    return(baseHeight - (num*channelHeight))
  }

  console.log('butto dn', button)
  button.addEventListener('click', function(ev){
    Matter.Body.translate(bottom, {x:20, y:0})
    var count = 0;
    pieces.forEach(function(piece){
      // console.log('piece', piece)
      console.log('piece', piece)
      // piece.setStatic(true)
      if(piece.position.y > feedPointY){
        console.log('setting static')
        count++;
        // Matter.Body.setStatic(piece, true);
      }
      // if(count >=10){
        // console.log('more than ten pieces adding helper')
       

      // }
      // Matter.Sleeping(piece, true)
    })

    for(var i=0 ;i<10;i++){    
      if(!hasSupport[i] && count >= (i+1)*10){
        console.log('adding a shoot')
        World.add(engine.world, [Bodies.rectangle(centerX, heightForGuide(i+1), boxWidth, 1, { isStatic: true, angle: boxAngle })])
        hasSupport[i] = true;
        if(i==7){
          Matter.Body.translate(feedGuide, {x:0, y: -1.5 * pieceDiameter})
        }
      }
    }
  });

  console.log('engine', engine)

  var ctx = engine.render.context;

  var heightOffset = boxHeightAdjust/10

  var xMove = boxWidth/10
  Events.on(engine, 'afterTick',  function(ev){
    ctx.beginPath()
    for(var i=1; i<11; i++){
      ctx.moveTo(boxLeftX, bottomY - (channelHeight*i));
      ctx.lineTo(boxRightX, bottomY - boxHeightAdjust - (channelHeight*i));
    };
    for(var i=1; i<10; i++){
      ctx.moveTo(boxLeftX + xMove*i, bottomY - (heightOffset*i));
      ctx.lineTo(boxLeftX + xMove*i, bottomY - (heightOffset*i) - boxHeight -pieceDiameter);
    }
    ctx.stroke();   
  });

}

