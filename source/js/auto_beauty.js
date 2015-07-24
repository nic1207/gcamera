/*
 * 智能美容套用
 * Modified:2014.03.04 修正USER可拖曳重設眼睛臉部範圍使之變形
 * Modified:2014.03.05 修正找不到臉拖曳眼睛臉部範圍後變形會錯誤的問題
 */
var abView = document.querySelector('#abView');
var ctx_abView = abView.getContext('2d');
var abHeadBar =  document.querySelector('#abHeadBar');
var anFootBar =  document.querySelector('#abFootBar');
var btnAbSave = document.querySelector('#abSave');
var btnCancelAb = document.querySelector('#cancelAb');

var abMode = "None";
var leftEyeRect = null;
var rightEyeRect = null;
var mouthRect = null;
var targetRect = null;
var targetPos = null;
var fetchFaceData = false;
var drawPhotoImg = null;
var debugObj = null;
var sPos = null;
var bRect = null;
var bPos = null;
var mRadius = 25;
var showRangeab = true;
var retObj = null;

$( "#abPage" ).on( "pagebeforeshow", function( event, ui ) {
  //$("#slider-step").val("1");
  fetchFaceData = false;
  openLoading("載入中...");

  setInterval(abPS,1000/60);//30fps
  drawABPage();

  $("#slider-face").on("slidestop", function(e) {
    e.preventDefault();
    openLoading("處理中...");
    var face = $("#slider-face").val()/100;
    var eye = -($("#slider-eye").val()/100);
    //alert("face");
    //leftEyePos.radius = 25;
    //rightEyePos.radius = 25;
    resetFaceSourceData(leftEyePos,rightEyePos,facePos);
    deformEyeFace(eye,face);
    drawPhotoImg.src = getEffectImage(true);
    //var val = $("#slider-face").val();
    //console.log("val=",val);
    closeLoading();
    //abPS(val);
    //drawABPage();
  });
  $("#slider-eye").on("slidestop", function(e) {
    e.preventDefault();
    openLoading("處理中...");
    //alert("eye");
    var face = $("#slider-face").val()/100;
    var eye = -($("#slider-eye").val()/100);
    //console.log(eye);
    resetFaceSourceData(leftEyePos,rightEyePos,facePos);
    deformEyeFace(eye,face);
    drawPhotoImg.src = getEffectImage(true);
    //var val = $("#slider-face").val();
    //console.log("val=",val);
    closeLoading();
    //abPS(val);
    //drawABPage();
  });

});

$( "#abPage" ).on( "pageshow", function( event, ui ) {
  closeLoading();
});

//$( "#abPage" ).on( "pagebeforehide", function( event, ui ) {
//});


function abPageInit() {
  //console.log("beautyPageInit()",btnGotoCustom01);
  btnAbSave.addEventListener('click', abSave, false);
  btnCancelAb.addEventListener('click', function(){doCancel(editOriSrc,0);}, false);
  if(supportTouch) {
    abView.addEventListener('touchstart', onMouseDownAB, false);
    abView.addEventListener('touchmove', onMouseMoveAB, false);
    abView.addEventListener('touchend', onMouseUpAB, false);
  } else {
    abView.addEventListener('mousedown', onMouseDownAB, false);
    abView.addEventListener('mousemove', onMouseMoveAB, false);
    abView.addEventListener('mouseup', onMouseUpAB, false);
  }
  $("#autobeauty_btn").click(function(){
    console.log("autobeauty_btn");
    if($("#faceANDeye_slider").is(":hidden")){
      $("#faceANDeye_slider").fadeIn(500);
      $("#autobeauty_btn span").text("隱藏");
    }
    else{
      $("#faceANDeye_slider").fadeOut(500);
      $("#autobeauty_btn span").text("顯示");
    }
  });
}

