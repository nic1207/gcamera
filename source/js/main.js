var photo = document.querySelector('#photo');
var ctx_photo = photo.getContext('2d');
var photoImg = document.querySelector('#photoImg');
//var nextPhotoImg = document.querySelector('#nextPhotoImg');
var photoOri = document.querySelector('#photoOri');
var ctx_photoOri = photo.getContext('2d');
var photoOriImg = document.querySelector('#photoOriImg');
var popupMessage = document.querySelector('#popupMessage');

var photoSrc;
var fname;
var videoSource = new Array();
var currentSourceNum=0;

function onError(e) {
  alert('Error' + e.name);
}

function mainInit(){
  if (typeof MediaStreamTrack === 'undefined'){
    //console.log("Not Support MediaStreamTrack");
    openCamera();
  } else {
    MediaStreamTrack.getSources(findSources);
    //openCamera();
  }
}

function popupAMessage(message,ms){
  popupMessage.innerHTML = message;
  $("#popupWnd").popup();
  $("#popupWnd").popup( "open" );
  if(ms>0)
    setTimeout( function(){$("#popupWnd").popup( "close" );},ms);
}

function openLoading(message){
  setTimeout(function(){
    $.mobile.loading('show', {
      text: message,
      textVisible: true,
      theme: "b",
      textonly: false,
      html: ""
    });
  },1);
}

function closeLoading(){
  setTimeout(function(){
    $.mobile.loading( "hide" );
  },1);
}

/*
  function drawView( view, ctxView, barHeight, source, sourceWidth, sourceHeight){
    view.width = window.innerWidth;
    view.height = window.innerHeight - barHeight;
    var radio = sourceWidth/sourceHeight;
    var startx = (view.width - view.height*radio)/2;
    var starty = (view.height - view.width/radio)/2;
    if(view.width > view.height*radio)
      ctxView.drawImage(source, 0, 0, sourceWidth, sourceHeight, startx, 0, view.height*radio, view.height);
    else
      ctxView.drawImage(source, 0, 0, sourceWidth, sourceHeight, 0, starty, view.width, view.width/radio);
  }
*/
  /**
   * [drawView 很多地方都會呼叫到, 目前功能有支援swipe移動效果, 自動置中, 自動調整寬高, 取正方形...
   * 比較複雜所以補充說明一下]
   * @param  {[DOM object]} view [canvas]
   * @param  {[type]} ctxView      [canvas's context]
   * @param  {[float]} barHeight    [bar height]
   * @param  {[image]} source       [source image]
   * @param  {[float]} sourceWidth  [source image width]
   * @param  {[float]} sourceHeight [source image height]
   * @param  {[float]} addx         [delta x for swipe]
   * @param  {[image]} target       [next swipe Image]
   * @param  {[string]} swipe       ["left" or "right" or null]
   * @param  {[string]} align       [image alignment : "left" or "right" or null]
   * @param  {[string]} vcenter     [image Vertical Align]
   * @param  {[string]} deg         [rotation deg: 0 - 360]
   * @param  {[bool]} isMirror      [is Mirror: true or false ]
   * @return {[object]}  [some information return  to caller]
   */
  function drawView( view, ctxView, barHeight, source, sourceWidth, sourceHeight, addx, target, swipe, align, vcenter, deg, isMirror) {
    var w=0;
    var h=0;
    if(!addx)
      addx = 0;
    if(!target || target.src=="" || !swipe)
      addx = 0;
    //取正方形
    if(sourceWidth>sourceHeight) {
      w=sourceWidth/2-sourceHeight/2;
      sourceWidth=sourceHeight;
    }
    if(sourceWidth<sourceHeight) {
      h=sourceHeight/2-sourceWidth/2;
      sourceHeight=sourceWidth;
    }
    //取正方形End
    view.width = window.innerWidth;
    view.height = window.innerHeight - barHeight;
    var radio = sourceWidth/sourceHeight;
    var startx = 0;
    var starty = 0;
    if(view.height<view.width) {
      startx = -view.height/2 + addx;
      starty = -view.height/2;
    } else {
      startx = -view.width/2 + addx;
      starty = -view.width/2;
    }
    ctxView.save();
    //drawBraCircle(ctxView,"red",view.width/2,view.height/2,2);
    ctxView.translate(view.width/2,view.height/2);
    if(isMirror) {
      ctxView.scale(-1, 1);
    }
    if(deg) {
      ctxView.rotate(deg * Math.PI/180);
    }
    //drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
    if(view.width > view.height*radio) {
      ctxView.drawImage(source, w, h, sourceWidth, sourceHeight, startx, starty, view.height*radio, view.height);
      drawGrid(ctxView,startx,starty,view.height*radio,view.height);
      if(swipe=="right" && target)
        ctxView.drawImage(target, w, h, sourceWidth, sourceHeight, startx-view.width, starty, view.height*radio, view.height);
      if(swipe=="left" && target)
        ctxView.drawImage(target, w, h, sourceWidth, sourceHeight, startx+view.width, starty, view.height*radio, view.height);
    } else {
      ctxView.drawImage(source, w, h, sourceWidth, sourceHeight, startx, starty, view.width, view.width/radio);
      drawGrid(ctxView,startx,starty,view.width,view.width/radio);
      if(swipe=="right" && target)
        ctxView.drawImage(target, w, h, sourceWidth, sourceHeight, addx-view.width, starty, view.width, view.width/radio);
      if(swipe=="left" && target)
        ctxView.drawImage(target, w, h, sourceWidth, sourceHeight, addx+view.width, starty, view.width, view.width/radio);
    }
    ctxView.restore();
    
    //把一些調整後的數值回傳回去, 才不用重新計算
    var returnInfo = new Object();
    var mm = Math.min(view.height,view.width);
    returnInfo.imgWidth = mm;
    returnInfo.imgHeight = mm;
    returnInfo.a = mm/sourceHeight;
    returnInfo.w = w;
    returnInfo.h = h;
    returnInfo.sourceWidth = sourceWidth;
    returnInfo.sourceHeight = sourceHeight;
    returnInfo.radio = radio;
    returnInfo.startx = startx;
    returnInfo.starty = starty;
    returnInfo.viewWidth = view.width;
    returnInfo.viewHeight = view.height;
    //console.log(returnInfo);
    return returnInfo;
  }

