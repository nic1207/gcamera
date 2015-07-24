
var video = document.querySelector('video');
var audio = document.querySelector('audio');
var camView = document.querySelector('#camView');
var photoPv = document.querySelector('#photoPv');
var ctx_camView = camView.getContext('2d');
var ctx_photoPv = photoPv.getContext('2d');
var cameraHeadBar =  document.querySelector('#cameraHeadBar');
var cameraFootBar =  document.querySelector('#cameraFootBar');
// var btnChange = document.querySelector('#change');
// var btnFullScreen = document.querySelector('#fullScreen');
var btnphotoPvWnd = document.querySelector('#photoPvWnd');
var btnCapture = document.querySelector('#snapshot');
var btnSnapshotModeNornmal = document.querySelector('#nomal');
var btnSnapshotModeTouch = document.querySelector('#touch');
var btnSnapshotModeTime = document.querySelector('#time');
var btnSnapshotModeBlink = document.querySelector('#blink');
var camerafilterImg =  document.querySelectorAll('img.camerafilter');
var camerafilterName =  document.querySelectorAll('h1.camerafilter');

var snapshotMode = "normal";
var snapshotTime;
var snapshoting = false;
var localMediaStream = null;
var captureStatus=true;
var autoCam=false;
var sourceNum=0;
var photoQuality = "low";
var drop_faceStatus=0; // 拍照頁面臉部變形狀態
var drop_filterStatus=0;
var drop_shareStatus=0;
var drop_longtab=0;
var blinkCam = false;
var openStream = true;
var isCameraMode = false;
var htracker = null;
var inFrontCamera = true;

var Recenticon = new Array(4);
var MainiconCode =["<a href='#' class='function' id='flashlight' rel='tooltip' title='閃光燈'><img id='flash' src='img/flash.png'></a>",  
                   "<a href='#snapshotModeMenu' id='modesetting' rel='tooltip' title='模式設定' data-rel='popup' data-transition='slidedown' data-position-to='#camView'><img id='camera-mode' class='function' src='img/camera-mode.png'></a>",
                   "<a href='#' id='cameraswitch' rel='tooltip' title='鏡頭切換' class='function'><img id='change' src='img/change.png'></a>",
                   "<a href='#' id='fscreen' rel='tooltip' title='全螢幕'><img id='fullScreen' class='function' src='img/NoFullScreen.png'></a>",
                   "<a href='#'><img id='gridView' src='img/grid.png'></a>",
                   "<a href='#'><img id='orgpic' src='img/orgpic.png'></a>",
                   "<a href='#'><img id='sound' src='img/sound.png'></a>",
                   ""
                  ];

$( "#cameraPage" ).on( "pagebeforecreate", function( event, ui ) {
});

$( "#cameraPage" ).on( "pagebeforeshow", function( event, ui ) {
  if(localStorage["faceShapingUsed"])
    $('#faceItem_chose').attr('src', 'img/face/f'+localStorage["faceShapingUsed"]+'.png');
  if(localStorage["filterUsed"])
    $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e'+localStorage["filterUsed"]+'.png');
});
$( "#cameraPage" ).on( "pageshow", function( event, ui ) {  
  reloadIcon();
  //showAllToolTips();
});

$( "#cameraPage" ).on( "pagehide", function( event, ui ) {
  hideAllToolTips();
});

$('#faceItem_0').click(function(e) {
  $('#faceItem_chose').attr('src', 'img/face/f0.png');
  localStorage["faceShapingUsed"] = 0;
});
$('#faceItem_1').click(function(e) {
  $('#faceItem_chose').attr('src', 'img/face/f1.png');
  localStorage["faceShapingUsed"] = 1;
});
$('#faceItem_2').click(function(e) {
  $('#faceItem_chose').attr('src', 'img/face/f2.png');
  localStorage["faceShapingUsed"] = 2;
});
$('#faceItem_3').click(function(e) {
  $('#faceItem_chose').attr('src', 'img/face/f3.png');
  localStorage["faceShapingUsed"] = 3;
});
$('#faceItem_4').click(function(e) {
  $('#faceItem_chose').attr('src', 'img/face/f4.png');
  localStorage["faceShapingUsed"] = 4;
});