function drawABPage() {
  if( $('#abHeadBar').height() > 0 && $('#abFootBar').height() >0){
    console.log($('#abHeadBar').height() + $('#abFootBar').height());
    var face = $("#slider-face").val()/100;
    var eye = $("#slider-eye").val()/100;
    //console.log("face=",face,"eye=",eye);
    closeLoading();
    //abPS();
    //console.log(val1,val2);
    //openLoading("套用中...");
    photoImg.src = editOriSrc;
    retObj = drawView( abView, ctx_abView,$('#abHeadBar').height() + $('#abFootBar').height(),
      photoImg, photoImg.width, photoImg.height, null, null, null, null, true);
    drawPhotoImg = new Image();
    drawPhotoImg.src = abView.toDataURL();
    //console.log(drawPhotoImg.src);
    //drawPhotoImg = photoImg;
    //openLoading("臉部辨識中...");
    //setTimeout(function() {
      if(!fetchFaceData) {
        openLoading("臉部辨識中...");
        faceDetectionVal = harrLikeDetectFace(drawPhotoImg.width,drawPhotoImg.height,drawPhotoImg);
        //faceDetectionVal = harrLikeDetectFace(photoImg.width,photoImg.height,photoImg);
        closeLoading();
      }
      console.log("faceDetectionVal=",faceDetectionVal);
      if(faceDetectionVal) {
        //找到臉後才偵測臉部膚色
        if(!fetchFaceData) {
          detectFaceSkin();
          //抓取臉部辨識出的資料
          catchFaceSourceData();
          fetchFaceData = true;
        }
        //console.log("!!!!");
        //closeLoading();
        openLoading("智能美容中...");
        deformEyeFace(eye,face);
        //console.log(getEffectImage());
        drawPhotoImg.src = getEffectImage(true);
        leftEyeRect = new Rect(leftEyePos.x-mRadius,leftEyePos.y-mRadius,mRadius*2,mRadius*2);
        rightEyeRect = new Rect(rightEyePos.x-mRadius,rightEyePos.y-mRadius,mRadius*2,mRadius*2);
        mouthRect = new Rect(facePos.x-mRadius*2,facePos.y-mRadius,mRadius*4,mRadius*2);
        //console.log("leftEyePos=",leftEyePos);
        //drawEyeCircle(ctx_abView,"#2894FF",leftEyePos.x,leftEyePos.y,leftEyePos.radius);
        //drawEyeCircle(ctx_abView,"#2894FF",rightEyePos.x,rightEyePos.y,rightEyePos.radius);
        //drawMouthCircle(ctx_abView,"#2894FF",facePos.x,facePos.y,leftEyePos.radius);
        closeLoading();
      } else {
        console.log("臉部偵測失敗");
        closeLoading();
        
        leftEyePos.x = drawPhotoImg.width/4;
        leftEyePos.y = drawPhotoImg.height/3;
        leftEyePos.radius = 10;
        rightEyePos.x = drawPhotoImg.width - drawPhotoImg.width/4;
        rightEyePos.y = drawPhotoImg.height/3;
        rightEyePos.radius = 10;
        facePos.x = drawPhotoImg.width/3;
        facePos.y = drawPhotoImg.height - drawPhotoImg.height/3;

        getSourceData();
        //resetFaceSourceData(leftEyePos,rightEyePos,facePos);
        //catchFaceSourceData();
        //deformEyeFace(eye,face);
        //drawPhotoImg.src = getEffectImage(true);

        leftEyeRect  = new Rect(leftEyePos.x-mRadius,leftEyePos.y-mRadius,mRadius*2,mRadius*2);
        rightEyeRect = new Rect(rightEyePos.x-mRadius,rightEyePos.y-mRadius,mRadius*2,mRadius*2);
        mouthRect    = new Rect(facePos.x-mRadius*2,facePos.y-mRadius,mRadius*4,mRadius*2);     
      }

    //},100);
  }
  else
    setTimeout(drawABPage,100);
}

function drawEyeCircle(ctx, color, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x-r/2, y);
  ctx.lineTo(x+r/2, y);
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y-r/2);
  ctx.lineTo(x, y+r/2);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawMouthCircle(ctx, color, x, y, r) {
  //ctx.globalCompositeOperation = 'xor';
  ctx.beginPath();
  ctx.arc(x+r, y, r, -0.5 * Math.PI, 0.5 * Math.PI, false);
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x-r, y, r, 0.5 * Math.PI, -0.5 * Math.PI, false);
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x-r, y-r);
  ctx.lineTo(x+r, y-r);
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x-r, y+r);
  ctx.lineTo(x+r, y+r);
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x-r/2, y);
  ctx.lineTo(x+r/2, y);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y-r/2);
  ctx.lineTo(x, y+r/2);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawRect(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x,y,w,h);
}

