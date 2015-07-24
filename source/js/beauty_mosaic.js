/*
 * mosaic套用
 */
var bmView = document.querySelector('#bmView');
var ctx_bmView = bmView.getContext('2d');
var bmHeadBar =  document.querySelector('#bmHeadBar');
var bmFootBar =  document.querySelector('#bmFootBar');
var btnBMSave = document.querySelector('#bmSave');
var btnActiveEraser = document.querySelector('#activeEraser');
var btnActiveMosaic = document.querySelector('#activeMosaic');
var btnCancelBm = document.querySelector('#cancelBm');

var bmMode = "mosaic";
var bmPos = new Object();
bmPos.x = 100;
bmPos.y = 100;
bmPos.r = 50;
var drawPhotoImg = null;
//var bakDrawPhotoImg = null;
var imageData = null;
var pixelArray = null;
var bakPixelArray = null;
var mosaic={x:10,y:10};
var isMousePressed = false;
var ww = 0;
var hh = 0;

$( "#bmPage" ).on( "pagebeforeshow", function( event, ui ) {
  openLoading("載入中...");

  setInterval(bmPS,1000/60);//30fps
  drawBMPage();

  $("#slider-mosaic").on("change", function(e) {
    e.preventDefault();
    var r = $("#slider-mosaic").val();
    console.log("r=",r);
    bmPos.x = ww;
    bmPos.y = hh;
    bmPos.r = r;
  });
});

$( "#bmPage" ).on( "pageshow", function( event, ui ) {
  closeLoading();
});

//$( "#bbPage" ).on( "pagebeforehide", function( event, ui ) {
//});

function bmActiveEraser(e) {
  bmMode = "";
}

function bmActiveMosaic(e) {
  bmMode = "mosaic";
}

function bmPageInit() {
  //console.log("bmPageInit()");
  btnBMSave.addEventListener('click', bmSave, false);
  btnActiveEraser.addEventListener('click', bmActiveEraser, false);
  btnActiveMosaic.addEventListener('click', bmActiveMosaic, false);
  btnCancelBm.addEventListener('click', function(){doCancel(editOriSrc,0);}, false);
  if(supportTouch) {
    bmView.addEventListener('touchstart', onMouseDownBM, false);
    bmView.addEventListener('touchmove', onMouseMoveBM, false);
    bmView.addEventListener('touchend', onMouseUpBM, false);
  } else {
    bmView.addEventListener('mousedown', onMouseDownBM, false);
    bmView.addEventListener('mousemove', onMouseMoveBM, false);
    bmView.addEventListener('mouseup', onMouseUpBM, false);
  }
  $("#mosaic_btn").click(function(){
    console.log("mosaic_btn");
    if($("#mosaic_slider").is(":hidden")){
      $("#mosaic_slider").fadeIn(500);      
      $("#mosaic_btn span").text("隱藏");
    }
    else{
      $("#mosaic_slider").fadeOut(500);
      $("#mosaic_btn span").text("顯示");
    }
  });
}

function drawBMPage() {
  if( $('#bmHeadBar').height() > 0 && $('#bmFootBar').height() >0){
    var r = $("#slider-mosaic").val();
    bmPos.r = r;
    //openLoading("套用中...");
    ww = $(window).width()/2;
    hh = $(window).height()/2;

    photoImg.src = photoSrc;
    var info = drawView( bmView, ctx_bmView,$('#bmHeadBar').height() + $('#bmFootBar').height(),
      photoImg, photoImg.width, photoImg.height, null, null, null, null, true);
    //console.log("info=",info);
    drawPhotoImg = new Image();
    drawPhotoImg.src = bmView.toDataURL();
    imageData=ctx_bmView.getImageData(0,0,info.viewWidth,info.viewHeight);
    //console.log(imageData);
    pixelArray=imageData.data;
    //console.log("pixelArray=",pixelArray.length);
    bakPixelArray = new Array(pixelArray.length);
    for(var i=0;i<pixelArray.length;i++)
      bakPixelArray[i]=pixelArray[i];

    //bakDrawPhotoImg = new Image();
    //bakDrawPhotoImg.src = drawPhotoImg.src;
    //console.log(drawPhotoImg.src);
    /*
    leftBraPos = new Object();
    leftBraPos.x = defaultX1;
    leftBraPos.y = defaultY1;
    leftBraPos.r = mRadius;
    rightBraPos = new Object();
    rightBraPos.x = defaultX2;
    rightBraPos.y = defaultY2;
    rightBraPos.r = mRadius;
    leftBraRect = new Rect(defaultX1-mRadius,defaultY1-mRadius,mRadius*2,mRadius*2);
    rightBraRect = new Rect(defaultX2-mRadius,defaultY2-mRadius,mRadius*2,mRadius*2);
    */
    //closeLoading();
  }
  else
    setTimeout(drawBMPage,100);
}

