
var filterView = document.querySelector('#filterView');
var ctx_filterView = filterView.getContext('2d');
var filterHeadBar =  document.querySelector('#filterHeadBar');
var faceNavBar =  document.querySelector('#faceNavBar');
var filterNavBar =  document.querySelector('#filterNavBar');
var userEditNavBar =  document.querySelector('#userEditNavBar');
var filterFootBar =  document.querySelector('#filterFootBar');
var btnFilterLeft = document.querySelector('#filterLeft');
var btnFilterRight = document.querySelector('#filterRight');
var filterImg =  document.querySelectorAll('img.filter');
var filterName =  document.querySelectorAll('h1.filter');
var faceImg =  document.querySelectorAll('img.face');
var btnUserEditLeft = document.querySelector('#userEditLeft');
var btnUserEditRight = document.querySelector('#userEditRight');
var userEditImg =  document.querySelectorAll('img.userEdit');
var userEditName =  document.querySelectorAll('h1.userEdit');
var btnReset = document.querySelector('#reset');
var btnSavePhoto = document.querySelector('#savePhoto');
var btnGotoCamera1 = document.querySelector('#gotoCamera1');
var btnGotoShare = document.querySelector('#gotoShare');

//var drawPhotoImg;
var selectNavBarVal = 0;
var faceShapingUsed = 999;
var filterUsed = 999;
var filterNameList = [];
filterNameList[0] = ["Origin","soften","softenFace","sketch",
                      "vintage", "warmAutumn", "gray", "dream",
                      "forest", "sweet"];
filterNameList[1] = ["原圖","柔膚","嫩白","素描","復古", "暮色",
                    "經典", "夢幻", "森女", "甜蜜"];

var filterListPage = 0;

var userEditNameList = [];
userEditNameList[0] = ["cutPage","rotPage","beautyPage","abPage","bbPage","bmPage","bsPage","bcPage","bwPage"];
userEditNameList[1] = ["剪裁","旋轉","美肌","智能美容","豐胸","馬賽克","瘦臉瘦身","遮暇","去皺"];
var userEditListPage = 0;

var filterLock=false;
var faceDetectionVal=false;
var autoFFVal=0;
var editOriSrc;

$( "#filterPage" ).on( "pagebeforeshow", function( event, ui ) {
  ShowSelectNavBar(3);

  filterList();
  userEditList();
  switch(snapshotMode){
    case "normal":
      btnCapture.src = 'img/Camera-icon.png';
      break;
    case "touch":
      btnCapture.src = 'img/shot_touch.png';
      break;
    case "time":
      btnCapture.src = 'img/shot_count.png';
      break;
    case "blink":
      btnCapture.src = 'img/shot_blink.png';
      break;
  }
  photoSrc=photo.toDataURL('image/jpeg');
  //console.log("ooooooooooooooooooo",editOriSrc);
  editOriSrc = photoSrc;
  //console.log("xxxxxxxxxxxxxxxxxxx",photoSrc);
  photoImg.src = photoSrc;
  //photoOriImg.src = photoSrc;
});

$( "#filterPage" ).on( "pageshow", function( event, ui ) {
  drawFilterPage(1);

  if(autoFFVal > 0){
    openLoading("臉部辨識中...");
    //setTimeout(function(){
      /*
      drawView( filterView, ctx_filterView,$('#filterHeadBar').height() ,
        photoImg, photoImg.width, photoImg.height);
      */
      drawFilterPage();
      //drawPhotoImg = new Image();
      //console.log(filterView.toDataURL());
      //drawPhotoImg.src = filterView.toDataURL();
      //臉部辨識
      //faceDetectionVal = harrLikeDetectFace(filterView.width,filterView.height,drawPhotoImg);
      //alert(filterView.width);
      //alert(filterView.height);
      //alert(photoImg.width);
      //alert(photoImg.height);
      //console.log(photoImg.width,photoImg.height,photo);
      faceDetectionVal = harrLikeDetectFace2(photoImg.width,photoImg.height,'#photo',ctx_photo);
      //console.log(faceDetectionVal);
      if( faceDetectionVal) {
        //找到臉後才偵測臉部膚色
        detectFaceSkin();
        //抓取臉部辨識出的資料
        catchFaceSourceData();
        if(autoFFVal > 1) {
            autoFF(faceShapingUsed, filterUsed);
        }
        else
          closeLoading();
      }
      else{
          console.log("臉部偵測失敗");
          closeLoading();
          if(autoFFVal > 1)
            autoFF(0, filterUsed);
      }
    //},100);
  }
});