function drawGrid(ctxView, padX, padY, w, h){
  if(localStorage["grid"] === "on" && $.mobile.activePage.attr("id")==="cameraPage"){
    ctxView.beginPath();
    if(ctxView.width/200 < 3)
      ctxView.lineWidth = camView.width/200;
    else
      ctxView.lineWidth = 3;
    ctxView.strokeStyle = '#FFFFFF';
    ctxView.moveTo(padX + w/3, padY + 0);
    ctxView.lineTo(padX + w/3, padY + h);
    ctxView.moveTo(padX + w/3*2, padY + 0);
    ctxView.lineTo(padX + w/3*2, padY + h);
    ctxView.moveTo(padX + 0, padY + h/3);
    ctxView.lineTo(padX + w, padY + h/3);
    ctxView.moveTo(padX + 0, padY + h/3*2);
    ctxView.lineTo(padX + w, padY + h/3*2);
    ctxView.stroke();
  }
}
/**
 * [裁切預覽功能]
 * @param  {[canvas]} view         [description]
 * @param  {[canvas context]} ctxView      [description]
 * @param  {[type]} barHeight    [description]
 * @param  {[image]} source       [source image]
 * @param  {[float]} sourceWidth  [source image's width]
 * @param  {[float]} sourceHeight [source image's height]
 * @param  {[type]} sourceX      [source x ]
 * @param  {[type]} sourceY      [source y]
 * @param  {[type]} destX        [dest x]
 * @param  {[type]} destY        [dest y]
 * @return {[type]}              [description]
 */
function drawPreview(view, ctxView, barHeight, source, sourceWidth, sourceHeight, sourceX, sourceY, retObj) {
  if(!sourceX)
    sourceX = 0;
  if(!sourceY)
    sourceY = 0;
  var destX = 0;
  var destY = 0;
  var destw = 0;
  var desth = 0;
  var a = 1;
  if(retObj)
    a = retObj.a;
  destw = sourceWidth; 
  //destw = retObj.imgWidth;
  desth = sourceHeight;
  //desth = retObj.imgHeight;
  ctxView.save();
  ctxView.translate((view.width-destw)/2,(view.height-desth)/2);//center
  ctxView.drawImage(source, sourceX/a, sourceY/a, sourceWidth/a, sourceHeight/a, destX, destY, destw, desth);
  ctxView.restore();
}

