/*
 * 瘦臉瘦身套用
 */
var bsView = document.querySelector('#bsView');
var ctx_bsView = bsView.getContext('2d');
var bsHeadBar =  document.querySelector('#bsHeadBar');
var bsFootBar =  document.querySelector('#bsFootBar');
var btnBSSave = document.querySelector('#bsSave');
var btnCancelBs = document.querySelector('#cancelBs');

var isMousePressed = false;
var bsPos = new Object();
bsPos.x = 100;
bsPos.y = 100;
bsPos.r = 25;
bsPos.w = 50;
bsPos.h = 50;
var startPos = new Object();
startPos.r = 25;
startPos.w = 50;
startPos.h = 50;

var endPos = new Object();

var drawPhotoImg = null;
var rObj = null;

$( "#bsPage" ).on( "pagebeforeshow", function( event, ui ) {
  openLoading("載入中...");
  setInterval(bsPS,1000/60);//30fps
  drawBSPage();
  $("#slider-slim").on("change", function(e) {
    e.preventDefault();
    var r = $("#slider-slim").val();
    //console.log("r=",r);
    startPos.r = r/2;
    startPos.w = r;
    startPos.h = r;
    //console.log(startPos);
    bsPos.r = r/2;
    bsPos.w = r;
    bsPos.h = r;
  });
});

//$( "#beautyPage" ).on( "pagebeforehide", function( event, ui ) {
//});


function bsPageInit() {
  //console.log("beautyPageInit()",btnGotoCustom01);
  btnBSSave.addEventListener('click', bsSave, false);
  btnCancelBs.addEventListener('click', function(){doCancel(editOriSrc,0);}, false);
  if(supportTouch) {
    bsView.addEventListener('touchstart', onMouseDownBS, false);
    bsView.addEventListener('touchmove', onMouseMoveBS, false);
    bsView.addEventListener('touchend', onMouseUpBS, false);
  } else {
    bsView.addEventListener('mousedown', onMouseDownBS, false);
    bsView.addEventListener('mousemove', onMouseMoveBS, false);
    bsView.addEventListener('mouseup', onMouseUpBS, false);
  }

  $("#slim_btn").click(function(){
    if($("#slim_slider").is(":hidden")){
      $("#slim_slider").fadeIn(500);      
      $("#slim_btn span").text("隱藏");
    }
    else{
      $("#slim_slider").fadeOut(500);
      $("#slim_slider span").text("顯示");
    }
  });
}

function drawBSPage() {
  if( $('#bsHeadBar').height() > 0 && $('#bsFootBar').height() >0){
    //openLoading("套用中...");
    var r = $("#slider-slim").val();
    drawPhotoImg = new Image();
    drawPhotoImg.src = photoImg.src;
    closeLoading();
  }
  else
    setTimeout(drawBSPage,100);
}

function drawRangeRect(ctx, color, x, y, w, h) {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.rect(x,y,w,h);
  ctx.stroke();
}

//bsPS
function bsPS() {
  ctx_bsView.clearRect(0,0,bsView.width,bsView.height);
  if(drawPhotoImg) {
    rObj = drawView( bsView, ctx_bsView,$('#bsHeadBar').height() + $('#bsFootBar').height(),
      drawPhotoImg, drawPhotoImg.width, drawPhotoImg.height, null, null, null, null, true);
    //console.log(rObj);
  }

  if(bsPos) {
    drawRangeCircle(ctx_bsView,"#66CCFF",bsPos.x,bsPos.y,bsPos.r*2);
    //drawRangeRect(ctx_bsView,"green",bsPos.xx,bsPos.yy,bsPos.w,bsPos.h);
  }
}

function onMouseDownBS(e) {
  //console.log("onMouseDown",e);
  e.preventDefault();
  if(supportTouch) {
    startPos.x = e.touches[0].pageX - this.offsetLeft;
    var r = $("#slider-slim").val();
    startPos.r = r/2;
    startPos.w = r;
    startPos.h = r;
    startPos.xx = startPos.x - startPos.r;
    //sx = e.originalEvent.touches[0].pageX;
    startPos.y = e.touches[0].pageY - this.offsetTop;
    startPos.yy = startPos.y - startPos.r;
    //sy = e.originalEvent.touches[0].pageY;
  } else {
    startPos = getMousePos(e);
    var r = $("#slider-slim").val();
    startPos.r = r/2;
    startPos.w = r;
    startPos.h = r;
    startPos.xx = startPos.x - startPos.r;
    startPos.yy = startPos.y - startPos.r;
    debugObj = new Object();
    debugObj.msg = "("+startPos.x+","+startPos.y+")";
    debugObj.pos = startPos;
  }

  bsPos.x = startPos.x;
  bsPos.xx = bsPos.x - bsPos.r;
  bsPos.y = startPos.y;
  bsPos.yy = bsPos.y - bsPos.r;
  isMousePressed = true;
}

function onMouseMoveBS(e) {
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
  //console.log(rObj);
  bsPos.x = nx;
  bsPos.xx = nx - bsPos.r;
  bsPos.y = ny;
  bsPos.yy = ny - bsPos.r;
}

function onMouseUpBS(e) {
  e.preventDefault();
  if(isMousePressed && startPos) {
    var nx, ny;
    if(supportTouch) {
      nx = e.changedTouches[0].pageX - this.offsetLeft;
      ny = e.changedTouches[0].pageY - this.offsetTop;
    } else {
      var pos = getMousePos(e);
      nx = pos.x;
      ny = pos.y;
      debugObj = new Object();
      debugObj.msg = "("+nx+","+ny+")";
      debugObj.pos = pos;
    }
    endPos.x = nx;
    endPos.y = ny;
    //console.log("nx=",nx,"ny=",ny);
    drawPhotoImg.src = deformFaceDIY(startPos,endPos,drawPhotoImg);
//    console.log(drawPhotoImg.src);
  }
  isMousePressed = false;
}

function onBSSave() {
  closeLoading();
}

function bsSave() {
  //console.log("!!!!!!!!!!!!!!!!fname=",fname);
  if(fname) {
    openLoading("照片儲存中...");
    saveImage(fname+".jpg",drawPhotoImg.src,onBSSave);
    ctx_photo.clearRect(0,0,photo.width,photo.height);
    drawView( photo, ctx_photo,$('#bsHeadBar').height() + $('#bsFootBar').height(),
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
