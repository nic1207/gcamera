/******************
0:閃光燈
1:拍照模式
2:切換鏡頭
3:全螢幕
4:網格構圖
5:保留原圖
6:快門音效
7:定時拍照
8:照片像素
9:刪除照片
******************/


var iconSrc =['img/flash.png',     
              'img/camera-mode.png',  
              'img/change.png',
              'img/NoFullScreen.png',
              'img/grid.png',
              'img/orgpic.png',
              'img/sound.png',
              'img/cancel_white.png'
];

 var Newicon = new Array(4);
 var Icon_Chosen="";
 var Icon_id="";
 var temp_value=""; //用以判斷是否重複的暫存數字
 var replace=true; //判斷是否存入陣列的key , false：否 ,true:是


// load icon number from local storage
function iconPageInit(){

	for(var i=0;i<Newicon.length;i++){
    Newicon[i]=localStorage.getItem("ReNewicon"+i);

    if(Newicon[i]==null){ //判斷陣列是否為空，空值設定預設值0~3
      Newicon[i]=i;
    }

    $("#icon-"+(i+2)).attr('src', iconSrc[Newicon[i]]);
  }
}
 

$("#icon-s2").click(function(event) {
  	Icon_Chosen=0; // icon-space1	
  	Icon_id="#icon-2";
 });
$("#icon-s3").click(function(event) {
  	Icon_Chosen=1; // icon-space2	
  	Icon_id="#icon-3";
 });
$("#icon-s4").click(function(event) {
  	Icon_Chosen=2; // icon-space3
  	Icon_id="#icon-4";	
 });
$("#icon-s5").click(function(event) {
  	Icon_Chosen=3; // icon-space4	
  	Icon_id="#icon-5";
 });



	$("#tmpicon-flash").click(function(event) {
  		temp_value=0;
  		repeat_check();

  		if(replace==true){
  			Newicon[Icon_Chosen]=temp_value;
			$(Icon_id).attr('src', 'img/flash.png');
      $("#iconMenu").popup("close");
  		}
  		else if(replace==false){
  			alert("大大，沒有人同樣的按鈕在放兩個的啦！！");
  		}
 	});


 	$("#tmpicon-mode").click(function(event) {
  		temp_value=1;
  		repeat_check();

  		if(replace==true){
  			Newicon[Icon_Chosen]=temp_value;
			$(Icon_id).attr('src', 'img/camera-mode.png');
      $("#iconMenu").popup("close");
  		}
  		else if(replace==false){
  			alert("大大，沒有人同樣的按鈕在放兩個的啦！！");
  		}
 	});
 	$("#tmpicon-change").click(function(event) {
  		temp_value=2;
  		repeat_check();
  		if(replace==true){
  			Newicon[Icon_Chosen]=temp_value;
			$(Icon_id).attr('src', 'img/change.png');
      $("#iconMenu").popup("close");
  		}
  		else if(replace==false){
  			alert("大大，沒有人同樣的按鈕在放兩個的啦！！");
  		}
 	});
	$("#tmpicon-fullscreen").click(function(event) {
  		temp_value=3;
  		repeat_check();
  		if(replace==true){
  			Newicon[Icon_Chosen]=temp_value;
			$(Icon_id).attr('src', 'img/NoFullScreen.png');
      $("#iconMenu").popup("close");
  		}
  		else if(replace==false){
  			alert("大大，沒有人同樣的按鈕在放兩個的啦！！");
  		}
 	});
 	$("#tmpicon-grid").click(function(event) {
  		temp_value=4;
  		repeat_check();
  		if(replace==true){
  			Newicon[Icon_Chosen]=temp_value;
			$(Icon_id).attr('src', 'img/grid.png');
      $("#iconMenu").popup("close");
  		}
  		else if(replace==false){
  			alert("大大，沒有人同樣的按鈕在放兩個的啦！！");
        //
  		}
 	});
 	$("#tmpicon-org").click(function(event) {
  		temp_value=5;
  		repeat_check();
  		if(replace==true){
  			Newicon[Icon_Chosen]=temp_value;
			$(Icon_id).attr('src', 'img/orgpic.png');
      $("#iconMenu").popup("close");
  		}
  		else if(replace==false){
  			alert("大大，沒有人同樣的按鈕在放兩個的啦！！");
  		}
 	});
 	$("#tmpicon-sound").click(function(event) {
  		temp_value=6;
  		repeat_check();
  		if(replace==true){
  			Newicon[Icon_Chosen]=temp_value;
			$(Icon_id).attr('src', 'img/sound.png');
      $("#iconMenu").popup("close");
  		}
  		else if(replace==false){
  			alert("大大，沒有人同樣的按鈕在放兩個的啦！！");
  		}
 	});
 	$("#tmpicon-remove").click(function(event) {
  		temp_value=7;
  		Newicon[Icon_Chosen]=temp_value;
  		$(Icon_id).attr('src', 'img/cancel_white.png');
      $("#iconMenu").popup("close");
 	});  




// 判斷是否重複選取
function repeat_check(){
	for(var i=0;i<Newicon.length;i++){
		if(temp_value==Newicon[i]){
			if(i==Icon_Chosen){
			 	//good event
				replace=true;
				break;
			}
			else{
				// bad event
				replace=false;
				break;
			}
		}
		else{
			// good event
			replace=true;
		}
	}
} 

function test(){
	for(var i=0;i<Newicon.length;i++){
		console.log(Newicon[i]);
	}
}

//將更新的icon編號 存入 local storage
$("#enterChange").click(function(event) {
	for(var i=0;i<Newicon.length;i++){
		localStorage.setItem( "ReNewicon"+i, Newicon[i]);
    reloadIcon();
	}
});

//將renewicon 變更為未更動前的狀態
$("#cancelChange").click(function(event) {
  iconPageInit();
});
