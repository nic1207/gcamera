var btnFbLogin =  document.querySelector('#fbLogin');
var btnGdLogin =  document.querySelector('#gdLogin');
var btnReset =  document.querySelector('#reset');
var fbLoginStatus = false;
var gdLoginStatus = false;
var FBAuthToken;

function menuInit(){
  btnFbLogin.addEventListener('click', function(){facebookLogin(false);}, false);
  btnGdLogin.addEventListener('click', function(){driveLogin(false);}, false);
  btnReset.addEventListener('click', function(){resetLocalStorage();}, false);
  widgetEvent();
  readFromLocalStorage();
}

function widgetEvent(){
//Settings@LocalStorage
$( "#grid" ).on( 'slidestop', function( event ) {
  localStorage["grid"] = $("#grid").val();
  if(localStorage["grid"]==="on"){
    $("#gridView").attr('src', 'img/grid-on.png');
  }
  else if(localStorage["grid"]==="off"){
    $("#gridView").attr('src', 'img/grid.png');
  }
  
});

$( "#saveOriPhoto" ).on( 'slidestop', function( event ) {
  localStorage["saveOriPhoto"] = $("#saveOriPhoto").val();
  if(localStorage["saveOriPhoto"]==="on"){
    $("#orgpic").attr('src', 'img/orgpic-on.png');
  }
  else if(localStorage["saveOriPhoto"]==="off"){
    $("#orgpic").attr('src', 'img/orgpic.png');
  }
});

$( "#audioSwitch" ).on( 'slidestop', function( event ) {
  localStorage["audioSwitch"] = $("#audioSwitch").val();
  if(localStorage["audioSwitch"]==="on"){
    $("#sound").attr('src', 'img/sound-on.png');
  }
  else if(localStorage["audioSwitch"]==="off"){
    $("#sound").attr('src', 'img/sound.png');
  }
});

$( "#snapshotTime" ).on( 'slidestop', function( event ) {
  //console.log("snapshotTime"+$("#snapshotTime").val());
  localStorage["snapshotTime"] = $("#snapshotTime").val();
});

$("#snapshotTime").on('input', function(event) {
  //console.log("snapshotTime:"+$("#snapshotTime").val());
  if( $("#snapshotTime").val()>=3 && $("#snapshotTime").val()<=10 )
    localStorage["snapshotTime"] = $("#snapshotTime").val();
});

$( "#photoQuality" ).on( 'change', function( event ) {
  localStorage["photoQuality"] = $("#photoQuality :radio:checked").val();
  if(localStorage["sourceNum"])
    sourceNum = localStorage["sourceNum"];
  changeMediaSource(localStorage["photoQuality"],videoSource[sourceNum]);
});

$( "#fileStorage" ).on( 'slidestop', function( event ) {
  localStorage["fileStorage"] = $("#fileStorage").val();
});

$( "#cloudStorage" ).on( 'slidestop', function( event ) {
  localStorage["cloudStorage"] = $("#cloudStorage").val();
});

$( "#cameraSourceSetting" ).on("click", changeCamera);

$( "#fullScreenSetting" ).on( 'slidestop', enterFullScreen);

$( "#snapshotModeSetting" ).change(function() {
  snapshotMode = $( "#snapshotModeSetting option:selected" ).val();
  switch(snapshotMode){
    case "normal":
      isCameraMode = false;
      btnCapture.src = 'img/Camera-icon.png';
      break;
    case "touch":
      isCameraMode = false;
      btnCapture.src = 'img/shot_touch.png';
      break;
    case "time":
      isCameraMode = false;
      btnCapture.src = 'img/shot_count.png';
      break;
    case "blink":
      isCameraMode = false;
      btnCapture.src = 'img/shot_blink.png';
      break;
    default:
      break;
  }
});

}

