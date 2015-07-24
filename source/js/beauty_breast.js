/*
 * 豐胸套用
 */
var bbView = document.querySelector('#bbView');
var ctx_bbView = bbView.getContext('2d');
var bbHeadBar =  document.querySelector('#bbHeadBar');
var bbFootBar =  document.querySelector('#bbFootBar');
var btnBbSave = document.querySelector('#bbSave');
var btnCancelBb = document.querySelector('#cancelBb');

var bbMode = "None";
var leftBraRect = null;
var rightBraRect = null;
var leftBraPos = null;
var rightBraPos = null;

var targetRect = null;
var targetPos = null;
//var fetchFaceData = false;
var drawPhotoImg = null;
var bakDrawPhotoImg = null;
var debugObj = null;
var sPos = null;
var bRect = null;
var bPos = null;
var mRadius = 40;
var sRadius = 25;
var showRangebb = true;
var defaultX1 = -100, defaultY1 = 100;
var defaultX2 = 150, defaultY2 = 100;
var ww = 0;
var hh = 0;

$( "#bbPage" ).on( "pagebeforeshow", function( event, ui ) {
  //$("#slider-step").val("1");
  fetchFaceData = false;
  //alert("YY");
  openLoading("載入中...");

  setInterval(bbPS,1000/60);//30fps
  drawBBPage();

  $("#slider-bra").on("slidestop", function(e) {
    e.preventDefault();
    //alery("xx");
    openLoading("處理中...");
    var bra = -($("#slider-bra").val()/100);
    var data = pinchEffect(leftBraPos,rightBraPos,bakDrawPhotoImg,bra);
    drawPhotoImg.src = data;
    closeLoading();
  });

});

$( "#bbPage" ).on( "pageshow", function( event, ui ) {
  closeLoading();
});

//$( "#bbPage" ).on( "pagebeforehide", function( event, ui ) {
//});


function bbPageInit() {
  //console.log("beautyPageInit()",btnGotoCustom01);
  btnBbSave.addEventListener('click', bbSave, false);
  btnCancelBb.addEventListener('click', function(){doCancel(editOriSrc,0);}, false);
  if(supportTouch) {
    bbView.addEventListener('touchstart', onMouseDownBB, false);
    bbView.addEventListener('touchmove', onMouseMoveBB, false);
    bbView.addEventListener('touchend', onMouseUpBB, false);
  } else {
    bbView.addEventListener('mousedown', onMouseDownBB, false);
    bbView.addEventListener('mousemove', onMouseMoveBB, false);
    bbView.addEventListener('mouseup', onMouseUpBB, false);
  }
  $("#breast_btn").click(function(){
    if($("#breast_slider").is(":hidden")){
      $("#breast_slider").fadeIn(500);
      $("#breast_btn span").text("隱藏");
    }
    else{
      $("#breast_slider").fadeOut(500);
      $("#breast_btn span").text("顯示");
    }
  });
}

function drawBBPage() {
  if( $('#bbHeadBar').height() > 0 && $('#bbFootBar').height() >0){
    //console.log($('#bbHeadBar').height() + $('#bbFootBar').height());
    var face = $("#slider-bra").val()/100;
    //console.log("face=",face,"eye=",eye);
    //closeLoading();
    //abPS();
    //console.log(val1,val2);
    //openLoading("套用中...");
    ww = $(window).width()/2;
    hh = $(window).height()/2;
    //console.log("ww=",ww,"hh=",hh);
    photoImg.src = editOriSrc;
    drawView( bbView, ctx_bbView,$('#bbHeadBar').height() + $('#bbFootBar').height(),
      photoImg, photoImg.width, photoImg.height, null, null, null, null, true);
    drawPhotoImg = new Image();
    drawPhotoImg.src = bbView.toDataURL();
    bakDrawPhotoImg = new Image();
    bakDrawPhotoImg.src = drawPhotoImg.src;
    console.log(drawPhotoImg.src);

    leftBraPos = new Object();
    leftBraPos.x = ww+defaultX1;
    leftBraPos.y = hh+defaultY1;
    leftBraPos.r = mRadius;
    rightBraPos = new Object();
    rightBraPos.x = ww+defaultX2;
    rightBraPos.y = hh+defaultY2;
    rightBraPos.r = mRadius;

    leftBraRect = new Rect(ww+defaultX1-mRadius,hh+defaultY1-mRadius,mRadius*2,mRadius*2);
    rightBraRect = new Rect(ww+defaultX2-mRadius,hh+defaultY2-mRadius,mRadius*2,mRadius*2);
    //closeLoading();
  }
  else
    setTimeout(drawBBPage,100);
}

