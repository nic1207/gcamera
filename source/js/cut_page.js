/*
 * 裁切
 */
var cutView = document.querySelector('#cutView');
var ctx_cutView = cutView.getContext('2d');
var cutHeadBar =  document.querySelector('#cutHeadBar');
var cutFootBar =  document.querySelector('#cutFootBar');

var btnResetCut = document.querySelector('#resetCut');
var btnPreviewCut = document.querySelector('#previewCut');
var btnScaleCut = document.querySelector('#scaleCut');
var btnSaveCut = document.querySelector('#saveCut');
var btnCancelCut = document.querySelector('#cancelCut');

var rectX = 0, rectY = 0, rectW = 200, rectH = 200;
var cutMode = "None";
var sx = 0,sy = 0, srx=0, sry=0;
var supportTouch = 'ontouchstart' in window;
var previewMode = false;
var cutPoint = 0;
var miniGrid = 93;
var pointSize = 15;
var centerX;
var retObj = null;

var cutPSInterval;

//var btnGotoCustom01 = document.querySelector('#gotoCustom01');

$( "#cutPage" ).on( "pagebeforeshow", function( event, ui ) {
  openLoading("載入中...");
  //console.log("fname=",fname);
  $("#slider-step").val("1");
  previewMode = false;
  setTimeout(drawCutPage,500);
});

//$( "#beautyPage" ).on( "pagebeforehide", function( event, ui ) {
//});


function cutPageInit() {
  btnSaveCut.addEventListener('click', doCutSave, false);
  btnResetCut.addEventListener('click', doResetCut, false);
  btnPreviewCut.addEventListener('click', doPreviewCut, false);
  btnScaleCut.addEventListener('click', doScaleCut, false);
  btnCancelCut.addEventListener('click', function(){doCancel(editOriSrc,0);}, false);

  if(supportTouch) {
    cutView.addEventListener('touchstart', onMouseDown, false);
    cutView.addEventListener('touchmove', onMouseMove, false);
    cutView.addEventListener('touchend', onMouseUp, false);
  } else {
    cutView.addEventListener('mousedown', onMouseDown, false);
    cutView.addEventListener('mousemove', onMouseMove, false);
    cutView.addEventListener('mouseup', onMouseUp, false);
  }
}

function onMouseDown(e) {
  //console.log("onMouseDown",e);
  e.preventDefault();
  if(supportTouch) {
    sx = e.touches[0].pageX - this.offsetLeft;
    //sx = e.originalEvent.touches[0].pageX;
    sy = e.touches[0].pageY - this.offsetTop;
    //sy = e.originalEvent.touches[0].pageY;
  } else {
    sx = e.offsetX;
    sy = e.offsetY;
  }
  //srx = rectX;
  //sry = rectY;
  if(in4Point(sx,sy,pointSize)) {
    //alert("scale mode");
    cutMode = "Scale";
    srx = rectW;
    sry = rectH;
    //console.log("in4Point(",sx,",",sy,")");
  } else if(inRect(sx,sy)) {
    //alert("move mode");
    cutMode = "Move";
    srx = rectX;
    sry = rectY;
    //console.log("inRect(",sx,",",sy,")");
  } else {
    //alert("none mode");
    //console.log("!inRect(",sx,",",sy,")");
    cutMode = "None";
  }
}

function onMouseUp(e) {
  //console.log("onMouseUp",e);
  e.preventDefault();
  cutMode = "None";
}

