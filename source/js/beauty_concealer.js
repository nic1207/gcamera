/*
 * 遮瑕套用
 */
var bcView = document.querySelector('#bcView');
var ctx_bcView = bcView.getContext('2d');
var bcHeadBar =  document.querySelector('#bcHeadBar');
var bcFootBar =  document.querySelector('#bcFootBar');
var btnBCSave = document.querySelector('#bcSave');
var btnCancelBc = document.querySelector('#cancelBc');
//var btnActiveEraser = document.querySelector('#activeEraser');
//var btnActiveMosaic = document.querySelector('#activeMosaic');

var bcMode = "concealer";
var bcPos = new Object();
bcPos.x = 100;
bcPos.y = 100;
bcPos.r = 2;
var drawPhotoImg = null;
//var bakDrawPhotoImg = null;
var imageData = null;
var pixelArray = null;
var bakPixelArray = null;
var mosaic={x:10,y:10};
var isMousePressed = false;

$( "#bcPage" ).on( "pagebeforeshow", function( event, ui ) {
  openLoading("載入中...");

  setInterval(bcPS,1000/60);//30fps
  drawBCPage();

  $("#slider-concealer").on("change", function(e) {
    e.preventDefault();
    var r = $("#slider-concealer").val();
    //console.log("r=",r);
    bcPos.r = r;
  });
});

$( "#bcPage" ).on( "pageshow", function( event, ui ) {
  closeLoading();
});

//$( "#bbPage" ).on( "pagebeforehide", function( event, ui ) {
//});


function bcPageInit() {
  //console.log("bmPageInit()");
  btnBCSave.addEventListener('click', bcSave, false);
  btnCancelBc.addEventListener('click', function(){doCancel(editOriSrc,0);}, false);
  //btnActiveEraser.addEventListener('click', bcActiveEraser, false);
  //btnActiveMosaic.addEventListener('click', bcActiveMosaic, false);
  if(supportTouch) {
    bcView.addEventListener('touchstart', onMouseDownBC, false);
    bcView.addEventListener('touchmove', onMouseMoveBC, false);
    bcView.addEventListener('touchend', onMouseUpBC, false);
  } else {
    bcView.addEventListener('mousedown', onMouseDownBC, false);
    bcView.addEventListener('mousemove', onMouseMoveBC, false);
    bcView.addEventListener('mouseup', onMouseUpBC, false);
  }
  $("#concealer_btn").click(function(){
    console.log("mosaic_btn");
    if($("#concealer_slider").is(":hidden")){
      $("#concealer_slider").fadeIn(500);
      $("#concealer_btn span").text("隱藏");
    }
    else{
      $("#concealer_slider").fadeOut(500);
      $("#concealer_btn span").text("顯示");
    }
  });
}

function drawBCPage() {
  if( $('#bcHeadBar').height() > 0 && $('#bcFootBar').height() >0){
    //var r = $("slider-concealer").val();
    //bcPos.r = r;
    //openLoading("套用中...");

    photoImg.src = photoSrc;
    var info = drawView( bcView, ctx_bcView,$('#bcHeadBar').height() + $('#bcFootBar').height(),
      photoImg, photoImg.width, photoImg.height, null, null, null, null, true);
    //console.log("info=",info);
    drawPhotoImg = new Image();
    drawPhotoImg.src = bcView.toDataURL();
    imageData=ctx_bcView.getImageData(0,0,info.viewWidth,info.viewHeight);
    //console.log(imageData);
    pixelArray=imageData.data;
    //console.log("pixelArray=",pixelArray.length);
    bakPixelArray = new Array(pixelArray.length);
    for(var i=0;i<pixelArray.length;i++)
      bakPixelArray[i]=pixelArray[i];
  }
  else
    setTimeout(drawBCPage,100);
}

function drawRangeCircle(ctx, color, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r/2, 0, 2 * Math.PI, false);
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function bcPS() {
  ctx_bcView.clearRect(0,0,bcView.width,bcView.height);

  if(drawPhotoImg) {
    drawView( bcView, ctx_bcView,$('#bcHeadBar').height() + $('#bcFootBar').height(),
      drawPhotoImg, drawPhotoImg.width, drawPhotoImg.height, null, null, null, null, true);
  }

  if(bcPos && bcPos.r) {
    drawRangeCircle(ctx_bcView,"#66CCFF",bcPos.x,bcPos.y,bcPos.r*10);
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

function onBCSave() {
  closeLoading();
}

function bcSave() {
  //console.log("fname=",fname);
  if(fname) {
    //console.log(fname+".jpg",photoImg.src);
    openLoading("照片儲存中...");
    drawPhotoImg.src = saveABView(drawPhotoImg);
    saveImage(fname+".jpg",drawPhotoImg.src,onBCSave);
    ctx_photo.clearRect(0,0,photo.width,photo.height);
    drawView( photo, ctx_photo,$('#bcHeadBar').height() + $('#bcFootBar').height(),
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

function onMouseDownBC(e) {
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

  bcPos.x = sPos.x;
  bcPos.y = sPos.y;
  isMousePressed = true;
  if(isMousePressed && sPos)
    drawPhotoImg.src = concealerProcess(bcView, ctx_bcView, bcPos);
}

function onMouseMoveBC(e) {
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
  bcPos.x = nx;
  bcPos.y = ny;
  //console.log(bmMode);
  if(bcMode=="concealer") {
    if(isMousePressed && sPos)
      drawPhotoImg.src = concealerProcess(bcView, ctx_bcView, bcPos);
  }
}

function onMouseUpBC(e) {
  e.preventDefault();
  isMousePressed = false;
}

function concealerProcess(canvas, ctx, pos) {
  var ra = pos.r;
  //console.log(ra);
  var data = new Uint8ClampedArray(ra*2*ra*2*4);
  var obj = new Object();
  var x = Math.floor(pos.x);
  var y = Math.floor(pos.y);
  var k = 0;
  for(var i=-ra;i<ra;i++) {
    for(var j=-ra;j<ra;j++) {
      data[k]=pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4];//R
      data[k+1]=pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4+1];//G
      data[k+2]=pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4+2];//B
      data[k+3]=pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4+3];//A
      k+=4;
    }
  }
  obj.data = data;
  obj.width = ra*2;
  obj.height = ra*2;
  JSManipulate.median.filter(obj);
  k = 0;
  for(var i=-ra;i<ra;i++) {
    for(var j=-ra;j<ra;j++) {
      pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4]=data[k];//R
      pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4+1]=data[k+1];//R
      pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4+2]=data[k+2];//R
      pixelArray[((y+j)*drawPhotoImg.width+(x+i))*4+3]=data[k+3];//R
      k+=4;
    }
  }
  ctx.putImageData(imageData,0,0);
  return  canvas.toDataURL();
}
