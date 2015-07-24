
var galleryView = document.querySelector('#galleryView');
var checkImg = document.querySelector('#checkImage');
var cloudImg = document.querySelector('#cloudImage');
var ctx_galleryView = galleryView.getContext('2d');
var btnGotoCamera3 = document.querySelector('#gotoCamera3');
var btnGotoDelete2 = document.querySelector('#gotoDelete2');
//var fileList = document.querySelector('#files');

var fs=false;
var googleDriveSyncPath= new Array();

var filer = new Filer();
var selectedArray = new Array();
var mouseX;
var mouseY;
var photos = null;
var holdCords = {
    holdX : 0,
    holdY : 0
}

$( "#galleryPage" ).on( "pagebeforeshow", function( event, ui ) {
  //doClearAll();
  galleryView.width = window.innerWidth*0.9;
  galleryView.height = window.innerWidth*0.9;
  filer.open("sync/googleDriveSyncPath.txt", function(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e) {
      var contents = e.target.result;
      //console.log(contents);
      googleDriveSyncPath = contents.split(",");
      //console.log(googleDriveSyncPath);
      ListGallery();
    };
  }, onError);
});

$( "#galleryPage" ).on( "pagebeforehide", function( event, ui ) {
  btnGotoDelete2.style.display="none";
});

function galleryPageInit(){
  btnGotoDelete2.addEventListener('click', function(){doDeleteSelect(0)}, false);
  btnGotoCamera3.addEventListener('click', galleryGoToCamPage, false);
}

