/**
 * @author Allen
 * Modified:2014.02.08 修正臉部偵測可同時傳入Canvas(harrLikeDetectFace2)或Image(harrLikeDetectFace)來作
 */

//臉部辨識所需變數
var imgWidth    = 0;
var imgHeight   = 0;
var fdImg = null;//用這個判斷一開始來源是image or canvas
var faceWidth   = 0;
var faceHeight  = 0; 
var facePosX    = 0;
var facePosY    = 0;
var faceNum     = 0;
var eyePosX = new Array(2);
var eyePosY = new Array(2);
//暫存臉部原始畫布
var tempSrcCanvas;
var tempCanvas;
//暫存臉部原始ImgData
var tempSrcImgData;

var realCrDownLimit;
var realCrUpLimit;

var eyeHorizontalProjectionFinal = new Array(2);
var eyeAreaWidth = 0;
var eyeAreaHeight = 0;
var realEyeHeight = new Array(2);
var gravityEyeX = new Array(2);
var gravityEyeY = new Array(2);

//draw face data position
var leftEyePos = new Object();
var rightEyePos = new Object();
var facePos = new Object();
//===================================================================================================
/**
 * harrLikedetectFace (width:imgWidth, height:imgHeight, source: sourceImg)
 * return Boolean (true: Find it!! ; false: Not Find!!)
 */
//===================================================================================================
function harrLikeDetectFace(width,height,source) {
  //console.log(width,height,source);
  imgWidth = width;
  imgHeight = height;
  fdImg = source;
  //console.log(img);
  if(!tempCanvas)
    tempCanvas = document.createElement('canvas');
  
  tempCanvas.width = width;
  tempCanvas.height = height;
  //document.body.appendChild(tempCanvas)
  tempSrcCanvas = tempCanvas.getContext('2d');
  //console.log(tempCanvas,tempSrcCanvas);
  tempSrcCanvas.drawImage(fdImg,0,0);
  //tempSrcCanvas = ctx_canvas;
  faceNum = 0;
  //setTimeout(function(){
  $(tempCanvas).objectdetect("all", {scaleMin: 3, scaleFactor: 1.2, classifier: objectdetect.frontalface}, function(faces){  
    console.log('FACE Num : ' + faces.length);
    faceNum = faces.length; 
    if(faceNum != 0) { 
      for(var i = 0 ; i < faceNum ; i++) {
        //臉部偵測 取最後那一個
        facePosX   = faces[i][0];
        facePosY   = faces[i][1];
        faceWidth  = faces[i][2];
        faceHeight = faces[i][3]; 
        console.log('FACE POSX :' + facePosX);
        console.log('FACE POSY :' + facePosY);
        console.log('FACE WIDTH :' + faceWidth);
        console.log('FACE HEIGHT :' + faceHeight);
      }//for
    }//if
  });//face 
  //},200);

  if(faceNum == 0) {
    // alert("人帥真好找不到臉,請返回拍照");  
    setTimeout(function(){$('#edit_fail').fadeIn();},500);
    setTimeout(function(){$('#edit_fail').fadeOut();},3000);
    return false; 
  }
  else {
    return true;   
  }
}
//===================================================================================================
/**
 * harrLikedetectFace2 (width:CanvasWidth, height:CanvasHeight, id: CanvasId, canvas:Context2D)
 * return Boolean (true: Find it!! ; false: Not Find!!)
 */
