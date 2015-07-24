
var shareView = document.querySelector('#shareView');
var ctx_shareView = shareView.getContext('2d');
var sharedHeadBar =  document.querySelector('#sharedHeadBar');
var sharedFootBar =  document.querySelector('#sharedFootBar');
var btnGallery = document.querySelector('#gallery');
var btnFacebook = document.querySelector('#facebook');
var btnGoogleDrive = document.querySelector('#googleDrive');
//var btnSinaWeibo = document.querySelector('#sina_weibo');
var btnGotoFilter = document.querySelector('#gotoFilter');
var btnGotoCamera2 = document.querySelector('#gotoCamera2');
var pushDriveing = false;
var syncDataing = false;

$( "#sharePage" ).on( "pagebeforeshow", function( event, ui ) {
  setTimeout(drawSharePage,100);
  if($("#cloudStorage").val()==='on'){
    if(!gdLoginStatus){
      driveLogin(true);
    }
    else{
      checkAndPushToDrive();
    }
  }
});

$( "#sharePage" ).on( "pageshow", function( event, ui ) {
  drawSharePage();
});

$( "#sharePage" ).on( "pagebeforehide", function( event, ui ) {
});

function sharePageInit(){
  btnGotoFilter.addEventListener('click', shareGoToFilterPage, false);
  btnGotoCamera2.addEventListener('click', shareGoToCamPage, false);
  btnGallery.addEventListener('click', shareGoToGalleryPage, false);
  btnFacebook.addEventListener('click', pushToFacebook, false);
  btnGoogleDrive.addEventListener('click', function(){driveLogin(true);}, false);
  // btnSinaWeibo.addEventListener('click', pushToSinaWeibo, false);
}

function drawSharePage() {
  if( $('#shareHeadBar').height() > 0 && $('#shareFootBar').height() >0){
    drawView( shareView, ctx_shareView,
      $('#shareHeadBar').height() + $('#shareFootBar').height(),
      photoImg, photoImg.width, photoImg.height);
  }
  else
    setTimeout(drawSharePage,100);
}

function pushToFacebook() {
  //console.log("pushToFacebook");
  openLoading("照片正在上傳至Facebook...");
  var authToken;
  var blob = dataURItoBlob(photoImg.src);
  $.ajaxSetup({cache: true});
  $.getScript('//connect.facebook.net/en_UK/all.js', function (){
    if(FBAuthToken){
      setTimeout(pushPhoto,500);
    }
    else{
      openLoading("請重新登入Facebook");
      setTimeout(closeLoading,1000);
      facebookLogin(true);
    }
  });

  function pushPhoto(){
    var fd = new FormData();
    fd.append("access_token", FBAuthToken);
    fd.append("source", blob);
    //fd.append("message", "蝘?");
    $.ajax({
      url: "https://graph.facebook.com/me/photos",
      type: "POST",
      data: fd,
      processData: false,
      contentType: false,
      cache: false,
      success: function (data) {
        //console.log("success " + data);
        $("#poster").html("Posted Canvas Successfully");
      },
      error: function (shr, status, data) {
        openLoading("照片上傳至Facebook失敗");
        setTimeout(closeLoading,1000);
      },
      complete: function () {
        openLoading("照片上傳至Facebook成功");
        setTimeout(closeLoading,1000);
      }
    });
  }

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
      type: 'image/jpeg'
    });
  }
}

function checkAndPushToDrive(){
  if(!pushDriveing){
    console.log("push");
    pushDriveing = true;
    pushToDrive('push');
  }
  else
    setTimeout(checkAndPushToDrive,100);
}

function checkAndWriteSyncData(resp){
  if(!syncDataing){
    console.log(resp);
    syncDataing = true;
    //File API寫入
    filer.write("/sync/googleDriveSyncPath.txt", {data: resp.title+",", type: 'text/plain', append: true}, function(){
      syncDataing = false;
    });
  }
  else
    setTimeout(function(){checkAndWriteSyncData(resp);},100);
}