$( "#filterPage" ).on( "pagebeforehide", function( event, ui ) {
  updateFxImage();
  editOriSrc=photo.toDataURL('image/jpeg');
});

$( "#edit1" ).on( 'tap', function( event ) {
  ShowSelectNavBar(3);
});

$( "#edit2" ).on( 'tap', function( event ) {
  ShowSelectNavBar(2);
});

$( "#edit3" ).on( 'tap', function( event ) {
  ShowSelectNavBar(1);
});

$( "#filterView" ).on( 'tap', function( event ) {
  if(window.innerHeight < window.innerWidth){
    if(faceNavBar.style.display === "none" && filterNavBar.style.display === "none" && userEditNavBar.style.display === "none")
      ShowSelectNavBar(selectNavBarVal);
    else
      ShowSelectNavBar(0);
  }
});

$('#gotoShare').on("taphold",function(){
    console.log("taphold");
    $('#shareItem_space').slideDown();
    setTimeout(function(){drop_shareStatus=1},750);
    // setTimeout(function(){drop_shareStatus=0;$('#shareItem_space').slideUp();},5000);
});

$('#gotoShare').on( "tap",function(){
  console.log("tap");
  $(function(){ 
    $.mobile.changePage("#sharePage", {
      transition: "slidefade",
      reverse: false,
      changeHash: false
    });
  });
});

$('#shareItem_0').click(function(e) {
  shareGoToGalleryPage();
  $('.drop_share').slideUp();
});
$('#shareItem_1').click(function(e) {
  pushToFacebook();
  $('#shareItem_space').slideUp();
});
$('#shareItem_2').click(function(e) {
  pushToDrive("push");
  $('#shareItem_space').slideUp();
});
$('#shareItem_3').click(function(e) {
  $('#shareItem_space').slideUp();
});
$('body').click(function(e) {
  if(drop_shareStatus==1){
    $('#shareItem_space').slideUp();
  }
});

$("#filterNavBar").on( "swiperight", function ( event ){
  filterList( "left" );
  console.log("swiperight");
} );

$("#filterNavBar").on( "swipeleft", function ( event ){
  filterList( "right" );
  console.log("swipeleft");
} );

$("#userEditNavBar").on( "swiperight", function ( event ){
  userEditList( "left" );
} );

$("#userEditNavBar").on( "swipeleft", function ( event ){
  userEditList( "right" );
} );

function filterPageInit(){
  //btnGotoShare.addEventListener('click', filterGoToSharePage, false);
  btnGotoCamera1.addEventListener('click', filterGoToCamPage, false);
  btnFilterLeft.addEventListener('click', function(){ filterList("left");}, false);
  btnFilterRight.addEventListener('click',function(){ filterList("right");}, false);
  filterImg[0].addEventListener('click', function(){ autoFF(faceShapingUsed,0+3*filterListPage);}, false);
  filterImg[1].addEventListener('click', function(){ autoFF(faceShapingUsed,1+3*filterListPage);}, false);
  filterImg[2].addEventListener('click', function(){ autoFF(faceShapingUsed,2+3*filterListPage);}, false);
  faceImg[0].addEventListener('click', function(){ autoFF(0,filterUsed);}, false);
  faceImg[1].addEventListener('click', function(){ autoFF(1,filterUsed);}, false);
  faceImg[2].addEventListener('click', function(){ autoFF(2,filterUsed);}, false);
  faceImg[3].addEventListener('click', function(){ autoFF(3,filterUsed);}, false);
  faceImg[4].addEventListener('click', function(){ autoFF(4,filterUsed);}, false);
  btnUserEditLeft.addEventListener('click', function(){ userEditList("left");}, false);
  btnUserEditRight.addEventListener('click',function(){ userEditList("right");}, false);
  userEditImg[0].addEventListener('click', function(){ photoEdit(0+3*userEditListPage);}, false);
  userEditImg[1].addEventListener('click', function(){ photoEdit(1+3*userEditListPage);}, false);
  userEditImg[2].addEventListener('click', function(){ photoEdit(2+3*userEditListPage);}, false);
}

function drawFilterPage(select) {
  // var barHeight = $('#filterHeadBar').height();
  //console.log("barHeight=",barHeight);
  // if( $('#filterHeadBar').height() > 0){
  //   drawView( filterView, ctx_filterView, barHeight, photo, photo.width, photo.height);
  // }
  // else
  //   setTimeout("drawFilterPage(" + select + ")",100);
  if(window.innerHeight>window.innerWidth){
    // var barHeight = $('#selectFootBar').height();
    var barHeight = $('#filterHeadBar').height()+$('#selectFootBar').height();
    drawView( filterView, ctx_filterView, barHeight, photo, photo.width, photo.height);
    //drawView( filterView, ctx_filterView, window.innerHeight-window.innerWidth, photo, photo.width, photo.height);
  }
  else{
    var barHeight = $('#selectNavBar').height();
    drawView( filterView, ctx_filterView, barHeight, photo, photo.width, photo.height);
  }

}