function drawBraCircle(ctx, color, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawBraRect(ctx, color, x, y, w, h) {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.rect(x,y,w,h);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x+w, y+h, 20, 0, 2 * Math.PI, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function bbPS() {
  ctx_bbView.clearRect(0,0,bbView.width,bbView.height);

  if(drawPhotoImg) {
    drawView( bbView, ctx_bbView,$('#bbHeadBar').height() + $('#bbFootBar').height(),
      drawPhotoImg, drawPhotoImg.width, drawPhotoImg.height, null, null, null, null, true);
  }
  if(leftBraRect && showRangebb) {
    drawBraCircle(ctx_bbView,"#66CCFF",leftBraPos.x,leftBraPos.y,leftBraPos.r);
    drawBraRect(ctx_bbView,"#66CCFF",leftBraRect.x,leftBraRect.y,leftBraRect.w,leftBraRect.h);
  }
  if(rightBraRect && showRangebb) {
    drawBraCircle(ctx_bbView,"#66CCFF",rightBraPos.x,rightBraPos.y,rightBraPos.r);
    drawBraRect(ctx_bbView,"#66CCFF",rightBraRect.x,rightBraRect.y,rightBraRect.w,rightBraRect.h);
  }
  //if(debugObj)
  //  writeMessage(ctx_bbView, debugObj.msg, debugObj.pos);
}

function onBBSave() {
  closeLoading();
}

function bbSave() {
  //console.log("fname=",fname);
  if(fname) {
    //console.log(fname+".jpg",photoImg.src);
    openLoading("照片儲存中...");
    drawPhotoImg.src = saveABView(drawPhotoImg);
    saveImage(fname+".jpg",drawPhotoImg.src,onBBSave);
    //loadImage(fname+".jpg",photo);
    ctx_photo.clearRect(0,0,photo.width,photo.height);
    drawView( photo, ctx_photo,$('#bbHeadBar').height() + $('#bbFootBar').height(),
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

function onMouseDownBB(e) {
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
  if(leftBraRect && leftBraRect.in4thPoint(sPos.x,sPos.y,25)) {
    targetRect = leftBraRect;
    targetPos = leftBraPos;
    bRect = new Object();
    bRect.x = leftBraRect.x;
    bRect.y = leftBraRect.y;
    bRect.w = leftBraRect.w;
    bRect.h = leftBraRect.h;
    bPos = new Object();
    bPos.x = targetPos.x;
    bPos.y = targetPos.y;
    bPos.r = targetPos.r;
    bbMode = "Scale";
  }
  else if(leftBraRect && leftBraRect.inRect(sPos.x,sPos.y)) {
    targetRect = leftBraRect;
    targetPos = leftBraPos;
    bRect = new Object();
    bRect.x = leftBraRect.x;
    bRect.y = leftBraRect.y;
    bPos = new Object();
    bPos.x = targetPos.x;
    bPos.y = targetPos.y;
    bbMode = "Move";
  }
  if(rightBraRect && rightBraRect.in4thPoint(sPos.x,sPos.y,25)) {
    targetRect = rightBraRect;
    targetPos = rightBraPos;
    bRect = new Object();
    bRect.x = rightBraRect.x;
    bRect.y = rightBraRect.y;
    bRect.w = rightBraRect.w;
    bRect.h = rightBraRect.h;
    bPos = new Object();
    bPos.x = targetPos.x;
    bPos.y = targetPos.y;
    bPos.r = targetPos.r;
    bbMode = "Scale";
  }
  else if(rightBraRect && rightBraRect.inRect(sPos.x,sPos.y)) {
    targetRect = rightBraRect;
    targetPos = rightBraPos;
    bRect = new Object();
    bRect.x = rightBraRect.x;
    bRect.y = rightBraRect.y;
    bPos = new Object();
    bPos.x = rightBraPos.x;
    bPos.y = rightBraPos.y;
    bbMode = "Move";
  }
  //console.log(targetRect);
}

function onMouseMoveBB(e) {
  //console.log("onMouseMove",supportTouch,e.touches[0].pageX,e.touches[0].pageY );
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
  if(bbMode=="Move") {
    var dx = nx - sPos.x;
    var dy = ny - sPos.y;
    targetRect.x = bRect.x + dx;
    targetRect.y = bRect.y + dy;
    targetPos.x = bPos.x + dx;
    targetPos.y = bPos.y + dy;
  }
  if(bbMode=="Scale") {
    //var oldx = targetRect.x + targetRect.w;
    //var oldy = targetRect.y + targetRect.h;
    console.log("mode=scale, targetRect.w=",targetRect.w);
    var dx = nx - sPos.x;
    var dy = ny - sPos.y;
    //var rr = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
    var r = Math.max(dx,dy);
    console.log("dx=",dx,"dy=",dy,"r=",r);
    //targetRect.w = bRect.w + r;
    //targetRect.h = bRect.h + r;
    console.log("!!!! r=",r," bPos.r=",bPos.r);
    if(r+bPos.r>=sRadius) {
      targetRect.w = bRect.w + r;
      targetRect.h = bRect.h + r;
      targetRect.x = bRect.x - r/2;
      targetRect.y = bRect.y - r/2;
      targetPos.r = targetRect.w/2;
      targetPos.x = bPos.x;
      targetPos.y = bPos.y;
    }
  }
}

function onMouseUpBB(e) {
  //console.log("onMouseUp",e);
  e.preventDefault();
  if(bbMode=="None")
    showRangebb = !showRangebb;
  bbMode = "None";
  targetRect = null;
  targetPos = null;
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

function writeMessage(ctx, message,pos) {
  ctx.font = '12pt Calibri';
  ctx.fillStyle = 'white';
  ctx.fillText(message, pos.x, pos.y);
}
