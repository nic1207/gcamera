/*
 * 美肌效果套用
 */
var beautyView = document.querySelector('#beautyView');
var ctx_beautyView = beautyView.getContext('2d');
var beautyHeadBar =  document.querySelector('#beautyHeadBar');
var beautyFootBar =  document.querySelector('#beautyFootBar');
var btnGotoCustom01 = document.querySelector('#gotoCustom01');
var btnCancelBeauty = document.querySelector('#cancelBeauty');
var drawPhotoImg = null;

$( "#beautyPage" ).on( "pagebeforeshow", function( event, ui ) {
  //$("#slider-step").val("1");
  openLoading("載入中...");
  //editOriSrc = photoImg.src;
  setTimeout(drawBeautyPage,100);
  $("#slider-step").on("slidestop", function(e) {
    e.preventDefault();
    var val = $("#slider-step").val();
    //console.log("val=",val);
    openLoading("套用中...");
    beautyPS(val);
  });
});

//$( "#beautyPage" ).on( "pagebeforehide", function( event, ui ) {
//});


function beautyPageInit() {
  //console.log("beautyPageInit()",btnGotoCustom01);
  btnGotoCustom01.addEventListener('click', beautySkinSave, false);
  btnCancelBeauty.addEventListener('click', function(){doCancel(editOriSrc,0);}, false);
  $("#beautyskin_btn").click(function(){
    if($("#beauty_slider").is(":hidden")){
      $("#beauty_slider").fadeIn(500);
      $("#beautyskin_btn span").text("隱藏");
    }
    else{
      $("#beauty_slider").fadeOut(500);
      $("#beautyskin_btn span").text("顯示");
    }
  });
}

function drawBeautyPage() {
  if( $('#beautyHeadBar').height() > 0 && $('#beautyFootBar').height() >0){
    var val = $("#slider-step").val();
    openLoading("套用中...");
    beautyPS(val);
  }
  else
    setTimeout(drawBeautyPage,100);
}


  //FilterPS
function beautyPS(val) {
  //console.log("000000000000",photoImg.src);
  var ai = $AI(photoImg).ps("soften",val);
  if(!drawPhotoImg)
    drawPhotoImg = new Image();
  drawPhotoImg.src = ai.save();
  //console.log("111111111111",ai.save());
  drawView( beautyView, ctx_beautyView,$('#beautyHeadBar').height() + $('#beautyFootBar').height(),
    drawPhotoImg, drawPhotoImg.width, drawPhotoImg.height);
  closeLoading();
}

function onBeautySave() {
  closeLoading();  
}

function beautySkinSave() {
  //console.log("fname=",fname);
  if(fname) {
    //console.log(fname+".jpg",photoImg.src);
    openLoading("照片儲存中...");
    drawPhotoImg.src = saveABView(drawPhotoImg);
    saveImage(fname+".jpg",drawPhotoImg.src,onBeautySave);
    ctx_photo.clearRect(0,0,photo.width,photo.height);
    drawView( photo, ctx_photo,$('#beautyHeadBar').height() + $('#beautyFootBar').height(),
      drawPhotoImg, drawPhotoImg.width, photoImg.height, null, null, null, null, true);
    photoImg.src = drawPhotoImg.src;
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