function onMouseMove(e) {
  //console.log("onMouseMove",supportTouch,e.touches[0].pageX,e.touches[0].pageY );
  e.preventDefault();
  var nx, ny;
  if(supportTouch) {
    nx = e.touches[0].pageX - this.offsetLeft;
    //nx = e.originalEvent.touches[0].pageX;
    ny = e.touches[0].pageY - this.offsetTop;
    //ny = e.originalEvent.touches[0].pageY;
  } else {
    nx = e.offsetX;
    ny = e.offsetY;

  }
  //console.log(nx,ny);
  if(cutMode=="Move") {
    var dx = nx - sx;
    var dy = ny - sy;
    //console.log(dx,dy);
    //console.log(srx,dx,nx,sx);
    rectX = srx + dx;
    //var radio = photoImg.width/photoImg.height;
    //centerX = (cutView.width - cutView.height*radio)/2;
    //console.log(centerX);
    if(rectX< centerX)
      rectX = centerX;
    //console.log("rectX=",rectX,"centerX=",centerX,"rectX-centerX=",rectX-centerX,"nx=",nx);
    rectY = sry + dy;
    if(rectY<0)
      rectY = 0;
  }

  if(cutMode=="Scale") {
    var dx = nx - sx;
    var dy = ny - sy;
    //console.log("cutPoint=",cutPoint);
    if(cutPoint==4) {
      rectW = srx + dx;
      rectH = sry + dy;
      if(rectW<miniGrid)
        rectW = miniGrid;
      if(rectH<miniGrid)
        rectH = miniGrid;
    } else if(cutPoint==2) {
      var oldx = rectX + rectW;
      var oldy = rectY + rectH;
      rectW = srx + dx;
      rectH = sry - dy;
      if(rectW<miniGrid)
        rectW = miniGrid;
      if(rectH<miniGrid)
        rectH = miniGrid;
      rectY = oldy - rectH;
      //console.log("rectW=",rectW,"rectH=",rectH,"rectY=",rectY,"rectX=",rectX,"oldx=",oldx,"oldy=",oldy);
    } else if(cutPoint==3) {
      var oldx = rectX + rectW;
      var oldy = rectY + rectH;
      rectW = srx - dx;
      rectH = sry + dy;
      if(rectW<miniGrid)
        rectW = miniGrid;
      if(rectH<miniGrid)
        rectH = miniGrid;
      rectX = oldx - rectW;
      //console.log("rectW=",rectW,"rectH=",rectH,"rectY=",rectY,"rectX=",rectX,"oldx=",oldx,"oldy=",oldy);
    } else if(cutPoint==1) {
      var oldx = rectX + rectW;
      var oldy = rectY + rectH;
      rectW = srx - dx;
      rectH = sry - dy;
      if(rectW<miniGrid)
        rectW = miniGrid;
      if(rectH<miniGrid)
        rectH = miniGrid;
      rectX = oldx - rectW;
      rectY = oldy - rectH;
      //console.log("rectW=",rectW,"rectH=",rectH,"rectY=",rectY,"rectX=",rectX,"oldx=",oldx,"oldy=",oldy);
    }
  }
}

function inRect(x,y) {
  //console.log("inRect() x=",x,"min=",rectX,"max=",rectX+rectW,"y=",y,"min=",rectY,"max=",rectY+rectH);
  if((x>rectX && x<rectX+rectW) &&(y>rectY && y<rectY+rectH) ) {
    //console.log("TRUE inRect()");
    return true;
  } else {
    return false;
  }
}

function in4Point(x,y,r) {
  //p1---p2
  //|    |
  //p3---p4

  //console.log("in4Point() x=",x,"min=",rectX+rectW-r,"max=",rectX+rectW+r);
  //console.log("in4Point() y=",y,"min=",rectY+rectH-r,"max=",rectY+rectH+r);
  if((x>=rectX-r && x<=rectX+r) &&(y>=rectY-r && y<=rectY+r) ) {//point1
    cutPoint = 1;
    //cutMode = "Scale_p1";
    return true;
  } else if((x>=rectX-r && x<=rectX+r) &&(y>=rectY+rectH-r && y<=rectY+rectH+r) ) {//point3
    cutPoint = 3;
    //cutMode = "Scale_p2";
    return true;
  } else if((x>=rectX+rectW-r && x<=rectX+rectW+r) &&(y>=rectY-r && y<=rectY+r) ) {//point2
    cutPoint = 2;
    //cutMode = "Scale_p3";
    return true;
  } else if((x>=rectX+rectW-r && x<=rectX+rectW+r) &&(y>=rectY+rectH-r && y<=rectY+rectH+r) ) {//point4
    cutPoint = 4;
    //cutMode = "Scale_p4";
    return true;
  } else
    return false;
}


function drawCutPage() {
  if( $('#cutHeadBar').height() > 0 && $('#cutFootBar').height() >0) {
    //cutPS();
    photoImg.src = photoSrc;
    //console.log(photoImg.src);
    cutPSInterval = setInterval(cutPS,1000/30);//30fps
    closeLoading();
  }
  else
    setTimeout(drawCutPage,100);
}

