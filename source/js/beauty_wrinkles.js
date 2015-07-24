/*
 * 去皺套用
 */
var bwView = document.querySelector('#bwView');
var ctx_bwView = bwView.getContext('2d');
var bwHeadBar =  document.querySelector('#bwHeadBar');
var bwFootBar =  document.querySelector('#bwFootBar');
var btnBWSave = document.querySelector('#bwSave');
var btnCancelBw = document.querySelector('#cancelBw');

var bwMode = "wrinkles";
var bwPos = new Object();
bwPos.x = 100;
bwPos.y = 100;
bwPos.r = 2;
var drawPhotoImg = null;
//var bakDrawPhotoImg = null;
var imageData = null;
var pixelArray = null;
var bakPixelArray = null;
//var mosaic={x:10,y:10};
var isMousePressed = false;

$( "#bwPage" ).on( "pagebeforeshow", function( event, ui ) {
  openLoading("載入中...");
  setInterval(bwPS,1000/60);//30fps
  drawBWPage();
  $("#slider-wrinkles").on("change", function(e) {
    e.preventDefault();
    var r = $("#slider-wrinkles").val();
    bwPos.r = parseInt(r);
  });
});

$( "#bwPage" ).on( "pageshow", function( event, ui ) {
  closeLoading();
});

//$( "#bwPage" ).on( "pagebeforehide", function( event, ui ) {
//});


function bwPageInit() {
  //console.log("bmPageInit()");
  btnBWSave.addEventListener('click', bwSave, false);
  btnCancelBw.addEventListener('click', function(){doCancel(editOriSrc,0);}, false);
  if(supportTouch) {
    bwView.addEventListener('touchstart', onMouseDownBW, false);
    bwView.addEventListener('touchmove', onMouseMoveBW, false);
    bwView.addEventListener('touchend', onMouseUpBW, false);
  } else {
    bwView.addEventListener('mousedown', onMouseDownBW, false);
    bwView.addEventListener('mousemove', onMouseMoveBW, false);
    bwView.addEventListener('mouseup', onMouseUpBW, false);
  }
  $("#wrinkles_btn").click(function(){
    if($("#wrinkles_slider").is(":hidden")) {
      $("#wrinkles_slider").fadeIn(500);
      $("#wrinkles_btn span").text("隱藏");
    } else {
      $("#wrinkles_slider").fadeOut(500);
      $("#wrinkles_btn span").text("顯示");
    }
  });
}

function drawBWPage() {
  if( $('#bwHeadBar').height() > 0 && $('#bwFootBar').height() >0){
    photoImg.src = editOriSrc;
    var info = drawView( bwView, ctx_bwView,$('#bwHeadBar').height() + $('#bwFootBar').height(),
      photoImg, photoImg.width, photoImg.height, null, null, null, null, true);
    //console.log("info=",info);
    drawPhotoImg = new Image();
    drawPhotoImg.src = bwView.toDataURL();
    imageData=ctx_bwView.getImageData(0,0,info.viewWidth,info.viewHeight);
    //console.log(imageData);
    pixelArray=imageData.data;
    bakPixelArray = new Array(pixelArray.length);
    for(var i=0;i<pixelArray.length;i++)
      bakPixelArray[i]=pixelArray[i];
  }
  else
    setTimeout(drawBWPage,100);
}

function bwPS() {
  ctx_bwView.clearRect(0,0,bwView.width,bwView.height);

  if(drawPhotoImg) {
    drawView( bwView, ctx_bwView,$('#bwHeadBar').height() + $('#bwFootBar').height(),
      drawPhotoImg, drawPhotoImg.width, drawPhotoImg.height, null, null, null, null, true);
  }

  if(bwPos && bwPos.r) {
    drawRangeCircle(ctx_bwView,"#66CCFF",bwPos.x,bwPos.y,bwPos.r*5);
  }
}

function onBWSave() {
  closeLoading();
}