$('#filterItem_0').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e0.png');
  localStorage["filterUsed"] = 0;
});
$('#filterItem_1').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e1.png');
  localStorage["filterUsed"] = 1;
});
$('#filterItem_2').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e2.png');
  localStorage["filterUsed"] = 2;
});
$('#filterItem_3').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e3.png');
  localStorage["filterUsed"] = 3;
});
$('#filterItem_4').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e4.png');
  localStorage["filterUsed"] = 4;
});
$('#filterItem_5').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e5.png');
  localStorage["filterUsed"] = 5;
});
$('#filterItem_6').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e6.png');
  localStorage["filterUsed"] = 6;
});
$('#filterItem_7').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e7.png');
  localStorage["filterUsed"] = 7;
});
$('#filterItem_8').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e8.png');
  localStorage["filterUsed"] = 8;
});
$('#filterItem_9').click(function(e) {
  $('#filterItem_chose').attr('src', 'img/filter/chose/ch_e9.png');
  localStorage["filterUsed"] = 9;
});

//drop up menu area
$('#faceItem_chose').click(function(e){
  if(drop_faceStatus==0){
    $('.drop_face').slideDown();
    setTimeout(function(){drop_faceStatus=1},100);
  }
  // else if(drop_faceStatus==1){
  //   $('.drop_face').slideUp();
  //   drop_faceStatus=0;
  // }
});

$('#filterItem_chose').click(function(e){
  if(drop_filterStatus==0){
    $('.drop_filter').slideDown();
    setTimeout(function(){drop_filterStatus=1},100);
  }
  // else if(drop_filterStatus==1){
  //   $('.drop_filter').slideUp();
  //   drop_filterStatus=0;
  // }
});

$('body').click(function(e) {
   if(drop_faceStatus==1){
    $('.drop_face').slideUp();
    drop_faceStatus=0;
  }
    if(drop_filterStatus==1){
    $('.drop_filter').slideUp();
     drop_filterStatus=0;
  }
});


$(camView).swipe({
  tap: tapCamPage,
  swipe: swipeCamPage,
});

function swipeCamPage(event, direction, distance, duration, fingerCount) {
  if(direction==="left")
    changeCamera();
  else if(direction==="right")
    $("#menu").panel( "open" );
}

function tapCamPage() {
  var panelStatus = $("#menu").find("section").css("visibility");
  if(snapshotMode == "touch" && panelStatus === "hidden")
    snapshotPhoto();
  if(panelStatus !== "hidden")
    $( "#menu" ).panel( "close" );
}