function pushToDrive(type,fileName) {
    var GDfolderID;

    if(type==='push'){
      //console.log("drive:pushFile");
      searchFile("GShot","application/vnd.google-apps.folder");
    }
    else if(type==='del'){
      //console.log("drive:deleteFile");
      deleteFile(fileName);
    }

    function searchFile(folderName, type) {
      openLoading("照片正在上傳至Google Drive...");
      gapi.client.load('drive', 'v2', function() {
        var request = gapi.client.drive.files.list({
          'maxResults': 5,
          'q':"mimeType = '" + type + "' and title contains '" + folderName + "'"
        });
        request.execute(function(resp) {
          console.log(resp);
          if(resp.code == 401){
            console.log("resp.code == 401");
            openLoading("請重新登入 Google Drive !");
            //popupAMessage("登入 Google Drive !",500);
            driveLogin(true);
            setTimeout(closeLoading,1000);
          }
          if(resp.items){
            uploadFile(resp.items[0].id);
          }
          else
            createFile("GShot","application/vnd.google-apps.folder");
        });
      });
    }

    function createFile(folderName, type) {
      gapi.client.load('drive', 'v2', function() {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        var metadata = {
        'title': folderName,
        'mimeType': type
        };

        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
              'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});

          request.execute(function(resp) {
            console.log('Folder ID: ' + resp.id);
            uploadFile(resp.id);
          });
      });
    }

    function uploadFile(folderID) {
      gapi.client.load('drive', 'v2', function() {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        var metadata = {
          'title': fname,
          'mimeType': 'image/jpeg',
          'parents':[{"id":folderID}]
      };

      var base64Data = photoImg.src;
      base64Data = base64Data.replace(/^data:image\/jpeg;base64,/,"");
      base64Data = base64Data.replace(/^data:image\/png;base64,/,"");

      //console.log(photoImg.src);
      //console.log(base64Data);

      var multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: image/jpeg \r\n' +
          'Content-Transfer-Encoding: base64\r\n' +
          '\r\n' +
          base64Data +
          close_delim;

      var request = gapi.client.request({
          'path': '/upload/drive/v2/files',
          'method': 'POST',
          'params': {'uploadType': 'multipart'},
          'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
          },
          'body': multipartRequestBody});
      request.execute(function(resp){
        //console.log(resp);
        pushDriveing = false;
        if(resp.title){
          openLoading("照片上傳至Google Drive成功");
          checkAndWriteSyncData(resp);
        }
        else{
          openLoading("照片上傳Google Drive失敗");
          //popupAMessage("照片上傳至Google Drive失敗",500);
        }
        setTimeout(closeLoading,1000);
      });
    });
  }
  
  function deleteFile(fileName) {
    gapi.client.load('drive', 'v2', function() {
      var request = gapi.client.drive.files.list({
        'maxResults': 5,
        'q':"mimeType = 'image/jpeg' and title contains '" + fileName + "'"
        
      });
      request.execute(function(resp) {
        console.log(resp);
        if(resp.code == 401){
          alert("請重新登入 Google Drive !");
        }
        if(resp.items){
          gapi.client.load('drive', 'v2', function() {
            var request = gapi.client.drive.files.delete({
              'fileId': resp.items[0].id,
            });
            request.execute(function(resp) {
              console.log(resp);
            });
          });
        }
      });
    });
  }
}

function pushToSinaWeibo() {;}

function shareGoToGalleryPage() {
  $(function(){ 
    $.mobile.changePage("#galleryPage", {
      transition: "pop",
      reverse: false,
      changeHash: false
    });
  });
}

function shareGoToFilterPage() {
  autoFFVal = 0;
  $(function(){ 
    $.mobile.changePage("#filterPage", {
      transition: "slidefade",
      reverse: true,
      changeHash: false
    });
  });
}

function shareGoToCamPage() {
  autoCam=true;
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