function savePreview(source, sourceWidth, sourceHeight, sourceX, sourceY, retObj) {
  var view = document.createElement("canvas");
  var ctxView = view.getContext('2d');
  //console.log("retObj=",retObj);
  if(!sourceX)
    sourceX = 0;
  if(!sourceY)
    sourceY = 0;
  var destX = 0;
  var destY = 0;
  var destw = 0;
  var desth = 0;
  var a = 1;
  if(retObj)
    a = retObj.a;
  destw = sourceWidth; 
  desth = sourceHeight;
  view.width = destw;
  view.height = desth;
  ctxView.drawImage(source, sourceX/a, sourceY/a, sourceWidth/a, sourceHeight/a, destX, destY, destw, desth);
  return view.toDataURL('image/jpeg');     
}

function saveRotView(source, deg, isMirror) {
  var view = document.createElement("canvas");
  view.width = source.width;
  view.height = source.height;
  var ctxView = view.getContext('2d');
  //console.log(view.width,view.height);
  ctxView.translate((view.width)/2,(view.height)/2);//center
  if(isMirror)
    ctxView.scale(-1, 1);
  if(deg)
    ctxView.rotate(deg * Math.PI/180);
  ctxView.drawImage(source, -view.width/2, -view.height/2);
  var url = view.toDataURL('image/jpeg');
  //console.log(view.parentNode);
  return url;
}

function saveABView(source) {
  var view = document.createElement("canvas");
  var minv = Math.min(source.width,source.height);
  var ww = source.width;
  var hh = source.height;
  view.width = minv;
  view.height = minv;
  var ctxView = view.getContext('2d');
  //console.log("ww=",ww,"minv=",minv);
  //ctxView.translate((view.width)/2,(view.height)/2);//center
  //if(isMirror)
  //  ctxView.scale(-1, 1);
  //if(deg)
  //  ctxView.rotate(deg * Math.PI/180);
  //ctxView.translate((view.width)/2,(view.height)/2);
  var dx = (ww/2) - (minv/2);
  var dy = (hh/2) - (minv/2);
  //console.log("dx=",dx,"dy=",dy);
  ctxView.drawImage(source, dx, dy,minv,minv,0,0,minv,minv);
  var url = view.toDataURL('image/jpeg');
  return url;
}
                                

$('body').click(function(e){
 // //face
 // if(drop_faceStatus==1){
 //    $('.drop_face').slideUp();
 //    drop_faceStatus=0;
 //  }
 //  else if(drop_faceStatus==0){
 //    // do nothing
 //  }
 //  //filter
 //  if(drop_filterStatus==1){
 //    $('.drop_filter').slideUp();
 //    drop_filterStatus=0;
 //  }
 //  else if(drop_filterStatus==0){
 //    // do nothing
 //  }
  //share
 if(drop_shareStatus==1){
    $('.drop_share').slideUp();
    drop_shareStatus=0;
    drop_longtab=0;
  }
  else if(drop_shareStatus==0){
    // do nothing
  }
});

$(window).load(function gShot() {

  $.event.special.tap.emitTapOnTaphold = false;

  filer.init({persistent: true, size: 10 * 1024 * 1024}, function(fs) {
    // filer.size == Filer.DEFAULT_FS_SIZE
    // filer.isOpen == true
    // filer.fs == fs
    filer.mkdir('sync', false, function(dirEntry) {
      filer.write("/sync/googleDriveSyncPath.txt", {data: "", type: 'text/plain', append: true});
    }, onError);
    updateFxImage();
  }, onError);


  mainInit();
  //page Init
  menuInit();
  iconPageInit();
  cameraPageInit();
  filterPageInit();
  sharePageInit();
  galleryPageInit();
  photoPageInit();
  beautyPageInit();
  cutPageInit();
  rotPageInit();
  abPageInit();
  bbPageInit();
  bmPageInit();
  bsPageInit();
  bcPageInit();
  bwPageInit();
});

window.location.href = "#";