function drawRangeCircle(ctx, color, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r/2, 0, 2 * Math.PI, false);
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function bmPS() {
  ctx_bmView.clearRect(0,0,bmView.width,bmView.height);

  if(drawPhotoImg) {
    drawView( bmView, ctx_bmView,$('#bmHeadBar').height() + $('#bmFootBar').height(),
      drawPhotoImg, drawPhotoImg.width, drawPhotoImg.height, null, null, null, null, true);
  }

  if(bmPos) {
    drawRangeCircle(ctx_bmView,"#66CCFF",bmPos.x,bmPos.y,bmPos.r);
  }
  /*
  if(rightBraRect) {
    drawBraCircle(ctx_bmView,"red",rightBraPos.x,rightBraPos.y,rightBraPos.r);
    drawBraRect(ctx_bmView,"green",rightBraRect.x,rightBraRect.y,rightBraRect.w,rightBraRect.h);
  }
  */
  //if(debugObj)
  //  writeMessage(ctx_bmView, debugObj.msg, debugObj.pos);
}

function onBMSave() {
  closeLoading();
}

function bmSave() {
  //console.log("fname=",fname);
  if(fname) {
    //console.log(fname+".jpg",photoImg.src);
    openLoading("照片儲存中...");
    drawPhotoImg.src = saveABView(drawPhotoImg);
    saveImage(fname+".jpg",drawPhotoImg.src,onBMSave);
    ctx_photo.clearRect(0,0,photo.width,photo.height);
    drawView( photo, ctx_photo,$('#bmHeadBar').height() + $('#bmFootBar').height(),
      drawPhotoImg, drawPhotoImg.width, drawPhotoImg.height, null, null, null, null, true);
  }
  $(function(){
    autoFFVal = 1;
    filterUsed = 0;
    faceShapingUsed = 0;
    $.mobile.changePage("#filterPage", {
      transition: "pop",
      reverse: false,
      changeHash: true
    });
  });
}

function onMouseDownBM(e) {
  //console.log("onMouseDown",e);
  e.preventDefault();
  if(supportTouch) {
    sPos = new Object();
    sPos.x = e.touches[0].pageX - this.offsetLeft;
    //sx = e.originalEvent.touches[0].pageX;
    sPos.y = e.touches[0].pageY - this.offsetTop;
    //sy = e.originalEvent.touches[0].pageY;
  } else {
    sPos = getMousePos(e);
    debugObj = new Object();
    debugObj.msg = "("+sPos.x+","+sPos.y+")";
    debugObj.pos = sPos;
  }

  bmPos.x = sPos.x;
  bmPos.y = sPos.y;
  isMousePressed = true;
}

function onMouseMoveBM(e) {
  e.preventDefault();
  var nx, ny;
  if(supportTouch) {
    nx = e.touches[0].pageX - this.offsetLeft;
    ny = e.touches[0].pageY - this.offsetTop;
  } else {
    var pos = getMousePos(e);
    nx = pos.x;
    ny = pos.y;
    debugObj = new Object();
    debugObj.msg = "("+nx+","+ny+")";
    debugObj.pos = pos;
  }
  bmPos.x = nx;
  bmPos.y = ny;
  //console.log(bmMode);
  if(bmMode=="mosaic") {
    if(isMousePressed && sPos)
      drawPhotoImg.src = mosaicProcess(bmView, ctx_bmView, bmPos);
  } else {
    if(isMousePressed && sPos)
      drawPhotoImg.src = normalProcess(bmView, ctx_bmView, bmPos);
  }
}

function onMouseUpBM(e) {
  e.preventDefault();
  isMousePressed = false;
}

