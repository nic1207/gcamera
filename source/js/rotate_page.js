/*
 * rotate page
 */
var rotView = document.querySelector('#rotView');
var saveView = document.querySelector('#rotView');
var ctx_rotView = rotView.getContext('2d');
var ctx_saveView = saveView.getContext('2d');
var rotHeadBar =  document.querySelector('#rotHeadBar');
var rotFootBar =  document.querySelector('#rotFootBar');

var btnLeftRot = document.querySelector('#leftRot');
var btnMirrorRot = document.querySelector('#mirrorRot');
var btnRightRot = document.querySelector('#rightRot');
var btnSaveRot = document.querySelector('#saveRot');
var btnCancelRot = document.querySelector('#cancelRot');

var centerX;
var degree = 0;
var mirror = false;

var rotOriSrc;

$( "#rotPage" ).on( "pagebeforeshow", function( event, ui ) {
  openLoading("載入中...");
  mirror = false;
  degree = 0;
  setTimeout(drawRotPage,500);
});

//$( "#beautyPage" ).on( "pagebeforehide", function( event, ui ) {
//});

function rotPageInit() {
  btnLeftRot.addEventListener('click', doLeftRot, false);
  btnMirrorRot.addEventListener('click', doMirrorRot, false);
  btnRightRot.addEventListener('click', doRightRot, false);
  btnSaveRot.addEventListener('click', doSaveRot, false);
  btnCancelRot.addEventListener('click', function(){doCancel(editOriSrc,0);}, false);
}

function drawRotPage() {
  if( $('#rotHeadBar').height() > 0 && $('#rotFootBar').height() >0) {
    photoImg.src = editOriSrc;
    rotPS(degree,mirror);
    closeLoading();
  }
  else
    setTimeout(drawRotPage,100);
}

function rotPS(deg,isMirror) {
  if(!deg)
    deg = 0;
  //if(drawPhotoImg) {
  var ret = drawView( rotView, ctx_rotView,$('#rotHeadBar').height() + $('#rotFootBar').height(),
    photoImg, photoImg.width, photoImg.height, null, null, null, null, true, deg, isMirror);
  //}
               
}

function doLeftRot() {
  degree -= 90;
  rotPS(degree,mirror);
}

function doRightRot() {
  degree += 90;
  rotPS(degree,mirror);
}

function doMirrorRot() {
  mirror = !mirror;
  rotPS(degree,mirror);
}

function saveProcess() {
  photoImg.src = saveRotView(photoImg,degree,mirror);
  closeLoading();
}

function doSaveRot() {
  //console.log("fname=",fname);
  if(fname) {
    openLoading("照片儲存中...");
    saveProcess();
    saveImage(fname+".jpg",photoImg.src,onSaveOk);
    //loadImage(fname+".jpg",photo);
    ctx_photo.clearRect(0,0,photoView.width,photoView.height);
    drawView( photo, ctx_photo,$('#rotHeadBar').height() + $('#rotFootBar').height(),
      photoImg, photoImg.width, photoImg.height, null, null, null, null, true);
  }
  
  $(function() {
    autoFFVal = 1;
    filterUsed = 0;
    faceShapingUsed = 0;
    $.mobile.changePage("#filterPage", {
      transition: "slide",
      reverse: true,
      changeHash: true
    });
  });
}

function onSaveOk() {
  //console.log("onSaveOk()");
  closeLoading();
}