//===================================================================================================
function harrLikeDetectFace2(width,height,canvasId,context) {
  imgWidth = width;
  imgHeight = height;
  tempSrcCanvas = context;
  fdImg = null;
  faceNum = 0;

  $(canvasId).objectdetect("all", {scaleMin: 3, scaleFactor: 1.2, classifier: objectdetect.frontalface}, function(faces){  
    console.log('FACE Num : ' + faces.length);
    faceNum = faces.length; 
    if(faceNum != 0) { 
      for(var i = 0 ; i < faceNum ; i++) {
        //臉部偵測 取最後那一個
        facePosX   = faces[i][0];
        facePosY   = faces[i][1];
        faceWidth  = faces[i][2];
        faceHeight = faces[i][3]; 
        console.log('FACE POSX :' + facePosX);
        console.log('FACE POSY :' + facePosY);
        console.log('FACE WIDTH :' + faceWidth);
        console.log('FACE HEIGHT :' + faceHeight);
      }//for
    }//if
  });//face 

  if(faceNum == 0) {
    // alert("人帥真好找不到臉,請返回拍照");  
    // $('.noDetect_msg').fadeIn();
    setTimeout(function(){$('#auto_fail').fadeIn();},500);
    setTimeout(function(){$('#auto_fail').fadeOut();},3000);



    return false; 
  }
  else {
    return true;   
  }
}
//===================================================================================================
function detectFaceSkin() {
  if(faceNum != 0) {
    //Catch FaceSkinData To Transfers BinaryData
    var imgBinaryData = tempSrcCanvas.getImageData(facePosX,facePosY,faceWidth,faceHeight);
    //var imgSrcData = tempSrcCanvas.getImageData(facePosX,facePosY,faceWidth,faceHeight); 
    
    //Detect Face Skin
    imgBinaryData = convertToYCbCr(imgBinaryData); 

    //Draw Binaryimagedata(Skin white pixel) to Canvas
    //tempSrcCanvas.putImageData(imgBinaryData,facePosX,facePosY);
    
    //Detect Eyes Area
    decideEyesArea(imgBinaryData);
  }
}
//===================================================================================================
function decideEyesArea(img) {

  //Decide Face Serching Area
  var faceAreaSrc = new Array(faceWidth * faceHeight);
  
  //Reset Eyes variable
  initial();

  //COPY imgData
  var index = 0;
  for (var i = 0 ; i < faceWidth * faceHeight ; i++) {
    faceAreaSrc[i] = img.data[index];
    index += 4;
  }

  //Define Evaluate EyeBlock Size And Pos
  console.log("faceWidth=",faceWidth,"faceHeight=",faceHeight);
  eyeAreaWidth  = Math.floor(faceWidth  * 2.3 / 12);
  eyeAreaHeight = Math.floor(faceHeight * 2.3 / 12);  
  eyePosX[0] = Math.floor(facePosX + faceWidth * 2.7 / 12);
  eyePosY[0] = Math.floor(facePosY + faceHeight * 3 / 12);   
  eyePosX[1] = Math.floor(facePosX + faceWidth - (faceWidth * 2.7 / 12) - eyeAreaWidth);
  eyePosY[1] = Math.floor(facePosY + faceHeight * 3 / 12); 

  //New Two Eye Projection
  var leftEyeHorizontalProjection = {};
  var rightEyeHorizontalProjection = {};

  //將投影區域初始化為零
  for(var i = 0 ; i < eyeAreaHeight ; i++) {
    leftEyeHorizontalProjection[i] = 0;  
    rightEyeHorizontalProjection[i] = 0;  
  }

  //宣告投影區域平均值
  var leftEyeMeanHorizontalProjection = 0;
  var rightEyeMeanHorizontalProjection = 0;   

  //計算水平投影總數量
  var ii=0;
  for(var i = eyePosY[0] - facePosY ; i < eyePosY[0] - facePosY + eyeAreaHeight ; i++ ) {
    for(var j = eyePosX[0] - facePosX + 7 ; j < eyePosX[0] - facePosX + eyeAreaWidth - 7 ; j++) {
      if(faceAreaSrc[ i * faceWidth + j ] == 0) {
        leftEyeHorizontalProjection[ii]++;
        leftEyeMeanHorizontalProjection++;
      }  
    }
    ii++;
  }
  
  var jj=0;
  for(var i = eyePosY[1] - facePosY ; i < eyePosY[1] - facePosY + eyeAreaHeight ; i++ ) {
    for(var j = eyePosX[1] - facePosX + 7 ; j < eyePosX[1] - facePosX + eyeAreaWidth - 7 ; j++) {
      if(faceAreaSrc[ i * faceWidth + j ] == 0) {
        rightEyeHorizontalProjection[jj]++;
        rightEyeMeanHorizontalProjection++;
      }  
    }
    jj++;
  } 

  //水平投影區域的平均值
  leftEyeMeanHorizontalProjection = Math.floor(leftEyeMeanHorizontalProjection / eyeAreaHeight);
  rightEyeMeanHorizontalProjection = Math.floor(rightEyeMeanHorizontalProjection / eyeAreaHeight);  

  //決定水平投影區域的高度
  decideHorizontal_ProjectionArea(leftEyeHorizontalProjection, leftEyeMeanHorizontalProjection, eyeAreaHeight, 0);
  decideHorizontal_ProjectionArea(rightEyeHorizontalProjection, rightEyeMeanHorizontalProjection, eyeAreaHeight, 1);

  //兩個眼睛高度取較高的
  if(realEyeHeight[0] > realEyeHeight[1]) {
    realEyeHeight[1] = realEyeHeight[0];
  }
  else{
    realEyeHeight[0] = realEyeHeight[1];
  }

  //找尋眼睛區域內的重心
  for(var i = 0 ; i < 2 ; i++) {
    findEyeAreaGravity(eyeAreaWidth, realEyeHeight[i], i, faceAreaSrc);
  }
}
//===================================================================================================
function decideHorizontal_ProjectionArea(range,average,length,eyeNo) {

  var changeBrightnessTag = false;
  var indexArray = new Array();

  for(var i = length - 1 ; i >= 0 ; i--) {
    if(range[i] > average && range[i] < length * 0.7 && !changeBrightnessTag) {
      changeBrightnessTag = true;
      indexArray.push(i);
    }
    else if(range[i] < average && changeBrightnessTag) {
      changeBrightnessTag = false;
      indexArray.push(i);
    }
  }

  if(indexArray.length == 1) {
    eyeHorizontalProjectionFinal[eyeNo] = Math.floor(indexArray[0]/2);
    realEyeHeight[eyeNo] = Math.floor(indexArray[0]);
  } 
  else if(indexArray.length == 0) {
    eyeHorizontalProjectionFinal[eyeNo] = Math.floor(length/3);
    realEyeHeight[eyeNo] = Math.floor(length/3);
  }
  else if(indexArray.length >= 4) {
    if(indexArray[0] - indexArray[1] > indexArray[2] - indexArray[3]) {
      eyeHorizontalProjectionFinal[eyeNo] = Math.floor((indexArray[0] + indexArray[1])/2);
      realEyeHeight[eyeNo] = Math.floor(indexArray[0] - indexArray[1]);  
    } 
    else {
      eyeHorizontalProjectionFinal[eyeNo] = Math.floor((indexArray[2] + indexArray[3])/2);
      realEyeHeight[eyeNo] = Math.floor(indexArray[2] - indexArray[3]);
    }
  }
  else {
    eyeHorizontalProjectionFinal[eyeNo] = Math.floor((indexArray[0] + indexArray[1])/2);
    realEyeHeight[eyeNo] = Math.floor(indexArray[0] - indexArray[1]);
  }  
}
//===================================================================================================
function findEyeAreaGravity(areaWidth,areaHeight,index,faceData) {
  //console.trace();
  //定義眼鏡要做搜尋範圍面積
  var getEyeArea = new Array(areaWidth * areaHeight);
  var tempIndex = 0;

  var tempW = eyePosX[index] - facePosX;
  var tempH = eyePosY[index] - facePosY + eyeHorizontalProjectionFinal[index] - Math.floor(areaHeight/2);
 
  //取得眼睛面積範圍相對應臉部面積的像素
  for(var i = tempH ; i < tempH + areaHeight ; i++ ) {
    for(var j = tempW ; j < tempW + areaWidth; j++) {
      getEyeArea[tempIndex] = faceData[i * faceWidth + j];
      tempIndex++;
    }
  }

  //找區域重心
  findAreaGravityFormula(getEyeArea, areaWidth, areaHeight, index);
    
  //從臉部開始計算所以要減掉一臉部範圍
  //console.log(gravityEyeX);
  gravityEyeX[index] = eyePosX[index] + gravityEyeX[index] - facePosX;
  gravityEyeY[index] = eyePosY[index] + eyeHorizontalProjectionFinal[index] - Math.floor(realEyeHeight[index]/2) + gravityEyeY[index] - facePosY;
}
//===================================================================================================
function drawFace() {
  if(faceNum != 0) {
    //Draw Eye Area
    tempSrcCanvas.lineWidth = "2";
    tempSrcCanvas.strokeStyle = "yellow";
    /*
    tempSrcCanvas.rect(facePosX, 
                       facePosY, 
                       faceWidth, 
                       faceHeight);  
    tempSrcCanvas.stroke(); 
    */
    tempSrcCanvas.beginPath();
    tempSrcCanvas.arc(facePosX + faceWidth/2, facePosY + faceHeight/2, faceWidth/2, 0,2 * Math.PI);
    tempSrcCanvas.stroke();
  }
}
//===================================================================================================
function drawEye(index) { 
  //有偵測到的雙眼
  if(faceNum != 0) {
    //Draw Eye Area
    tempSrcCanvas.lineWidth = "2";
    tempSrcCanvas.strokeStyle = "yellow";
    tempSrcCanvas.rect(gravityEyeX[index] - realEyeHeight[index]/2 + facePosX, 
                       gravityEyeY[index] - realEyeHeight[index]/2 + facePosY, 
                       realEyeHeight[index], 
                       realEyeHeight[index]); 
                  
    tempSrcCanvas.stroke(); 
  }
}
//===================================================================================================
function findAreaGravityFormula(area,w,h,kind) {
  
  var totalArea= 0;
  
  //Reset
  var eyeX = 0;
  var eyeY = 0;
  console.log("w=",w,"h=",h);
  //Caculate Gravity
  for(var i = 0 ; i < h ; i++) {
    for(var j = 0 ; j < w ; j++) {
      //Binary image get black pixel
      if(area[ i * w + j ] == 0) {
        totalArea++;
        eyeX = j*1 + eyeX;
        eyeY = i*1 + eyeY;
      }
    }  
  }

  if(totalArea == 0) {
    eyeX = 25;
    eyeY = 10;
  }
  else {
    eyeX = Math.floor(eyeX/totalArea);
    eyeY = Math.floor(eyeY/totalArea);
  }
  console.log(eyeX,eyeY,totalArea);

  gravityEyeX[kind] = eyeX;
  gravityEyeY[kind] = eyeY;
}
//===================================================================================================
function load_face_eyes_mouth_tag(stage,layer) {
/*  
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  for(var src in sources) {
    numImages++;
  }

  for(var src in sources) {
    images[src] = new Image();
    //images[src].onload = function() {
      if(++loadedImages >= numImages) {
        show_face_eyes_mouth(images,stage,layer);
      }
    //};
    images[src].src = sources[src];
  }
*/
}
//===================================================================================================
function load_Face_Eyes_Mouth_Tag(layer){
/*
  var face_img = new Image();
  face_img.src = sources.Face;
  
  var eye_img1 = new Image();
  eye_img1.src = sources.Eye1;
  
  var eye_img2 = new Image();
  eye_img2.src = sources.Eye2;
  
  var mouth_img = new Image();
  mouth_img.src = sources.Mouth;

  setTimeout(function(){
    layer.drawImage(face_img, FacePosX, FacePosY, FaceWidth, FaceHeight); 
    layer.drawImage(eye_img1, EyePosX[0], EyePosY[0], EyeWidth[0], EyeHeight[0]); 
    layer.drawImage(eye_img2, EyePosX[1], EyePosY[1], EyeWidth[1], EyeHeight[1]); 
    layer.drawImage(mouth_img, MouthPosX, MouthPosY, MouthWidth, MouthHeight);    
  },50);  
*/
}   
//===================================================================================================
/**
 * convertToYCbCr (img: imgData)
 * return BinaryImgData 
 */