function getMousePos(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  var rect = target.getBoundingClientRect();
  var pos={
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  //console.log("pos=",pos);
  return pos;
}

function mosaicProcess(canvas, ctx, pos) {
  //console.log(ctx,pos,ra);
  //console.log(photoImg.width,photoImg.height,drawPhotoImg.width,drawPhotoImg.height);
  //console.log("x=",pos.x,"y=",pos.y);
  //console.log("w=",drawPhotoImg.width,"h=",drawPhotoImg.height);
  var w = Math.floor(pos.r / 10);
  //console.log(w);
  var maxa = (w-1)*10+Math.floor(pos.x/mosaic.x)*10;
  var maxb = (w-1)*10+Math.floor(pos.y/mosaic.y)*10;
  for(var g=0;g<w;g++) {
    var a = (g-1)*10+Math.floor(pos.x/mosaic.x)*10;
    var b = (g-1)*10+Math.floor(pos.y/mosaic.y)*10;
    //console.log("a=",a,"b=",b);
    for(var i=0;i<drawPhotoImg.height;i+=mosaic.y) {
      //console.log("i=",i);
      for(var j=0;j<drawPhotoImg.width;j+=mosaic.x) {
        //console.log("j=",j);
        var num=0;
        var randomPixel={x:Math.floor(num*mosaic.x+i),y:Math.floor(num*mosaic.y+j)};
        //console.log("a=",a,"b=",b);
        if(a<=j && b<=i && j<maxa && i<maxb) {
          for(var k=j;k<j+mosaic.x;k++) {
            for(var l=i;l<i+mosaic.y;l++) {
              pixelArray[(l*drawPhotoImg.width+k)*4]=pixelArray[(randomPixel.x*drawPhotoImg.width+randomPixel.y)*4];//R
              pixelArray[(l*drawPhotoImg.width+k)*4+1]=pixelArray[(randomPixel.x*drawPhotoImg.width+randomPixel.y)*4+1];//G
              pixelArray[(l*drawPhotoImg.width+k)*4+2]=pixelArray[(randomPixel.x*drawPhotoImg.width+randomPixel.y)*4+2];//B
              pixelArray[(l*drawPhotoImg.width+k)*4+3]=pixelArray[(randomPixel.x*drawPhotoImg.width+randomPixel.y)*4+3];//A
              /*
              pixelArray[(l*drawPhotoImg.width+k)*4]=0;//R
              pixelArray[(l*drawPhotoImg.width+k)*4+1]=0;//G
              pixelArray[(l*drawPhotoImg.width+k)*4+2]=255;//B
              pixelArray[(l*drawPhotoImg.width+k)*4+3]=255;//A
              */
            }
          }
        }
      }
    }
  }
  ctx.putImageData(imageData,0,0);
  return  canvas.toDataURL();
}

function normalProcess(canvas, ctx, pos) {
  var w = Math.floor(pos.r / 10);
  var maxa = (w-1)*10+Math.floor(pos.x/mosaic.x)*10;
  var maxb = (w-1)*10+Math.floor(pos.y/mosaic.y)*10;
  for(var g=0;g<w;g++) {
    var a = (g-1)*10+Math.floor(pos.x/mosaic.x)*10;
    var b = (g-1)*10+Math.floor(pos.y/mosaic.y)*10;
    for(var i=0;i<drawPhotoImg.height;i+=mosaic.y) {
      for(var j=0;j<drawPhotoImg.width;j+=mosaic.x) {
        if(a<=j && b<=i && j<maxa && i<maxb) {
          for(var k=j;k<j+mosaic.x;k++) {
            for(var l=i;l<i+mosaic.y;l++) {
              pixelArray[(l*drawPhotoImg.width+k)*4]  =bakPixelArray[(l*drawPhotoImg.width+k)*4];//R
              pixelArray[(l*drawPhotoImg.width+k)*4+1]=bakPixelArray[(l*drawPhotoImg.width+k)*4+1];//G
              pixelArray[(l*drawPhotoImg.width+k)*4+2]=bakPixelArray[(l*drawPhotoImg.width+k)*4+2];//B
              pixelArray[(l*drawPhotoImg.width+k)*4+3]=bakPixelArray[(l*drawPhotoImg.width+k)*4+3];//A
            }
          }
        }
      }
    }
  }
  ctx.putImageData(imageData,0,0);
  return  canvas.toDataURL();
}