function cameraPageInit(){

  btnCapture.addEventListener('click', snapshotPhoto, false);
  //camView.addEventListener('click', function(){ if(snapshotMode=="touch") snapshotPhoto();}, false);
  // btnFullScreen.addEventListener('click', enterFullScreen, false);
  // btnChange.addEventListener('click', changeCamera, false);
  btnphotoPvWnd.addEventListener('click', camGoToGalleryPage, false);
  btnSnapshotModeNornmal.addEventListener('click', function(){
    if(isCameraMode && snapshotMode == "time")
      return;
    if(snapshotMode == "blink"){
      blinkCam = false;
      openStream = true;
      snapshoting = false;
      htracker.stop();
      setInterval(streamToView,33);
    }
    isCameraMode = false;
    snapshotMode = "normal";
    btnCapture.src = 'img/Camera-icon.png';
    $( "#snapshotModeMenu" ).popup( "close" );
    $("#snapshotModeSetting").val("normal").selectmenu("refresh");
  }, false);
  btnSnapshotModeTouch.addEventListener('click', function(){
    if(isCameraMode && snapshotMode == "time")
      return;
    if(snapshotMode == "blink"){
      blinkCam = false;
      openStream = true;
      snapshoting = false;
      htracker.stop();
      setInterval(streamToView,33);
    }
    isCameraMode = false;
    snapshotMode = "touch";
    btnCapture.src = 'img/shot_touch.png';
    $( "#snapshotModeMenu" ).popup( "close" );
    $("#snapshotModeSetting").val("touch").selectmenu("refresh");
  }, false);
  btnSnapshotModeTime.addEventListener('click', function(){
    if(isCameraMode && snapshotMode == "time")
      return;
    if(snapshotMode == "blink") {
      blinkCam = false;
      openStream = true;
      snapshoting = false;
      htracker.stop();
      setInterval(streamToView,33);
    }
    isCameraMode = false;
    snapshotMode = "time";
    btnCapture.src = 'img/shot_count.png';
    $( "#snapshotModeMenu" ).popup( "close" );
    $("#snapshotModeSetting").val("time").selectmenu("refresh");
  }, false);
  btnSnapshotModeBlink.addEventListener('click', function(){
    if(isCameraMode && snapshotMode == "time")
      return;
    if(snapshotMode == "blink") {
      blinkCam = false;
      openStream = true;
      snapshoting = false;
      htracker.stop();
      setInterval(streamToView,33);
    }
    isCameraMode = false;
    snapshotMode = "blink";
    btnCapture.src = 'img/shot_blink.png';
    $( "#snapshotModeMenu" ).popup( "close" );
    $("#snapshotModeSetting").val("blink").selectmenu("refresh");
  }, false);

}


function reloadIcon(){
   //讀取目前localstorage中的icon編號
  for(var i=0;i<Recenticon.length;i++){
    Recenticon[i]=localStorage.getItem("ReNewicon"+i);
    if(Recenticon[i]==null){ //判斷陣列是否為空，空值設定預設值0~3
      Recenticon[i]=i;
    }
  }

  $("#menu_icon2").html(MainiconCode[Recenticon[0]]);
  $("#menu_icon3").html(MainiconCode[Recenticon[1]]);
  $("#menu_icon4").html(MainiconCode[Recenticon[2]]);
  $("#menu_icon5").html(MainiconCode[Recenticon[3]]);


  //置換icon表現

  if(localStorage["grid"]==="on"){
    $("#gridView").attr('src', 'img/grid-on.png');
  }
  else if(localStorage["grid"]==="off"){
    $("#gridView").attr('src', 'img/grid.png');
  }

  if(localStorage["saveOriPhoto"]==="on"){
    $("#orgpic").attr('src', 'img/orgpic-on.png');
  }
  else if(localStorage["saveOriPhoto"]==="off"){
    $("#orgpic").attr('src', 'img/orgpic.png');
  }

  if(localStorage["audioSwitch"]==="on"){
    $("#sound").attr('src', 'img/sound-on.png');
  }
  else if(localStorage["audioSwitch"]==="off"){
    $("#sound").attr('src', 'img/sound.png');
  }
}

function streamToView() {
  if (localMediaStream && openStream){
    autoCam=true;
    drawView( camView, ctx_camView, 0, video, video.videoWidth, video.videoHeight, null, null, null, null, true, 0, inFrontCamera);
    if(snapshoting && snapshotMode=="time" && snapshotTime>0){
      ctx_camView.globalAlpha=0.8;
      ctx_camView.fillStyle    = '#FFFFFF';
      ctx_camView.textBaseline = 'middle';
      if(window.innerHeight > window.innerWidth){
        ctx_camView.font = "Bold "+ window.innerWidth +"px Verdana";
        if(snapshotTime<10)
          ctx_camView.fillText(snapshotTime.toString(), camView.width*0.1 ,camView.height*0.5);
        else
          ctx_camView.fillText(snapshotTime.toString(), 0,camView.height*0.5,camView.width);
      }
      else{
        ctx_camView.font = "Bold "+ window.innerHeight +"px Verdana";
        if(snapshotTime<10)
          ctx_camView.fillText(snapshotTime.toString(), camView.width*0.05 + camView.width/2 - window.innerHeight/2 ,camView.height*0.5);
        else
          ctx_camView.fillText(snapshotTime.toString(), (camView.width/2 - window.innerHeight/2)/2,camView.height*0.5,camView.width);
      }
    }
  }
}