function cutPS() {
  //console.log("previewMode=",previewMode);
  var a = 1;
  if(retObj)
    a = retObj.a;
  //console.log("a=",a);
  //console.log(cutView.width,cutView.height);
  centerX = (cutView.width-cutView.height)/2;
  centerY = (cutView.height-cutView.width)/2;
  if(centerX<0)
    centerX = 0;
  if(centerY<0)
    centerY = 0;
  //if(centerX>rectX)
  //  rectX = centerX;
  var dy = $('#cutHeadBar').height() + $('#cutFootBar').height();
  ctx_cutView.clearRect(0,0,cutView.width,cutView.height);
  //console.log(centerX);
  if(previewMode) {
    //console.log(previewMode);
    //console.log("!!",rectX-centerX*retObj.a);
    //(rectX-centerX)
    console.log(rectX/retObj.a);
    drawPreview( cutView, ctx_cutView, dy,
      photoImg, rectW, rectH, rectX-centerX, rectY-centerY, retObj);
    //var ret = drawView( cutView, ctx_cutView, dy,
    //  photoImg, rectW, rectH, rectX-centerX, rectY, centerX, null, true, 0, false);
          
  } else {
    //drawPreview( cutView, ctx_cutView,$('#cutHeadBar').height() + $('#cutFootBar').height(),
    //  photoImg, null, null, null, null, centerX);
    //drawView(cutView, ctx_cutView,$('#cutHeadBar').height() + $('#cutFootBar').height(),
    //  photoImg, null, null, null, null, centerX);
    retObj = drawView( cutView, ctx_cutView,dy,
      photoImg, photoImg.width, photoImg.height, null, null, null, null, true, 0, false);
        
    var str = rectW + " X " + rectH;
    ctx_cutView.fillStyle="rgba(1,0,0,0.5)";
    ctx_cutView.fillRect(rectX,rectY,rectW,rectH);
    drawGrid(cutView, ctx_cutView, rectX, rectY, rectW, rectH, rectW/3, rectH/3, "#eee");
    drawCircle(cutView, ctx_cutView, rectX, rectY, pointSize,"white");
    drawCircle(cutView, ctx_cutView, rectX+rectW, rectY, pointSize,"white");
    drawCircle(cutView, ctx_cutView, rectX, rectY+rectH, pointSize,"white");
    drawCircle(cutView, ctx_cutView, rectX+rectW, rectY+rectH, pointSize,"white");
    drawText(cutView, ctx_cutView, rectX+rectW/2-30, rectY+rectH/2, str,"white");
  }
}

function drawGrid(canvas,ctx,x,y,ww,hh,gridw,gridh, color) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  // horizontal grid lines
  for(var i = 0; i < 4; i++) {
    ctx.beginPath();
    //console.log();
    ctx.moveTo(x, y+i*gridh);
    ctx.lineTo(x+ww, y+i*gridh);
    //ctx.moveTo(y, i);
    //ctx.lineTo(y+hh, i);
    ctx.closePath();
    ctx.stroke();
  }
  // vertical grid lines
  for(var j = 0; j <4; j++) {
    ctx.beginPath();
    ctx.moveTo(x+j*gridw, y);
    ctx.lineTo(x+j*gridw, y+hh);
    ctx.closePath();
    ctx.stroke();
  }

}

function drawCircle(canvas,ctx,x,y,r,color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "gray";
  ctx.stroke();
}

function drawText(canvas, ctx, x, y, str, color) {
  ctx.font="30px";
  //ctx.fillStyle = color;
  ctx.fillText(str,x,y);
}

function doCutSave() {
  //console.log("fname=",fname);

  if(fname) {
    //ctx_cutView.clearRect(0,0,cutView.width,cutView.height);
    //drawPreview( cutView, ctx_cutView,$('#cutHeadBar').height() + $('#cutFootBar').height(),
    //  photoImg, rectW, rectH, rectX-centerX, rectY);
    //photoImg.src = cutView.toDataURL('image/jpeg');
    openLoading("處理中...");
    photoImg.src = savePreview(photoImg, rectW, rectH, rectX-centerX, rectY, retObj);
    console.log("photoImg.src=",photoImg.src);
    //console.log(fname+".jpg",photoImg.src);
    saveImage(fname+".jpg",photoImg.src,onSaveOk);
    //loadImage(fname+".jpg",photo);
    ctx_photo.clearRect(0,0,photo.width,photo.height);
    drawView( photo, ctx_photo,$('#cutHeadBar').height() + $('#cutFootBar').height(),
      photoImg, photoImg.width, photoImg.height, null, null, null, null, true);
    //drawPreview( photo, ctx_photo,$('#cutHeadBar').height() + $('#cutFootBar').height(),
    //  photoImg, rectW, rectH, rectX-centerX, rectY);
  }

  $(function(){
    autoFFVal = 1;
    filterUsed = 0;
    faceShapingUsed = 0;
    clearInterval(cutPSInterval);
    $.mobile.changePage("#filterPage", {
      transition: "pop",
      reverse: false,
      changeHash: true
    });
  });
}

function onSaveOk() {
  //console.log("onSaveOk()");
  closeLoading();
}

function doResetCut() {
  rectX = 100;
  rectY = 100;
  rectW = 200;
  rectH = 200;
}

function doPreviewCut(e) {
  //console.log("!!!!!!!!!!!!!!!!!!!!!!",e);
  previewMode = !previewMode;
  //previewMode = true;
}

function doScaleCut() {
}