function readFromLocalStorage(){
  localStorage["grid"] ?  $("#grid").val(localStorage["grid"]).slider("refresh") : $("#grid").val('off').slider("refresh");
  localStorage["saveOriPhoto"] ?  $("#saveOriPhoto").val(localStorage["saveOriPhoto"]).slider("refresh") : $("#saveOriPhoto").val('off').slider("refresh");
  localStorage["audioSwitch"] ?  $("#audioSwitch").val(localStorage["audioSwitch"]).slider("refresh") : $("#audioSwitch").val('on').slider("refresh");
  localStorage["snapshotTime"] ? $("#snapshotTime").val(localStorage["snapshotTime"]).slider("refresh") : $("#snapshotTime").val('3').slider("refresh");
  localStorage["fileStorage"] ?  $("#fileStorage").val(localStorage["fileStorage"]).slider("refresh") : $("#fileStorage").val('on').slider("refresh");
  localStorage["cloudStorage"] ?  $("#cloudStorage").val(localStorage["cloudStorage"]).slider("refresh") : $("#cloudStorage").val('off').slider("refresh");
  localStorage["filterUsed"] ? filterUsed=localStorage["filterUsed"] : filterUsed=localStorage["filterUsed"];

  if(localStorage["photoQuality"]){
    switch(localStorage["photoQuality"]){
      case "high":
        $("#photoQuality1").prop('checked', false).checkboxradio('refresh');
        $("#photoQuality2").prop('checked', false).checkboxradio('refresh');
        $("#photoQuality3").prop('checked', true).checkboxradio('refresh');
        break;
      case "mid":
        $("#photoQuality1").prop('checked', false).checkboxradio('refresh');
        $("#photoQuality2").prop('checked', true).checkboxradio('refresh');
        $("#photoQuality3").prop('checked', false).checkboxradio('refresh');
        break;
      case "low":
      default:
        $("#photoQuality1").prop('checked', true).checkboxradio('refresh');
        $("#photoQuality2").prop('checked', false).checkboxradio('refresh');
        $("#photoQuality3").prop('checked', false).checkboxradio('refresh');
    }
  }
}

function resetLocalStorage(){
  localStorage.clear();
  $("#grid").val('3').slider("refresh");
  $("#saveOriPhoto").val('off').slider("refresh");
  $("#audioSwitch").val('on').slider("refresh");
  $("#snapshotTime").val('3').slider("refresh");
  $("#fileStorage").val('on').slider("refresh");
  $("#cloudStorage").val('off').slider("refresh");
  $("#photoQuality1").prop('checked', true).checkboxradio('refresh');
  $("#photoQuality2").prop('checked', false).checkboxradio('refresh');
  $("#photoQuality3").prop('checked', false).checkboxradio('refresh');
  $("#menu").panel( "close" );
}

  function facebookLogin(autoUpload) {
    $.ajaxSetup({cache: true});
    $.getScript('//connect.facebook.net/en_UK/all.js', function (){
      FB.init({
        appId: '624556434267798', // App ID from the App Dashboard
        cookie: true, // set sessions cookies to allow your server to access the session?
        xfbml: true, // parse XFBML tags on this page?
        frictionlessRequests: true,
        oauth: true
      });

      FB.login(function (response) {
        if (response.authResponse) {
          //alert("Facebook登入成功!");
          //popupAMessage("Facebook登入成功",500);
          fbLoginStatus = true;
          FBAuthToken = response.authResponse.accessToken;
          if(autoUpload)
            pushToFacebook();
          else{
            openLoading("Facebook登入成功");
            setTimeout(closeLoading,1000);
          }
        }
      },{
        scope: 'publish_actions,publish_stream'
      });
    });

  }

  function driveLogin(autoUpload){

      var CLIENT_ID = '1095298058151-j5k4qbdqof7qvo8solafi7nctu9uhiqa.apps.googleusercontent.com';
      var SCOPES = 'https://www.googleapis.com/auth/drive';
      checkAuth();
      function checkAuth() {
          gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
            handleAuthResult);
      }

      function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
          console.log("Google Drive Auth Success");
          gdLoginStatus = true;
          if(autoUpload)
            checkAndPushToDrive();
          else{
            openLoading("Google Drive 登入成功");
            setTimeout(closeLoading,1000);
          }
        }
        else {
          console.log("Google Drive Auth Failed");
          gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false}, handleAuthResult
          );
        }
      }

  }