function changeMediaSource(photoQualityNow,source){
  if(source!=""){
    //console.log(source);
    if(source.facing=="user"||source.facing=="")
      inFrontCamera = true;
    else
      inFrontCamera = false;
    //console.log("inFrontCamera",inFrontCamera);
    var constraints  = {};
    constraints.audio = false;
    if(photoQualityNow === "high")
      constraints.video = { mandatory: {minWidth: 1920, minHeight: 1080}, optional: [{sourceId: source.id}] };
    else if(photoQualityNow === "mid")
      constraints.video = { mandatory: {minWidth: 1280, minHeight: 720}, optional: [{sourceId: source.id}] };
    else
      constraints.video = { mandatory: {minWidth: 720, minHeight: 480}, optional: [{sourceId: source.id}] };
      getMedia(constraints);
  }
  else
    setTimeout("changeMediaSource("+photoQualityNow+","+source+")",100);
}

function findSources(sourceInfos) {
  var j=0;
  var sourceInfo = sourceInfos;
  for (var i = 0; i != sourceInfos.length; ++i) {
    if (sourceInfos[i].kind == 'audio') {
      //console.log('Audio Source: ', sourceInfos[i]);
    }
    else if (sourceInfos[i].kind == 'video') {
      //console.log('Video Source: ', sourceInfos[i]);
      videoSource[j] = sourceInfo[i];
      j++;
    }
    else {
      //console.log('Other Source: ', sourceInfos[i]);
    }
  }
  openCamera();
}

function openCamera(){
  navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
  //console.log(videoSource);
  //console.log(localStorage["photoQuality"]);
  if(localStorage["sourceNum"])
    sourceNum = localStorage["sourceNum"];
  if(localStorage["photoQuality"])
    photoQuality = localStorage["photoQuality"];
  changeMediaSource(photoQuality,videoSource[sourceNum]);
}

function getMedia(constraints){
  if (!navigator.getUserMedia) {
    alert('getUserMedia() is not supported in your browser');
  //alert(navigator.vendor); alert(navigator.userAgent); 
  }
  if (localMediaStream) {
    video.src = null;
    localMediaStream.stop();
  }
  navigator.getUserMedia(constraints, getUserMediaSuccessCb, getUserMediaErrorCb);
  //console.log("getMedia Success!");
  htracker = new headtrackr.Tracker({whitebalancing:false,debug:true,smoothing:false});
}

//getUserMedia Success Callback
function getUserMediaSuccessCb(stream) {
  video.src = window.URL.createObjectURL(stream);
  localMediaStream = stream;
  //setTimeout( function(){ alert(video.videoWidth+" "+video.videoHeight)},1000);
  setInterval(streamToView,33);
}

//getUserMedia Error Callback
function getUserMediaErrorCb(error){
  console.log("navigator.getUserMedia error: ", error);
}

function drawFxImage() {
  var r=0,starx=0,stary=0;
  if(photo.width > photo.height) {
    photoPv.width = photo.height;
    photoPv.height=photo.height
    r = photo.height/2;
    startx = photo.width/2-photo.height/2;
    ctx_photoPv.drawImage(photo, startx, stary, photo.height, photo.height, 0, 0, photo.height, photo.height);
  }
  else {
    photoPv.width = photo.width;
    photoPv.height=photo.width;
    r = photo.width/2;
    starty = photo.height/2-photo.width/2;
    ctx_photoPv.drawImage(photo, starx, starty, photo.width, photo.width, 0, 0, photo.width, photo.width);
  }
  ctx_photoPv.globalCompositeOperation="destination-in";
  ctx_photoPv.fillStyle="#FF0000";
  ctx_photoPv.beginPath();
  ctx_photoPv.arc(r, r, r*0.95, 0, Math.PI * 2, true);
  ctx_photoPv.closePath();
  ctx_photoPv.fill();
  ctx_photoPv.globalCompositeOperation="destination-over";
  ctx_photoPv.fillStyle="#DDDDDD";
  ctx_photoPv.beginPath();
  ctx_photoPv.arc(r, r, r, 0, Math.PI * 2, true);
  ctx_photoPv.closePath();
  ctx_photoPv.fill();
}