function updateGoogleDriveSyncPath(syncList){
  var tmp = "";
  for(var i=0; i<syncList.length; i++){
    if(syncList[i]!=="")
      tmp += syncList[i]+",";
  }
  //console.log(tmp);
  filer.write("/sync/googleDriveSyncPath.txt", {data: tmp, type: 'text/plain'});
}

  function saveImage(filename,dataURL, callBack) {
    var base64 = dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var dataArray = new Uint8Array(new ArrayBuffer(rawLength));
    for (i = 0; i < rawLength; i++)
      dataArray[i] = raw.charCodeAt(i);
    filer.write(filename, {data: dataArray.buffer, type: "image/jpeg"},callBack);
  }

  function loadImage(filename,p) {
    filer.open(filename, function(file) {
      if (file.type.match(/image.*/)) {
        var fr = new FileReader();
        fr.onload = function() {
          //console.log("fr.result=",fr.result);
          //drawFxImage();
          updateFxImage();
          p.src = fr.result;
          p.onload = function() {
            //console.log(p.src);
            //drawFxImage();
            updateFxImage();
          }
        };
        //console.log(file);
        fr.readAsDataURL(file);
      }
    }, onError);
  }

  function loadGalleryImage(filename,p,i) {
    var cloudIcon = false;
    for(var i=0; i<googleDriveSyncPath.length; i++){
      if( filename.search(googleDriveSyncPath[i])>0 ){
        cloudIcon = true;
        //console.log(googleDriveSyncPath[i]);
        i = googleDriveSyncPath.length;
      }
      else{
        cloudIcon = false;
      }
    }
    filer.open(filename, function(file) {
      if (file.type.match(/image.*/)) {
        var fr = new FileReader();
        fr.onload = function() {
          p.src = fr.result;
          p.onload = function() {
            ctx_galleryView.globalCompositeOperation = "source-over";
            ctx_galleryView.strokeStyle = "white";
            ctx_galleryView.fillStyle = "rgba(0,0,0,0.8)";
            ctx_galleryView.drawImage(p,this.xx*this.ww, this.yy*this.hh,this.ww,this.hh);
            ctx_galleryView.strokeRect(this.xx*this.ww,this.yy*this.hh,this.ww,this.hh);
            //console.log(i,selectedArray.length,$.inArray( i.toString(), selectedArray ));
            if(cloudIcon){
              ctx_galleryView.drawImage(cloudImg,this.ww*this.xx+this.ww*0.8, this.hh*this.yy+this.hh*0.8,this.ww*0.2,this.hh*0.2);
            }
          };
        };
        //console.log(file);
        fr.readAsDataURL(file);
      }
    }, onError);
  }

  function doClearAll() {
    filer.ls('.', function(entries) {
      //console.log(entries);
      entries.forEach(function(entry, i) {
        //console.log(entry);
        filer.rm(entry.toURL(), function() {
        }, onError);
      });  
    }, onError);
  }

  function doDeleteSelect(i) {
    //console.log("doDeleteSelect()",this);
    openLoading("照片刪除中...");
    if(!i)
      i=0;
    if(selectedArray.length>0) {
      for(;i<selectedArray.length;i++) {
        var id = selectedArray[i];
        var dfile = photos[id].fullpath;
        for(var count=0; count<googleDriveSyncPath.length; count++){
          if( dfile.search(googleDriveSyncPath[count])>0 ){
            //console.log(googleDriveSyncPath[count]);
            pushToDrive('del',googleDriveSyncPath[count]);
            googleDriveSyncPath[count]="";
            //console.log(googleDriveSyncPath);
            updateGoogleDriveSyncPath(googleDriveSyncPath);
            count = googleDriveSyncPath.length;
          }
        }
        filer.rm(dfile, function() {
          //console.log(dfile,"delete ok");
          btnGotoDelete2.style.display="none";
          reloadGalleryPage();
        }, onError);
      }
    }
    closeLoading();
  }

  function ListGallery() {
    filer.ls('.', function(entries) {
      renderEntries(entries);
      updateFxImage();
    }, onError);
  }

  function ListDeleteGallery(at) {
    filer.ls('.', function(entries) {
      renderDeleteEntries(entries,at);
    }, onError);
  }

  function renderEntries(resultEntries) {
    entries = resultEntries; // Cache the result set.
    if (!resultEntries.length) {
      return;
    }
    photos = new Array();
    selectedArray = [];
    //console.log(resultEntries.length);
    galleryView.height = Math.ceil((resultEntries.length-1)/3)*galleryView.width/3;
    ctx_galleryView.clearRect ( 0 , 0 , galleryView.width , galleryView.height );
    resultEntries.forEach(function(entry, i) {
      if(entry.isFile) {
        //console.log(entry);
        var p = document.createElement('img');
        p.id = i;
        p.filename = entry.name;
        p.fullpath = entry.toURL();
        p.border = 1;
        p.xx = (i%3);
        p.yy = Math.floor(i/3);
        p.ww = galleryView.width/3;
        p.hh = galleryView.width/3;
        //console.log(entry.toURL()+"p:"+p+"i:"+i)
        loadGalleryImage(entry.toURL(),p,i);
        photos.push(p);
      }
    });
    $(document).off("vmousedown");
    $(document).on("vmousedown", recordCords);
    $(galleryView).off("taphold");
    $(galleryView).on( "taphold", goToDeleteMode );
    $(galleryView).off( "tap");
    $(galleryView).bind( "tap", goToPhotoPage );
  }

  function hitTest(hitX, hitY, xx, yy, ww, hh) {
    //console.log("!!!!!!!!!!!!!!hitTest(",hitX,hitY,xx,yy,ww,hh,")");
    //console.log("xx-ww=",xx-ww);
    return((hitX > xx * ww)&&(hitX < (xx+1)*ww)&&(hitY > yy * hh)&&(hitY < (yy+1)*hh));
  }

  function recordCords(evt) {
    holdCords.holdX = evt.clientX;
    holdCords.holdY = evt.clientY;
    //console.log("!!!!!!!!!!!!!vmousedown(",holdCords);
  }

  function renderDeleteEntries(resultEntries,at) {
    entries = resultEntries; // Cache the result set.
    selectedArray = [];
    if($.inArray( at, selectedArray )==-1) {
      selectedArray.push(at);
    }
    resultEntries.forEach(function(entry, i) {
      var p = document.createElement('img');
      loadDeleteImage(entry.toURL(),p,i);
    });
  }

  /*
  function modifygalleryPage(evt) {
    var bRect = galleryView.getBoundingClientRect();
    mouseX = (evt.clientX - bRect.left)*(galleryView.width/bRect.width);
    mouseY = (evt.clientY - bRect.top)*(galleryView.height/bRect.height);
    for (i=0; i < photos.length; i++) {
      if (hitTest(mouseX, mouseY,photos[i].xx,photos[i].yy,photos[i].ww,photos[i].hh)) {
        console.log("hitTest(",i,")",mouseX,mouseY,photos[i].xx,photos[i].yy,photos[i].ww,photos[i].hh);
        if($.inArray( i, selectedArray )==-1) {
          selectedArray.push(i);
        }
        if(selectedArray.length>0 && ($.inArray( i, selectedArray )>-1)) {
          //console.log(i);
          ctx_deleteView.fillRect(photo[i].xx*photo[i].ww,photo[i].yy*photo[i].hh,photo[i].ww,photo[i].hh);
          ctx_deleteView.drawImage(checkImg,photo[i].ww*photo[i].xx, photo[i].hh*photo[i].yy,20,20);
        }
      }
    }
    //$(galleryView).off("taphold");
    //$(galleryView).on( "taphold", goToDeleteMode );
    //$(galleryView).off( "tap");
    //$(galleryView).bind( "tap", goToPhotoPage );
  }
  */

  /*
  function addEntryToList(entry, opt_idx) {
    // If an index isn't passed, we're creating a dir or adding a file. Append it.
    if (opt_idx == undefined)
      entries.push(entry);
    var idx = (opt_idx === undefined) ? entries.length - 1 : opt_idx;
    var classname = "";
    if(idx%3==0)
      classname = "ui-block-a";
    else if(idx%3==1)
      classname = "ui-block-b";
    else if(idx%3==2)
      classname = "ui-block-c";
    else
      classname = "ui-block-a";

    var li = document.createElement('section');
    //console.log(classname);
    li.className = classname;
    var img = constructEntryHTML(entry, idx);
    li.appendChild(img);
    fileList.appendChild(li);
  }

  function constructEntryHTML(entry, i) {
    //console.log(entry);
    var p = document.createElement('img');
    p.id = i;
    p.filename = entry.name;
    p.fullpath = entry.toURL();
    p.border = 1;
    //p.addEventListener('click', goToPhotoPage, false);
    $(p).bind( "taphold", goToDeleteMode );
    $(p).bind( "tap", goToPhotoPage );
    //$(p).bind( "tap", goToPhotoPage );
    loadImage(entry.toURL(),p);
    return p;
  }
  */

  function goToDeleteMode(evt) {
    var bRect = galleryView.getBoundingClientRect();
    mouseX = (holdCords.holdX - bRect.left)*(galleryView.width/bRect.width);
    mouseY = (holdCords.holdY - bRect.top)*(galleryView.height/bRect.height);
    //mouseX = (evt.clientX - bRect.left)*(galleryView.width/bRect.width);
    //mouseY = (evt.clientY - bRect.top)*(galleryView.height/bRect.height);
        
    for (i=0; i < photos.length; i++) {
      //console.log(photos[i]);
      if (hitTest(mouseX, mouseY,photos[i].xx,photos[i].yy,photos[i].ww,photos[i].hh)) {
        //console.log("hitTest(",i,")",mouseX,mouseY,photos[i].xx,photos[i].yy,photos[i].ww,photos[i].hh);
        if($.inArray( i, selectedArray )==-1) {
          selectedArray.push(i);
        } else {
           var index = selectedArray.indexOf(i);
           selectedArray.splice(index, 1);
        }
        if(selectedArray.length>0 && ($.inArray( i, selectedArray )>-1)) {
          //console.log(photos[i]);
          //console.log("photo"+i+"select");
          ctx_galleryView.fillRect(photos[i].xx*photos[i].ww,photos[i].yy*photos[i].hh,photos[i].ww,photos[i].hh);
          ctx_galleryView.drawImage(checkImg,photos[i].ww*photos[i].xx, photos[i].hh*photos[i].yy,photos[i].ww*0.2,photos[i].hh*0.2);
        } else {
          //console.log("photo"+i+"unselect");
          //ctx_galleryView.globalCompositeOperation = "source-over";
          ctx_galleryView.strokeStyle = "white";
          ctx_galleryView.fillStyle = "rgba(0,0,0,0.8)";
          ctx_galleryView.drawImage(photos[i],photos[i].xx*photos[i].ww, photos[i].yy*photos[i].hh,photos[i].ww,photos[i].hh);
          ctx_galleryView.strokeRect(photos[i].xx*photos[i].ww,photos[i].yy*photos[i].hh,photos[i].ww,photos[i].hh);
          //ctx_galleryView.drawImage(checkImg,photos[i].ww*photos[i].xx, photos[i].hh*photos[i].yy,20,20);
        }
        //ListDeleteGallery(i);
      }
    }
    //console.log(btnGotoDelete2.style);
    if(selectedArray.length>0)
      btnGotoDelete2.style.display="block";
    else{
      btnGotoDelete2.style.display="none";
      reloadGalleryPage();
    }
    //$(galleryView).off("taphold");
    //$(galleryView).on( "taphold", goToDeleteMode );
    $(galleryView).off( "tap");
    $(galleryView).on( "tap", goToDeleteMode );
    //window.location.href = "#deletePage";
  }

  function goToPhotoPage(evt) {
    //console.log("goToPhotoPage(",evt.clientX,")");
    var bRect = galleryView.getBoundingClientRect();
    mouseX = (evt.clientX - bRect.left)*(galleryView.width/bRect.width);
    mouseY = (evt.clientY - bRect.top)*(galleryView.height/bRect.height);
    for (i=0; i < photos.length; i++) {
      if (hitTest(mouseX, mouseY,photos[i].xx,photos[i].yy,photos[i].ww,photos[i].hh)) {
        //console.log("hitTest(",i,")",mouseX,mouseY,photos[i].xx,photos[i].yy,photos[i].ww,photos[i].hh);
        if(photos[i].filename){
           //photoFileName.innerHTML = photos[i].filename.replace(".jpg","");;
          btnSavePhoto.href = photos[i].src;
          btnSavePhoto.download = photos[i].filename;
        }
        if(photos[i].fullpath)
          loadPhotobyNum(i);
        //console.log("goToPhotoPage(", evt,")");
        //window.location.href = "#photoPage";
        $(function(){
          $.mobile.changePage("#photoPage", {
            transition: "slidefade",
            reverse: false,
            changeHash: false
          });
        });
      }
    }
  }
  
function galleryGoToCamPage() {
  autoCam=true;
  window.location.href = "#";
  /*
  $(function(){ 
    $.mobile.changePage("#", {
      transition: "filp",
      reverse: false,
      changeHash: false,
      reloadPage: true
    });
  });
  */
}

function reloadGalleryPage() {
  ListGallery();
}
