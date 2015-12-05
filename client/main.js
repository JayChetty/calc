var Matter = require('matter-js')
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Events = Matter.Events;


window.startApp = function(height, width, pieceDiameter){
  console.log('app started', Matter);

  var height = height || 600;
  var width = width || 600;
  var prediction = null;

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
  
  var canvas = document.getElementsByTagName("canvas")[0];
  // canvas.height = height;
  // canvas.width = width;
  // console.log('canvas', canvas)

  var pieceDiameter = pieceDiameter || 19
  var adjust = pieceDiameter * 0.5
  var boxAngle = -Math.PI * 0.03
  var boxHeight = 10*pieceDiameter
  var boxHypotenuse = 10*pieceDiameter - adjust
  var boxWidth = boxHypotenuse * Math.cos(boxAngle)
  var boxHeightAdjust = -1 * (boxHypotenuse * Math.sin(boxAngle))

  var boxCenterX = boxWidth;

  console.log('boxHeightAdjust', boxHeightAdjust)

  var numBoxes = 3

  var piecesPerBox = 7;

  var ballBoxStartX = 500;
  var ballStartX = ballBoxStartX+ 10;
  var bottomWidth = 100

  var firstLineTopY = bottomY - boxHeightAdjust - pieceDiameter;
  var boxLeftX = boxCenterX - boxWidth/2
  var boxRightX = boxCenterX + boxWidth/2
  
  var addGround = function(){
  // add ground
    World.add(engine.world, [
      Bodies.rectangle(boxCenterX, bottomY, width, 1, { isStatic: true, angle: 0 }),
    ]);
  }

  var addCatchBox = function(){
  //add catch box
    World.add(engine.world, [
      //bottom
      Bodies.rectangle(boxCenterX, bottomY - boxHeightAdjust/2, boxWidth+pieceDiameter/2, 1, { isStatic: true, angle: boxAngle }),
      //walls
      Bodies.rectangle(boxLeftX, bottomY - boxHeight/2, boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }),
      Bodies.rectangle(boxRightX, bottomY - boxHeightAdjust - (boxHeight/2), boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }),
    ]);
  }

  //feed variables
  var feedAngle = -Math.PI * 0.04
  var feedPointX = boxCenterX + boxWidth/2;
  var feedPointY = bottomY - boxHeight - boxHeightAdjust - pieceDiameter
  var feedTotalWidth = pieceDiameter * 15
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
      Bodies.rectangle(feedPointX, feedPointY + pieceDiameter + 2, pieceDiameter * 2, 1, { isStatic: true, angle: -Math.PI * 0.5 })
    ]);
  }

  var gap = pieceDiameter*1 
  var boxStartY = feedPointY - feedHeight*2  - holeSize*0.8  - gap  
  var bottomWidth = numBoxes*pieceDiameter 
  var bottom;//global so other drop can access
  var boxColWidth = pieceDiameter


  var addPieceBox = function(startX, startY, numBoxes, piecesPerBox, pieceDiameter, world){ 
    var boxHeight = piecesPerBox*pieceDiameter
    var bottomWidth = numBoxes*pieceDiameter 
    var ballBoxBodies = [];
    bottom = Bodies.rectangle(startX+ bottomWidth/2, boxStartY, bottomWidth, 1, { isStatic: true, angle: 0 });
    //add box columns
    for(var i=0; i<numBoxes+1; i++){// we need 11 lines to create 10 boxes
      ballBoxBodies.push( Bodies.rectangle(startX + (i*boxColWidth), boxStartY - boxHeight/2, boxHeight, 1, { isStatic: true, angle: Math.PI * 0.5 }) )   
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
      2:"#ee1111",
      3:"#991199",
      4:"#116621",
      5:"#bbbb11",
      6:"#33ee99",
      7:"#556677",
      8:"#3355f1",
      9:"#221111",
    } 
    var ballFriction = 0.00001;
    var ballRestitution = 0.0000001;
    var ballDensity = 0.0000001;
    var ballSlop = 0.000000001;
    var ballFrictionAir = 0.01;

    pieces = []
    for(var i=0; i<numBoxes; i++){
      for(var j=0; j<piecesPerBox; j++){
        pieces.push( Bodies.circle(ballStartX + i*boxColWidth, ballStartY - j*pieceDiameter, pieceDiameter/2, { friction: ballFriction, restitution: ballRestitution, 
          frictionAir: ballFrictionAir, density: ballDensity, slop:ballSlop, render: { fillStyle: colours[i] } }) )
      }
    }

    World.add(world, pieces)
  }

  var ballStartX = feedPointX + pieceDiameter/2
  var ballStartY = boxStartY - pieceDiameter/2


  var dropAllbutton = document.getElementById('drop-button')
  var dropSectionbutton = document.getElementById('drop-section-button')
  var baseHeight = bottomY - (boxHeightAdjust/2)
  var channelHeight = pieceDiameter + 2
  var hasSupport = []
  var heightForGuide = function(num){
    return(baseHeight - (num*channelHeight))
  }


  // var addShoot = function(){
  //   var count = 0;
  //   pieces.forEach(function(piece){
  //     if(piece.position.y > feedPointY){
  //       count++;
  //     }
  //   })

  //   for(var i=0 ;i<10;i++){    
  //     if(!hasSupport[i] && count >= (i+1)*10){
  //       World.add(engine.world, [Bodies.rectangle(centerX, heightForGuide(i+1), boxWidth, 1, { isStatic: true, angle: boxAngle })])
  //       hasSupport[i] = true;
  //       if(i==7){
  //         Matter.Body.translate(feedGuide, {x:0, y: -1.5 * pieceDiameter})
  //       }
  //     }
  //   }    
  // }

  var drop = function(){
    Matter.Body.translate(bottom, {x:boxColWidth, y:0})
  }

  var inDrop = false;

  dropAllbutton.addEventListener('click', function(ev){
    started = true;
    inDrop = false;
    //drop();
  });


  dropSectionbutton.addEventListener('click', function(ev){
    drop();
  });


  var ctx = engine.render.context;

  var heightOffset = boxHeightAdjust/10
  var xGridSize = boxWidth/10

  var started = false;

  var droppedCount = 0
  var pieceCount = 0

  var shoot = 1;
  var ballsBelowShoot = 0;
  var pieceMoving;

  Events.on(engine, 'afterRender',  function(ev){
    // draw the grid lines
    ctx.save();
    ctx.setLineDash([1, 2]);
    ctx.beginPath()
    ctx.strokeStyle = "rgba(88,88,88,0.5)";
    for(var i=1; i<11; i++){
      ctx.moveTo(boxLeftX, bottomY - (channelHeight*i));
      ctx.lineTo(boxRightX, bottomY - boxHeightAdjust - (channelHeight*i));
    };
    for(var i=1; i<10; i++){
      ctx.moveTo(boxLeftX + xGridSize*i, bottomY - (heightOffset*i));
      ctx.lineTo(boxLeftX + xGridSize*i, bottomY - (heightOffset*i) - boxHeight -pieceDiameter);
    }

    ctx.stroke();


    if(prediction){
      console.log('have prediction', prediction)
      ctx.beginPath()
      //full boxes
      ctx.moveTo(boxLeftX, bottomY);
      ctx.lineTo(boxRightX, bottomY - boxHeightAdjust )
      ctx.lineTo(boxRightX, bottomY - boxHeightAdjust - (channelHeight * (prediction.y-1)))
      ctx.lineTo(boxLeftX, bottomY - (channelHeight* (prediction.y-1)));
      //partial box
      ctx.lineTo(boxLeftX + (xGridSize *prediction.x)  ,  bottomY - (channelHeight* (prediction.y-1)) - heightOffset*prediction.x )
      ctx.lineTo(boxLeftX + (xGridSize *prediction.x)  ,  bottomY - (channelHeight* (prediction.y-1)) - heightOffset*prediction.x - channelHeight )
      ctx.lineTo(boxLeftX, bottomY - (channelHeight* (prediction.y)));
      

      ctx.lineTo(boxLeftX, bottomY - (channelHeight));
      ctx.fillStyle = "rgba(20, 200, 244, 0.2)";
      ctx.fill()
      //draw path for 
    }else{
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "rgba(88, 88, 88, 1)";
      ctx.fillText("Click on box to make prediction", boxRightX + 1*pieceDiameter, bottomY - pieceDiameter*5);
    }  
    ctx.restore();



    // checking if should create shoot
    ballsBelowShoot = 0;
    pieceInCatchCount = 0;
    pieceMoving = false;

    //check what start the pieces are in to know if we need to do anything
    pieces.forEach(function(piece){
      if(piece.position.y > bottomY - pieceDiameter/2 - (channelHeight*shoot)){
        ballsBelowShoot++;
      }
      if(piece.position.y > feedPointY){
        pieceInCatchCount++;
      }
      if(piece.speed > 0.5){
        pieceMoving = true
      }
    })

    if(ballsBelowShoot >= shoot*10 && !pieceMoving){
      World.add(engine.world, [Bodies.rectangle(boxCenterX, heightForGuide(shoot), boxWidth, 1, { isStatic: true, angle: boxAngle })])
      shoot++
    }

    // checking if should drop
    if(pieceInCatchCount == droppedCount && !pieceMoving){
      inDrop = false;
    }
    if(started){
      if(!inDrop){
        drop()
        inDrop = true
        droppedCount += piecesPerBox;
      }
    }

    if(pieceInCatchCount == piecesPerBox*numBoxes && !pieceMoving){
      if(prediction){
        if((prediction.y-1) * 10 + prediction.x ==  piecesPerBox*numBoxes){
          alert('correct prediction')
        }else{
          alert('wrong predition')
        }
        prediction = null
      }
    }
    // drop if needed

  });

  var drawAll = function(){
    prediction = null;
    shoot = 1;
    droppedCount = 0;
    started = false;
    inDrop = false;
    addGround();
    addCatchBox();
    addFeed();
    addPieceBox(feedPointX, boxStartY, numBoxes, piecesPerBox, pieceDiameter, engine.world);
    addPieces(ballStartX, ballStartY, numBoxes, piecesPerBox, pieceDiameter, engine.world);
  }

  drawAll()
  Engine.run(engine);

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
    return{x:xSquare, y:ySquare}
  }

  Events.on(engine, 'mousedown', function(ev){
    console.log('mousedown',ev);
    var position = ev.mouse.mousedownPosition
    console.log('position', position)
    if(position.x <= boxRightX && position.x >= boxLeftX && position.y > feedPointY ){
      console.log('trying to find target')
      prediction = findPredictionSquare(position)
      // if(target){
      //   console.log('have target', target)
      //   prediction
      //   prediction = (target.y-1) * 10 + target.x
      // }
      console.log('prediction', prediction)
    }
  })




  var inputNumBoxes = document.getElementById('num-boxes')

  inputNumBoxes.setAttribute("value", numBoxes);

  inputNumBoxes.addEventListener('input', function(ev){
    console.log('on input changed', ev);
    var num = ev.target.valueAsNumber
    console.log('num boxes', num)
    numBoxes = num;
    Matter.World.clear ( engine.world )
    drawAll()
  })

  var inputPiecesPerBox = document.getElementById('pieces-per-box')

  inputPiecesPerBox.setAttribute("value", piecesPerBox);
  inputPiecesPerBox.addEventListener('input', function(ev){
    console.log('on input changed', ev);
    var num = ev.target.valueAsNumber
    console.log('num', num)
    piecesPerBox = num;
    Matter.World.clear ( engine.world )
    drawAll()
  })

}