function bwSave() {
  if(fname) {
    openLoading("照片儲存中...");
    drawPhotoImg.src = saveABView(drawPhotoImg);
    saveImage(fname+".jpg",drawPhotoImg.src,onBWSave);
    ctx_photo.clearRect(0,0,photo.width,photo.height);
    drawView( photo, ctx_photo,$('#bwHeadBar').height() + $('#bwFootBar').height(),
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

function onMouseDownBW(e) {
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

  bwPos.x = sPos.x;
  bwPos.y = sPos.y;
  isMousePressed = true;
  if(isMousePressed && sPos)
    drawPhotoImg.src = wrinklesProcess(bwView, ctx_bwView, bwPos);
}

function onMouseMoveBW(e) {
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
  bwPos.x = nx;
  bwPos.y = ny;
  //console.log(bmMode);
  if(bwMode=="wrinkles") {
    if(isMousePressed && sPos)
      drawPhotoImg.src = wrinklesProcess(bwView, ctx_bwView, bwPos);
  }
}

function onMouseUpBW(e) {
  e.preventDefault();
  isMousePressed = false;
}

function wrinklesProcess(canvas, ctx, pos) {
  var ra = pos.r;

  var x0 = Math.floor(pos.x-ra);
  var y0 = Math.floor(pos.y-ra);
  var x1 = Math.floor(pos.x-ra);
  var y1 = Math.floor(pos.y+ra);

  var x2 = Math.floor(pos.x+ra);
  var y2 = Math.floor(pos.y-ra);
  var x3 = Math.floor(pos.x+ra);
  var y3 = Math.floor(pos.y+ra);

  var r0 = pixelArray[(y0*drawPhotoImg.width+x0)*4];
  var g0 = pixelArray[(y0*drawPhotoImg.width+x0)*4+1];
  var b0 = pixelArray[(y0*drawPhotoImg.width+x0)*4+2];
  var a0 = pixelArray[(y0*drawPhotoImg.width+x0)*4+3];

  var r1 = pixelArray[(y1*drawPhotoImg.width+x1)*4];
  var g1 = pixelArray[(y1*drawPhotoImg.width+x1)*4+1];
  var b1 = pixelArray[(y1*drawPhotoImg.width+x1)*4+2];
  var a1 = pixelArray[(y1*drawPhotoImg.width+x1)*4+3];

  var r2 = pixelArray[(y2*drawPhotoImg.width+x2)*4];
  var g2 = pixelArray[(y2*drawPhotoImg.width+x2)*4+1];
  var b2 = pixelArray[(y2*drawPhotoImg.width+x2)*4+2];
  var a2 = pixelArray[(y2*drawPhotoImg.width+x2)*4+3];

  var r3 = pixelArray[(y3*drawPhotoImg.width+x3)*4];
  var g3 = pixelArray[(y3*drawPhotoImg.width+x3)*4+1];
  var b3 = pixelArray[(y3*drawPhotoImg.width+x3)*4+2];
  var a3 = pixelArray[(y3*drawPhotoImg.width+x3)*4+3];

  var r = (r0+r1+r2+r3)/4;
  var g = (g0+g1+g2+g3)/4;
  var b = (b0+b1+b2+b3)/4;
  var a = (a0+a1+a2+a3)/4;
  var x = Math.floor(pos.x);
  var y = Math.floor(pos.y);
  //console.log(r,g,b,a);

  for(var i=-ra;i<ra;i++) {
    for(var j=-ra;j<ra;j++) {
      var rr = Math.sqrt(i*i+j*j);
      if(rr<ra) {
        pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4]=r;//R
        pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4+1]=g;//G
        pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4+2]=b;//B
        pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4+3]=a;//A
      }
    }
  }

  ctx.putImageData(imageData,0,0);
  //drawBraCircle(ctx,"blue",x0,y0,1);
  //drawBraCircle(ctx,"blue",x1,y1,1);
  //drawBraCircle(ctx,"blue",x2,y2,1);
  //drawBraCircle(ctx,"blue",x3,y3,1);
  return  canvas.toDataURL();
}