function filterList(direction){
  if(direction === "left"){
    if(filterListPage>0)
      filterListPage--;
  }
  else if(direction === "right"){
    if(filterListPage < Math.floor( (filterNameList[1].length-1)/3) )
      filterListPage++;
  }
  if(filterListPage === 0)
    btnFilterLeft.style.display="none";
  else if(filterListPage === Math.floor( (filterNameList[1].length-1)/3) )
    btnFilterRight.style.display="none";
  else{
    btnFilterLeft.style.display="inline";
    btnFilterRight.style.display="inline";
  }

  for(var i=0; i<filterImg.length; i++){
    if(filterNameList[1][filterListPage*3+i]){
      filterImg[i].src = "img/filter/noText/nt_e"+(filterListPage*3+i)+".png";
      filterName[i].innerHTML = filterNameList[1][filterListPage*3+i];
    }
    else{
      filterImg[i].src = "img/filter/e.png";
      filterName[i].innerHTML = "";
    }
  }
}


function userEditList(direction){
  if(direction === "left"){
    if(userEditListPage>0)
      userEditListPage--;
  }
  else if(direction === "right"){
    if(userEditListPage < Math.floor( (userEditNameList[1].length-1)/3) )
      userEditListPage++;
  }
  if(userEditListPage === 0)
    btnUserEditLeft.style.display="none";
  else if(userEditListPage === Math.floor( (userEditNameList[1].length-1)/3) )
    btnUserEditRight.style.display="none";
  else{
    btnUserEditLeft.style.display="inline";
    btnUserEditRight.style.display="inline";
  }

  for(var i=0; i<userEditImg.length; i++){
    if(userEditNameList[1][userEditListPage*3+i]){
      userEditImg[i].src = "img/edit/e"+(userEditListPage*3+i)+".png";
      userEditName[i].innerHTML = userEditNameList[1][userEditListPage*3+i];
    }
    else{
      userEditImg[i].src = "img/filter/e.png";
      userEditName[i].innerHTML = "";
    }
  }
}

function autoFF(fsName,psName){
  //console.log("fsName:"+fsName+", psName:"+psName);

  fsName = parseInt(fsName);
  psName = parseInt(psName);
  
  if(localStorage["saveOriPhoto"]=='on' && (fsName !=0 || psName!=0) ) {
    var img = photoSrc;
    saveImage(fname+"_o.jpg",img);
  }

  if( fsName < 5){
    openLoading("修改中...");
    setTimeout(function(){faceShaping(fsName);},50);
    closeLoading();
  }
  if( psName < 10){
    openLoading("濾鏡套用中...");
    setTimeout(function(){filterPS(psName);},50);
  }
}

  //FilterPS
function filterPS(psName) {
  //console.trace();
  //console.log(psName);
  //if(!filterLock){
  //  filterLock=true;
    if(psName != 0){
      var ai = $AI(photoImg).ps(filterNameList[0][psName]);//act("toReverse")
      //console.log("ai.save()=",ai.save());
      photoImg.src = ai.save();
      setTimeout(function(){
        ctx_photo.drawImage(photoImg,0,0);
        photoImg.src = photo.toDataURL('image/jpeg');
        saveFaceFilterImage();
        drawFilterPage(2);
        closeLoading();
        filterLock=false;
      },100);
    }
    else{
      ctx_photo.drawImage(photoImg,0,0);
      drawFilterPage(2);
      closeLoading();
    }
  //}
  //localStorage["filterUsed"] = psName;
  filterUsed = psName;
}

