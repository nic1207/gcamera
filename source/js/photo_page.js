
var photoView = document.querySelector('#photoView');
var ctx_photoView = photoView.getContext('2d');
var photoFileName = document.querySelector('#photoFileName');
var photoIndex = document.querySelector('#photoIndex');
var photoCount = document.querySelector('#photoCount');
var btnGotoShare1 = document.querySelector('#gotoShare1');
var btnGotoGallery1 = document.querySelector('#gotoGallery1');
var btnGotoFilter1 = document.querySelector('#gotoEdit');
var btnGotoDelete1 = document.querySelector('#gotoDelete1');
//var imgX =0;
var loadImgId = -1;
var swipe = null;
var nextPhotoImg = null;
var ani ={};
ani["imgX"] = 0;

$( "#photoPage" ).on( "pagebeforeshow", function( event, ui ) {
  //imgX = 0;
  ani["imgX"] = 0;
  openLoading("載入中...");
});
$( "#photoPage" ).on( "pageshow", function( event, ui ) {
  closeLoading();
});
  

$( "#photoPage" ).on( "pagebeforehide", function( event, ui ) {
});

//console.log(photoView);
$(photoView).swipe({
  swipeLeft: swipeLeft,
  swipeRight: swipeRight
});

//$(photoView).off( "swiperight");
//$(photoView).on( "swiperight", function(e) {
function swipeRight(event, direction, distance, duration, fingerCount) {
  PrevPhoto();
  ani["imgX"] = 0;
  //imgX = 0;
  swipe = "right";
  $(ani).animate({imgX: photoView.width},500);
}
//$(photoView).off( "swipeleft");
//$(photoView).on( "swipeleft", function(e) {
function swipeLeft(event, direction, distance, duration, fingerCount) {
  NextPhoto();
  //imgX = 0;
  ani["imgX"] = 0;
  swipe = "left";
  $(ani).animate({imgX: -photoView.width},500);
}
  

function photoPageInit() {
  btnGotoGallery1.addEventListener('click', photoGoToGalleryPage, false);
  btnGotoFilter1.addEventListener('click', photoGoToFilterPage, false);
  btnGotoShare1.addEventListener('click', photoGoToSharePage, false);
  btnGotoDelete1.addEventListener('click', doDelete, false);
}

function drawPhotoPage() {
  if( $('#photoHeadBar').height() > 0 && $('#photoFootBar').height() >0) {
    setInterval(photoPS,1000/30);//30fps
  }
  else
    setTimeout(function(){drawPhotoPage();},100);
}

function photoPS() {
  drawView(photoView, ctx_photoView,$('#photoHeadBar').height() + $('#photoFootBar').height(),
    photoImg, photoImg.width, photoImg.height, ani["imgX"], nextPhotoImg, swipe, null, true);
}

function loadPhoto(img) {
  //console.log(img.filename);
  openLoading("圖片載入中...");
  fname = img.filename.replace(".jpg","");
  //console.log(img.id);
  loadImgId = img.id;
  btnGotoDelete1.deletefilename = img.fullpath;
  //console.log("loadImgId=",loadImgId);
  //ctx_filterView.drawImage(img, 0,0, photoView.width, photoView.height);
  //ctx_photoView.drawImage(img, 0,0, photoView.width, photoView.height);
  //ctx_shareView.drawImage(img, 0,0, photoView.width, photoView.height);
  drawPhotoPage();
  photo.width = img.width;
  photo.height = img.height;
  ctx_photo.drawImage(img, 0, 0);
  photoImg.src = photo.toDataURL('image/jpeg');
  ani["imgX"] = 0;
  closeLoading();
}

function loadPhotobyNum(i) {
  if(i>photos.length)
    return;
  if(i<0)
    return;
  if(!photos[i])
    return;
  //console.log(photoIndex);
  photoIndex.innerHTML = (i+1);
  photoCount.innerHTML = photos.length;
  photoFileName.innerHTML = photos[i].filename.replace(".jpg","");
  var img = photos[i];
   loadPhoto(img);
}

function doDelete() {
  //console.log("doDelete()",this);
  if(this.deletefilename) {
    var dfile = this.deletefilename;
    for(var i=0; i<googleDriveSyncPath.length; i++){
      if( dfile.search(googleDriveSyncPath[i])>0 ){
        //console.log(googleDriveSyncPath[i]);
        pushToDrive('del',googleDriveSyncPath[i]);
        googleDriveSyncPath[i]="";
        //console.log(googleDriveSyncPath);
        updateGoogleDriveSyncPath(googleDriveSyncPath);
        i = googleDriveSyncPath.length;
      }
    }
    filer.rm(dfile, function() {
      //console.log(dfile,"delete ok");
      photoGoToGalleryPage();
    }, onError);
  }
}

function photoGoToGalleryPage(){
  $(function(){ 
    $.mobile.changePage("#galleryPage", {
      transition: "slide",
      reverse: true,
      changeHash: false
    });
  });
}

function photoGoToFilterPage(){
  //fname = "p"+Date.now();
  autoFFVal = 1;
  if(localStorage["faceShapingUsed"])
    localStorage["faceShapingUsed"]=0;
  if(localStorage["filterUsed"])
    localStorage["filterUsed"]=0;
  $(function(){ 
    $.mobile.changePage("#filterPage", {
      transition: "pop",
      reverse: true,
      changeHash: false
    });
  });
}

function photoGoToSharePage(){
  $(function(){ 
    $.mobile.changePage("#sharePage", {
      transition: "pop",
      reverse: true,
      changeHash: false
    });
  });
}

function NextPhoto() {
  //$(nextPhotoImg).attr('src', '');
  nextPhotoImg = null;
  //console.log(photos.length);
  if(loadImgId<photos.length-1) {
    loadImgId++;
    //nextPhotoImg.src = photos[loadImgId].src;
    nextPhotoImg = photos[loadImgId];
    //console.log("loadImgId=",loadImgId);
    setTimeout(function() {
      //if(nextPhotoImg)
      //  photoImg.src = nextPhotoImg.src;
      loadPhotobyNum(loadImgId);
    },800);
    /*
    //console.log(photos);
    $(function() {
      $.mobile.changePage("#photoPage", {
        allowSamePageTransition: true,
        reverse: false,
        transition: 'slidefade',
        showLoadMsg: true,
        changeHash: true
      });
      loadPhotobyNum(loadImgId);
    });
    */
  }
}

function PrevPhoto() {
  //$(nextPhotoImg).attr('src', '');
  nextPhotoImg = null;
  if(loadImgId>0) {
    loadImgId--;
    //nextPhotoImg.src = photos[loadImgId].src;
    nextPhotoImg = photos[loadImgId];
    setTimeout(function() {
      //if(nextPhotoImg)
      //  photoImg.src = nextPhotoImg.src;
      loadPhotobyNum(loadImgId);
    },800);
              
    //console.log(nextPhotoImg.src);
    /*
    //console.log(photos);
    $(function() {
      $.mobile.changePage("#photoPage", {
        allowSamePageTransition: true,  
        reverse: true,
        transition: 'slidefade',
        showLoadMsg: true,
        changeHash: true  
      });
      loadPhotobyNum(loadImgId);
    });
    */
  }
}
                                                       