//===================================================================================================
function convertToYCbCr (img){
  var srcLength = img.data.length;
  var meanYAverageLength  = srcLength * 0.2 / 4;
  var src = img.data;

  var meanYArray = new Array(srcLength/4);
  var meanY = 0;
  var meanCr = 0;
  var dst = {};
  var gray = {};
  
  for (var i = 0 ; i < srcLength ; i += 4) {
    dst[i] = 0.299 * src[i] + 0.587 * src[i+1] + 0.114 * src[i+2]; 
    dst[i+1] = -0.1687 * src[i] - 0.3313 * src[i+1] + 0.5 * src[i+2] + 128; 
    dst[i+2] = 0.5 * src[i] - 0.4187 * src[i+1] - 0.0813 *src[i+2] + 128;
    meanYArray[i/4] = dst[i];
    meanCr = meanCr + dst[i+2];
  }

  //decide MeanY Threshold
  meanYArray.sort(sortNumber);
  for(var i = 0 ; i < meanYAverageLength ; i++) {
    meanY = meanY + meanYArray[i]; 
  }

  meanY = meanY / meanYAverageLength; 

  //decide MeanCr Threshold
  meanCr = meanCr/(srcLength/4);
  decideYCrLimit(meanCr);

  for (var i = 0; i < srcLength; i += 4) {
    if ( (dst[i] > meanY) && ( dst[i+2] >= realCrDownLimit && dst[i+2] <= realCrUpLimit ) ) {
      src[i] = src[i+1] = src[i+2] = 255;
      gray[i/4] = 255;
    }        
    else{
      src[i] = src[i+1] = src[i+2] = 0;
      gray[i/4] = 0;
    }
  }

  /*
  gray = Erosion(gray,img.width,img.height);
  gray = Erosion(gray,img.width,img.height);
  gray = Dilation(gray,img.width,img.height);
  gray = Dilation(gray,img.width,img.height);
  */

  img.data = src;
  return  img;
}
//===================================================================================================
function initial() {
  for(var i = 0 ; i <　2 ; i++) {
    eyeHorizontalProjectionFinal[i] = 0;
    realEyeHeight[i] = 0;
    gravityEyeX[i] = 0;
    gravityEyeY[i] = 0;  
  }
}
//===================================================================================================
function Erosion (img,width,height){
  
  //var inLength = img.data.length;
  var input=img;
  var output={};
  //var width = img.width;
  //var height = img.height;
  var mask = [0,0, -1,0, 0,-1, 0,1, 1,0, -1,-1, -1,1, 1,-1, 1,1];
  
  //Copy image for output
  for(var x = 0 ; x < width ; x++) {
    for(var y = 0 ; y < height ; y++) {
       output[ (y * width) + x ] = input[ (y * width) + x ]; 
    }
  }
      
  //Execute  erosion function    
  for(var x = 1 ; x < width - 1 ; x++) {
    for(var y = 1 ; y < height - 1 ; y++) {
      for(var j = 0; j < 18 ; j += 2) {
        if ( input[ (y + mask[ j + 1 ] ) * width + x + mask[ j ] ] == 0) {
           output[ (y * width) + x ] = 0;
        }        
      }
    }
  }
  return  output;
}
//===================================================================================================
function Dilation (img,width,height){
  
  //var inLength = img.data.length;
  var input=img;
  var output={};
  //var width = img.width;
  //var height = img.height;
  var mask = [0,0, -1,0, 0,-1, 0,1, 1,0, -1,-1, -1,1, 1,-1, 1,1];
  
  //Copy image for output
  for(var x = 0 ; x < width ; x++) {
    for(var y = 0 ; y < height ; y++) {
       output[ (y * width) + x ] = input[ (y * width) + x ]; 
    }
  }
      
  //Execute  Dilation function    
  for(var x = 1 ; x < width - 1 ; x++) {
    for(var y = 1 ; y < height - 1 ; y++) {
      for(var j = 0 ; j < 18 ; j += 2) {
        if ( input[ (y + mask[ j + 1 ] ) * width + x + mask[ j ] ] == 255){
           output[ (y * width) + x ] =255;
        }        
      }
    }
  }
  return  output;
}
//===================================================================================================
function sortNumber(a,b) {
  return a - b
}
//===================================================================================================
function decideYCrLimit(meanCr){
  //if(meanY>80){
    /*
    if(meanCb > 135){
      //realCbDownLimit = 85;
      //realCbUpLimit = 155;
      realCrDownLimit = 125;
      realCrUpLimit = 180;  
    }
    */
    if(meanCr > 130 && meanCr < 140){
      //realCbDownLimit = 85;
      //realCbUpLimit = 135;
      realCrDownLimit = 128;
      realCrUpLimit = 170;    
    }
    else if(meanCr > 125 && meanCr < 130){
      //realCbDownLimit = 85;
      //realCbUpLimit = 135;
      realCrDownLimit = 125;
      realCrUpLimit = 165;   
    }
    else if(meanCr <= 125){
      //realCbDownLimit = 85;
      //realCbUpLimit = 135;
      realCrDownLimit = 122;
      realCrUpLimit = 165;
    }
    else{
      realCrDownLimit = 133;
      realCrUpLimit = 170;    
    }
}
//===================================================================================================