function faceShaping(fsName){
  //photoImg.src = photoSrc;
  if(!filterLock){
/*
    if( autoFFVal === 0 ){
      openLoading("臉部辨識中...");
      drawView( filterView, ctx_filterView,$('#filterHeadBar').height() ,
        photoImg, photoImg.width, photoImg.height);
      //臉部辨識
      faceDetectionVal = harrLikeDetectFace2(filterView.width,filterView.height,'#photo',ctx_photo);
      if( faceDetectionVal) {
        detectFaceSkin();
        catchFaceSourceData();
        closeLoading();
        if( faceDetectionVal && autoFFVal > 1) {
          autoFF(faceShapingUsed, filterUsed);
        }
      }
      else{
          console.log("臉部偵測失敗");
          closeLoading();
          if(autoFFVal > 1)
            autoFF(faceShapingUsed, filterUsed);
      }
    }
*/
    filterLock=true;

    if(faceDetectionVal){
      photoImg.src = photoSrc;
      ctx_photo.drawImage(photoImg,0,0);
      //console.log("fsName=",fsName);
      switch(fsName){
        case 0:
          OriginEyeOriginFace();
          //drawFaceDeformData();
          drawFilterPage(1);
          break;
        case 1://大眼胖臉
          bigEyeFatFace();
          //drawFaceDeformData();
          drawFilterPage(1);
          break;
        case 2://大眼瘦臉
          bigEyeThinFace(); 
          //drawFaceDeformData();
          drawFilterPage(1);
          break;
        case 3://小眼瘦臉
          smallEyeThinFace();
          //drawFaceDeformData();
          drawFilterPage(1);
          break;
        case 4://小眼胖臉
          smallEyeFatFace();
          //drawFaceDeformData();
          drawFilterPage(1);
          break;
        default:
      }

      //ctx_photo.drawImage(photoImg,0,0);
      drawFilterPage(1);
      //photoSrc = photo.toDataURL('image/jpeg');
      photoImg.src = photo.toDataURL('image/jpeg');
      saveFaceFilterImage();
      //closeLoading();
      //drawFilterPage(1);
      //photoImg.src = getEffectImage(true);
      //console.log(photoImg.src);
    }
    else{
      photoImg.src = photoSrc;
      ctx_photo.drawImage(photoImg,0,0);
      saveFaceFilterImage();
    }
    //localStorage["faceShapingUsed"] = fsName;
    faceShapingUsed = fsName;
    filterLock=false;
  }
}

function ShowSelectNavBar(barVal) {
  switch(barVal){
    case 0:
      faceNavBar.style.display="none";
      filterNavBar.style.display="none";
      userEditNavBar.style.display="none";
      drawFilterPage(0);
      break;
    case 1:
      selectNavBarVal = barVal;
      faceNavBar.style.display="block";
      filterNavBar.style.display="none";
      userEditNavBar.style.display="none";
      drawFilterPage(1);
      break;
    case 2:
      selectNavBarVal = barVal;
      faceNavBar.style.display="none";
      filterNavBar.style.display="block";
      userEditNavBar.style.display="none";
      drawFilterPage(2);
      break;
    case 3:
      selectNavBarVal = barVal;
      faceNavBar.style.display="none";
      filterNavBar.style.display="none";
      userEditNavBar.style.display="block";
      drawFilterPage(3);
      break;
  }
}

function saveFaceFilterImage() {
  if($("#fileStorage").val()==='on') {
    var img = photo.toDataURL('image/jpeg');
    //photoImg.src=img;
    //img = photoImg.src;
    //localStorage["photoPV"] = img;
    saveImage(fname+".jpg",img,function(){
      updateFxImage();
    });
  }
  else{
    updateFxImage();
    //drawFxImage();
  }
}

function photoEdit(num){
  $(function(){ 
    $.mobile.changePage("#"+userEditNameList[0][num], {
      transition: "pop",
      reverse: false,
      changeHash: false
    });
  });
}

function updateTocloudStorage(){
  if($("#cloudStorage").val()==='on'){
    if(!gdLoginStatus){
      driveLogin();
      setTimeout(function(){pushToDrive("push");},3000);
    }
    else
      pushToDrive('push');
  }
}

function filterGoToSharePage() {
  //saveFaceFilterImage();
  updateTocloudStorage();
  $(function(){ 
    $.mobile.changePage("#sharePage", {
      transition: "slidefade",
      reverse: false,
      changeHash: false
    });
  });
}

function filterGoToCamPage() {
  autoCam=true;
  //saveFaceFilterImage();
  updateTocloudStorage();
  window.location.href = "#";
  /*
  $(function(){ 
    $.mobile.changePage("#", {
      transition: "filp",
      reverse: false,
      changeHash: false
    });
  });
*/
}

function doCancel(oriSrc,val) {
  photoImg.src = oriSrc;
  ctx_photo.clearRect(0,0,photo.width,photo.height);
  drawView( photo, ctx_photo,$('#filterHeadBar').height() + $('#filterFootBar').height(),
    photoImg, photoImg.width, photoImg.height, null, null, null, null, true);
  autoFFVal = val;
  $(function() {
    $.mobile.changePage("#filterPage", {
      transition: "slide",
      reverse: true,
      changeHash: true
    });
  });
}