//snapshot
function snapshotPhoto() {
  if(autoCam){
    if(!snapshoting)
      snapshotTime=parseInt( $("#snapshotTime").val() ,10) +1;
    isCameraMode = true;
    switch(snapshotMode){
      case "normal":
        getPhoto();
        break;
      case "touch":
        snapshoting=true;
        getPhoto();
        break;
      case "time":
        snapshoting=true;
        if(snapshotTime==0){
          getPhoto();
        }
        else{
          setTimeout(snapshotPhoto,1000);
          snapshotTime--;
        }
        break;
      case "blink":
        if(blinkCam) 
          return;
        snapshoting = true;
        openStream = false;
        blinkCam = true;
        var w,h;
        /*
        if(camView.width < camView.height) {
          camView.height = camView.width;
          camView.width = camView.width;
        }
        else {
          camView.width = camView.height; 
          camView.height = camView.height;
        }
        */
        
        if(video.videoWidth > video.videoHeight) {
        //if(camView.width > camView.height) {
          w = video.videoWidth/2 - video.videoHeight/2;
          video.videoWidth = video.videoHeight;
        }
        
        
        if(video.videoWidth < video.videoHeight) {
        //if(camView.width < camView.height) {
          h = video.videoHeight/2 - video.videoWidth/2;
          video.videoHeight = video.videoWidth;
        }
        

        var startx = (camView.width - camView.height)/2;
        var starty = (camView.height - camView.width)/2;
        
        if(camView.width > camView.height) {
          htracker.init(video, camView, w, 0, startx, 0);
        }
        else{
          htracker.init(video, camView, 0, h, 0, starty);  
        }
        
        htracker.start();
        processor.onLoad();

        document.addEventListener('facetrackingEvent', 
        function (event) {
          //console.log("facetrackingEvent");
          processor.setSizeAndLocation( event );
        } );
        break;
    }

  }
}

  function getPhoto(){
    if(localStorage["audioSwitch"]!='off'){
    console.log(localStorage["audioSwitch"]);
      if (window.chrome)
        audio.load();
      audio.play();
    }
    btnCapture.src="img/Camera-icon-ing.png";
    //正方形
    var r=0,startx=0,starty=0;
    if(video.videoWidth > video.videoHeight) {
      console.log("XX",video.videoWidth,video.videoHeight);
      photo.width = video.videoHeight;
      photo.height=video.videoHeight;
      photoOri.width = video.videoHeight;
      photoOri.height=video.videoHeight;
      //r = video.videoHeight/2;
      startx = video.videoWidth/2-photo.height/2;
      ctx_photo.drawImage(video, startx, 0, video.videoHeight, video.videoHeight, 0, 0, video.videoHeight, video.videoHeight);
      ctx_photoOri.drawImage(video, startx, 0, video.videoHeight, video.videoHeight, 0, 0, video.videoHeight, video.videoHeight);
    } else {
      console.log("YY",video.videoWidth,video.videoHeight);
      photo.width = video.videoWidth;
      photo.height=video.videoWidth;
      photoOri.width = video.videoWidth;
      photoOri.height = video.videoWidth;
      //r = video.videoWidth/2;
      starty = video.videoHeight/2-video.videoWidth/2;
      //starty = 0;
      ctx_photo.drawImage(video, 0, starty, video.videoWidth, video.videoWidth, 0, 0, video.videoWidth, video.videoWidth);
      ctx_photoOri.drawImage(video, 0, starty, video.videoWidth, video.videoWidth, 0, 0, video.videoWidth, video.videoWidth);
    }
    console.log(photo.toDataURL('image/jpeg'));
    var tmpc = document.createElement("canvas");
    var tmpcc = tmpc.getContext('2d');
    tmpc.width = photo.width;     
    tmpc.height = photo.height;   
                    
    centerx = -tmpc.width/2;
    centery = -tmpc.height/2;
    tmpcc.translate(tmpc.width/2,tmpc.height/2);
    tmpcc.scale(-1, 1);
    tmpcc.drawImage(photo, 0, 0, photo.width, photo.height, centerx, centery, photo.width, photo.height);
    photoImg.src = tmpc.toDataURL('image/jpeg');
    ctx_photo.drawImage(tmpc,0,0,photo.width,photo.height);
                                                
    /*原圖
    photo.width = video.videoWidth;
    photo.height=video.videoHeight;
    //photoOri.width = video.videoHeight;
    //photoOri.height=video.videoHeight;
    ctx_photo.drawImage(video, 0, 0);
    //ctx_photoOri.drawImage(video, 0, 0);
    */
    fname = "p"+Date.now();
    snapshoting=false;
    autoCam=false;
    isCameraMode = false;
    if(blinkCam) {
      snapshotMode = "blink"; 
      blinkCam = false;
    }
    setTimeout(camGoToFilterPage,500);
  }

  //change camera
  function changeCamera() {
    if(videoSource){
      sourceNum++;
      if(sourceNum >= videoSource.length)
        sourceNum=0;
      if(localStorage["photoQuality"])
        photoQuality = localStorage["photoQuality"];
      localStorage["sourceNum"]=sourceNum;
      changeMediaSource(photoQuality,videoSource[sourceNum]);
    }
  }

  //FullScreen
  function enterFullScreen() {
    var element = document.querySelector('.page');
    if(fs){
      // btnFullScreen.src="img/NoFullScreen.png";
      $("#fullScreen").attr('src', 'img/NoFullScreen.png');
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
      fs=false;
      $("#fullScreenSetting").val("off").slider("refresh");
    }
    else{
      // btnFullScreen.src="img/FullScreen.png";
      $("#fullScreen").attr('src', 'img/FullScreen.png');
      if(element.requestFullScreen) {
        element.requestFullScreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
      fs=true;
      $("#fullScreenSetting").val("on").slider("refresh");
    }
  }
/*
function camerafilterList(direction){
  if(direction === "left"){
    if(filterListPage>0)
      filterListPage--;
  }
  else if(direction === "right"){
    if(filterListPage < (filterNameList[1].length+1)/3)
      filterListPage++;
  }
  if(filterListPage === 0)
    btncameraFilterLeft.style.display="none";
  else if(filterListPage === Math.floor( (filterNameList[1].length+1)/3) )
    btncameraFilterRight.style.display="none";
  else{
    btncameraFilterLeft.style.display="inline";
    btncameraFilterRight.style.display="inline";
  }

  for(var i=0; i<camerafilterImg.length; i++){
    if(filterNameList[1][filterListPage*3+i]){
      camerafilterImg[i].src = "img/filter/e"+(filterListPage*3+i)+".png";
      camerafilterName[i].innerHTML = filterNameList[1][filterListPage*3+i];
    }
    else{
      camerafilterImg[i].src = "img/filter/e.png";
      camerafilterName[i].innerHTML = "";
    }
  }
}
*/
function camGoToFilterPage() {

  if(localStorage["faceShapingUsed"])
    faceShapingUsed = localStorage["faceShapingUsed"];
  else
    faceShapingUsed = 0;
  if(localStorage["filterUsed"])
    filterUsed = localStorage["filterUsed"];
  else
    filterUsed = 0;
  
  $("#snapshotTo").href = "#filterPage";
  autoFFVal = 2;
  $(function(){ 
    $.mobile.changePage("#filterPage", {
      transition: "flip",
      reverse: false,
      changeHash: false
    });
  });
  
} 

function camGoToGalleryPage() {
  autoCam = false;
  $(function(){ 
    $.mobile.changePage("#galleryPage", {
      transition: "pop",
      reverse: false,
      changeHash: false
    });
  });
}
//===============================================================================================
function blinkCamera() {
  openStream = true;
  htracker.stop();
  setInterval(streamToView,33);
  snapshotMode = "time";
  snapshotTime = 4;
  snapshotPhoto();
}
//===============================================================================================

function updateFxImage(){
  filer.ls('.', function(resultEntries) {
    //console.log(resultEntries);
    if (!resultEntries.length || resultEntries.length<1) {
      ctx_photo.fillStyle="#333333";
      ctx_photo.fillRect(0,0,480,480);
      drawFxImage();
    }
    else if (resultEntries.length===1){
      if(!resultEntries[0].isFile) {
        ctx_photo.fillStyle="#333333";
        ctx_photo.fillRect(0,0,480,480);
        drawFxImage();
      }
    }
    else{
      for(var i=resultEntries.length-1; i>=0; i--){
        if(resultEntries[i].isFile) {
          var p = document.createElement('img');
          p.id = i;
          p.filename = resultEntries[i].name;
          p.fullpath = resultEntries[i].toURL();
          filer.open(resultEntries[i].toURL(), function(file) {
            if (file.type.match(/image.*/)) {
              var fr = new FileReader();
              fr.onload = function() {
                p.src = fr.result;
                photo.width = p.width;
                photo.height = p.height;
                p.onload = function() {
                  ctx_photo.drawImage( p,0,0);
                  drawFxImage();
                };
              };
              //console.log(file);
              fr.readAsDataURL(file);
            }
          }, onError);
          i=-1;
        }
      }
    }
  }, onError);
}

//===========new icon==========================//

//flash
$(document).on('click', "#flash", function(){ 
   console.log("flash not supported yet.");
});

//change camera
$(document).on('click', "#change", function(){ 
   changeCamera();
});

//fullscreen
$(document).on('click', "#fullScreen", function(){ 
   enterFullScreen();
});

//grid
$(document).on('click', "#gridView", function(){ 
  var grid_status =localStorage.getItem("grid");
    if(grid_status=="on"){
      localStorage.setItem("grid","off");
      grid_status = "off";
      $("#gridView").attr('src', 'img/grid.png');
    }
    else if((grid_status=="off")||(grid_status==null)){
      localStorage.setItem("grid","on");
      grid_status = "on";
      $("#gridView").attr('src', 'img/grid-on.png');
    }
    $("#grid").val(localStorage["grid"]).slider("refresh");
});

//oringin photo saved
$(document).on('click', "#orgpic", function(){ 
    var orgpic_status =localStorage.getItem("saveOriPhoto");
    if(orgpic_status=="on"){
      localStorage.setItem("saveOriPhoto","off");
      orgpic_status = "off";
      $("#orgpic").attr('src', 'img/orgpic.png');
    }
    else if((orgpic_status=="off")||(orgpic_status==null)){
      localStorage.setItem("saveOriPhoto","on");
      orgpic_status = "on";
      $("#orgpic").attr('src', 'img/orgpic-on.png');
    }
    $("#saveOriPhoto").val(localStorage["saveOriPhoto"]).slider("refresh");
});

//sound
$(document).on('click', "#sound", function(){ 
   var sound_status =localStorage.getItem("audioSwitch");
    if(sound_status=="on"){
      localStorage.setItem("audioSwitch","off");
      sound_status = "off";
      $("#sound").attr('src', 'img/sound.png');
    }
    else if((sound_status=="off")||(sound_status==null)){
      localStorage.setItem("audioSwitch","on");
      sound_status = "on";
      $("#sound").attr('src', 'img/sound-on.png');
    }
    $("#audioSwitch").val(localStorage["audioSwitch"]).slider("refresh");
});

// $(document).on('click', "#timer", function(){ 
//    //your event function
//    console.log("orgpic");
// });

$(document).on('click', "#pixel", function(){ 
   //your event function
   console.log("pixel");
});
