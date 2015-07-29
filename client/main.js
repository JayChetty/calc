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

  var numBoxes = 10

  var timesTable = 3;

  var ballBoxStartX = 500;
  var ballStartX = ballBoxStartX+ 10;
  var bottomWidth = 100

  var firstLineTopY = bottomY - boxHeightAdjust - pieceDiameter;
  var boxLeftX = centerX - boxWidth/2
  var boxRightX = centerX + boxWidth/2
  
  var addGround = function(){
  // add ground
    World.add(engine.world, [
      Bodies.rectangle(centerX, bottomY, width, 1, { isStatic: true, angle: 0 }),
    ]);
  }

  var addCatchBox = function(){
  //add catch box
    World.add(engine.world, [
      //bottom
      Bodies.rectangle(centerX, bottomY - boxHeightAdjust/2, boxWidth+pieceDiameter/2, 1, { isStatic: true, angle: boxAngle }),
      //walls
      Bodies.rectangle(boxLeftX, bottomY - boxHeight/2, boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }),
      Bodies.rectangle(boxRightX, bottomY - boxHeightAdjust - (boxHeight/2), boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }),
    ]);
  }

  //feed variables
  var feedAngle = -Math.PI * 0.04
  var feedPointX = centerX + boxWidth/2;
  var feedPointY = bottomY - boxHeight - boxHeightAdjust - pieceDiameter
  var feedTotalWidth = width - feedPointX
  var feedLength = feedTotalWidth / Math.cos(feedAngle)
  var feedHeight = (feedTotalWidth * Math.tan(feedAngle)) * -1
  var feedCenterX = feedPointX + feedTotalWidth/2
  var blockSize = pieceDiameter*3
  var holeSize = pieceDiameter * 1.2
  var feedGuide = Bodies.rectangle(feedPointX - pieceDiameter, feedPointY, pieceDiameter * 5, 1, { isStatic: true, angle: Math.PI * 0.5 })
  // add feed

  var addFeed = function(){
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
  }

  var gap = pieceDiameter*1 
  var boxStartY = feedPointY - feedHeight*2  - holeSize*0.8  - gap  
  var bottomWidth = numBoxes*pieceDiameter 
  var bottom;//global so other drop can access


  var addPieceBox = function(startX, startY, numBoxes, piecesPerBox, pieceDiameter, world){ 
    var boxHeight = piecesPerBox*pieceDiameter
    var bottomWidth = numBoxes*pieceDiameter 
    var ballBoxBodies = [];
    bottom = Bodies.rectangle(startX+ bottomWidth/2, boxStartY, bottomWidth, 1, { isStatic: true, angle: 0 });
    //add box columns
    for(var i=0; i<numBoxes+1; i++){// we need 11 lines to create 10 boxes
      ballBoxBodies.push( Bodies.rectangle(startX + (i*pieceDiameter), boxStartY - boxHeight/2, boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }) )   
    }
    World.add(engine.world, ballBoxBodies)
    //add protector
    World.add(engine.world, [
      Bodies.rectangle(startX, startY + gap/2, gap, 1, { isStatic: true, angle: Math.PI * 0.5 }),
    ]);
    //add bottom       
    World.add(engine.world, [bottom])
  }
  var pieces;

  var addPieces = function(startX, startY, numBoxes, piecesPerBox, pieceDiameter, world){
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
    var ballFriction = 0.00001;
    var ballRestitution = 0.0000001;
    var ballDensity = 0.00000001;
    var ballSlop = 0.0000000;
    var ballFrictionAir = 0.005;

    pieces = []
    for(var i=0; i<numBoxes; i++){
      for(var j=0; j<timesTable; j++){
        pieces.push( Bodies.circle(ballStartX + i*pieceDiameter, ballStartY - j*pieceDiameter, pieceDiameter/2, { friction: ballFriction, restitution: ballRestitution, 
          frictionAir: ballFrictionAir, density: ballDensity, slop:ballSlop, render: { fillStyle: colours[i] } }) )
      }
    }

    World.add(world, pieces)
  }

  var ballStartX = feedPointX + pieceDiameter/2
  var ballStartY = boxStartY - pieceDiameter/2

  var drawAll = function(){
    addGround();
    addCatchBox();
    addFeed();
    addPieceBox(feedPointX, boxStartY, numBoxes, timesTable, pieceDiameter, engine.world);
    addPieces(ballStartX, ballStartY, numBoxes, timesTable, pieceDiameter, engine.world);
  }

  drawAll()

  Engine.run(engine);


  var button = document.getElementById('drop-button')
  var baseHeight = bottomY - (boxHeightAdjust/2)
  var channelHeight = pieceDiameter + 2
  var hasSupport = []
  var heightForGuide = function(num){
    return(baseHeight - (num*channelHeight))
  }


  var addShoot = function(){
    var count = 0;
    pieces.forEach(function(piece){
      if(piece.position.y > feedPointY){
        count++;
      }
    })

    for(var i=0 ;i<10;i++){    
      if(!hasSupport[i] && count >= (i+1)*10){
        World.add(engine.world, [Bodies.rectangle(centerX, heightForGuide(i+1), boxWidth, 1, { isStatic: true, angle: boxAngle })])
        hasSupport[i] = true;
        if(i==7){
          Matter.Body.translate(feedGuide, {x:0, y: -1.5 * pieceDiameter})
        }
      }
    }    
  }

  var drop = function(){
    Matter.Body.translate(bottom, {x:20, y:0})
    addShoot()
  }

  button.addEventListener('click', function(ev){
    drop();
  });


  var ctx = engine.render.context;

  var heightOffset = boxHeightAdjust/10
  var xGridSize = boxWidth/10
  Events.on(engine, 'afterRender',  function(ev){
    ctx.save();
    ctx.strokeStyle =" blue";
    ctx.setLineDash([1, 2]);
    ctx.beginPath()

    for(var i=1; i<11; i++){
      ctx.moveTo(boxLeftX, bottomY - (channelHeight*i));
      ctx.lineTo(boxRightX, bottomY - boxHeightAdjust - (channelHeight*i));
    };
    for(var i=1; i<10; i++){
      ctx.moveTo(boxLeftX + xGridSize*i, bottomY - (heightOffset*i));
      ctx.lineTo(boxLeftX + xGridSize*i, bottomY - (heightOffset*i) - boxHeight -pieceDiameter);
    }

    ctx.stroke();
    ctx.restore(); 
  });

  var findPredictionSquare = function(position){
    var xAdjust = position.x - boxLeftX
    console.log('xadjust', xAdjust);
    var xSquare = Math.ceil(xAdjust/xGridSize);
    console.log('xsquare', xSquare);
    if(!xSquare || xSquare<1 || xSquare>10){return null}
    var yAdjust = bottomY - position.y - (heightOffset*xSquare)
    console.log('yAdjust', yAdjust);
    var ySquare = Math.ceil(yAdjust/channelHeight);
    console.log('ySquare', ySquare)
    if(!ySquare || ySquare<1 || ySquare>10){return null}
    return{xSquare, ySquare}
  }

  Events.on(engine, 'mousedown', function(ev){
    console.log('mousedown',ev);
    var position = ev.mouse.mousedownPosition
    console.log('position', position)
    if(position.x <= boxRightX && position.x >= boxLeftX && position.y > feedPointY ){
      console.log('trying to find target')
      var target = findPredictionSquare(position)
      if(target){
        console.log('have target', target)
      }
    }
  })

  var inputNumBoxes = document.getElementById('num-boxes')
  inputNumBoxes.addEventListener('input', function(ev){
    console.log('on input changed', ev);
    var num = ev.target.valueAsNumber
    console.log('num boxes', num)
    numBoxes = num;
    Matter.World.clear ( engine.world )
    drawAll()
  })

  var inputPiecesPerBox = document.getElementById('pieces-per-box')
  inputPiecesPerBox.addEventListener('input', function(ev){
    console.log('on input changed', ev);
    var num = ev.target.valueAsNumber
    console.log('num', num)
    timesTable = num;
    Matter.World.clear ( engine.world )
    drawAll()
  })

}