function abPS() {
  //if(!filterLock) {
  //  filterLock=true;
  //photoImg.src = photoSrc;
  //setTimeout(function() {
  ctx_abView.clearRect(0,0,abView.width,abView.height);
  //console.log(drawPhotoImg);
  if(drawPhotoImg) {
    drawView( abView, ctx_abView,$('#abHeadBar').height() + $('#abFootBar').height(),
      drawPhotoImg, drawPhotoImg.width, drawPhotoImg.height, null, null, null, null, true);
  }
  if(leftEyeRect) {
    //if(showRange)
    //  drawRect(ctx_abView,"rgba(0,1,0,0.3)",leftEyeRect.x,leftEyeRect.y,leftEyeRect.w,leftEyeRect.h);
    if(showRangeab)
      drawEyeCircle(ctx_abView,"#66CCFF",leftEyePos.x,leftEyePos.y,mRadius);
    //drawRect(ctx_abView,"green",leftEyeRect.x,leftEyeRect.y,leftEyeRect.w,leftEyeRect.h);
  }
  if(rightEyeRect) {
    //if(showRange)
    //  drawRect(ctx_abView,"rgba(0,1,0,0.3)",rightEyeRect.x,rightEyeRect.y,rightEyeRect.w,rightEyeRect.h);
    if(showRangeab)
      drawEyeCircle(ctx_abView,"#66CCFF",rightEyePos.x,rightEyePos.y,mRadius);
    //drawRect(ctx_abView,"green",rightEyeRect.x,rightEyeRect.y,rightEyeRect.w,rightEyeRect.h);
  }
  if(mouthRect) {
    //if(showRange)
    //  drawRect(ctx_abView,"rgba(0,1,0,0.3)",mouthRect.x,mouthRect.y,mouthRect.w,mouthRect.h);
    if(showRangeab)
      drawMouthCircle(ctx_abView,"#66CCFF",facePos.x,facePos.y,mRadius);
    //drawRect(ctx_abView,"green",mouthRect.x,mouthRect.y,mouthRect.w,mouthRect.h);
  }
  //if(debugObj)
  //  writeMessage(ctx_abView, debugObj.msg, debugObj.pos);
  //closeLoading();
  //},100);
  //}
  //filterLock=false;
}

function onABSave() {
  closeLoading();
}

function abSave() {
  //console.log("fname=",fname);
  if(fname) {
    //console.log(fname+".jpg",photoImg.src);
    openLoading("照片儲存中...");
    //drawView( photo, ctx_photo,$('#abHeadBar').height() + $('#abFootBar').height(),
    //drawPhotoImg, drawPhotoImg.width, drawPhotoImg.height, null, null, null, null, true);
    //saveImage(fname+".jpg",drawPhotoImg.src,onABSave);
    //loadImage(fname+".jpg",photo);
    drawPhotoImg.src = saveABView(drawPhotoImg);
    saveImage(fname+".jpg",drawPhotoImg.src,onABSave);
    
    ctx_photo.clearRect(0,0,photo.width,photo.height);
    drawView( photo, ctx_photo,$('#abHeadBar').height() + $('#abFootBar').height(),
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

function onMouseDownAB(e) {
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
  //console.log(sx,sy,leftEyeRect,rightEyeRect,mouthRect);
  if(leftEyeRect && leftEyeRect.inRect(sPos.x,sPos.y)) {
    targetRect = leftEyeRect;
    targetPos = leftEyePos;
    bRect = new Object();
    bRect.x = leftEyeRect.x;
    bRect.y = leftEyeRect.y;
    bPos = new Object();
    bPos.x = targetPos.x;
    bPos.y = targetPos.y;
    abMode = "Move";
  }
  if(rightEyeRect && rightEyeRect.inRect(sPos.x,sPos.y)) {
    targetRect = rightEyeRect;
    targetPos = rightEyePos;
    bRect = new Object();
    bRect.x = rightEyeRect.x;
    bRect.y = rightEyeRect.y;
    bPos = new Object();
    bPos.x = rightEyePos.x;
    bPos.y = rightEyePos.y;
    abMode = "Move";
  }
  if(mouthRect && mouthRect.inRect(sPos.x,sPos.y)) {
    targetRect = mouthRect;
    targetPos = facePos;
    bRect = new Object();
    bRect.x = mouthRect.x;
    bRect.y = mouthRect.y;
    bPos = new Object();
    bPos.x = facePos.x;
    bPos.y = facePos.y;
    abMode = "Move";
  }
  //console.log(targetRect);
}

function onMouseMoveAB(e) {
  //console.log("onMouseMove",supportTouch,e.touches[0].pageX,e.touches[0].pageY );
  //console.log("sss");
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
  if(abMode=="Move") {
    var dx = nx - sPos.x;
    var dy = ny - sPos.y;
    targetRect.x = bRect.x + dx;
    targetRect.y = bRect.y + dy;
    targetPos.x = bPos.x + dx;
    targetPos.y = bPos.y + dy;
  }
}

function onMouseUpAB(e) {
  //console.log("onMouseUp",e);
  //console.log("DDD");
  e.preventDefault();
  leftEyePos.radius = 25;
  rightEyePos.radius = 25;
  //resetFaceSourceData(leftEyePos,rightEyePos,facePos);
  //console.log("leftEyePos=",leftEyePos);
  //drawABPage();
  abMode = "None";
  targetRect = null;
  targetPos = null;
  showRangeab = !showRangeab;
}

function getMousePos(e) {
  //console.log("FFF");
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
