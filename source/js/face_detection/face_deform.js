/**
 * @author Allen
 * Need detect_face_and_eye_algo.js
 * Modified:2014.02.08 修正臉部變形(瘦臉)IMAGE會內凹的問題
 * Modified:2014.02.10 修正瘦臉胖臉可讓USER輸入範圍去變形
 * Modified:2014.03.04 修正USER可拖曳重設眼睛臉部範圍使之變形
 * Modified:2014.03.05 修正找不到臉拖曳眼睛臉部範圍後變形會錯誤的問題
 */
var imgSourceData;
var imgFaceSrcData,imgFaceDstData;
var imgSrcDataLeftFace,imgSrcDataRightFace;
var imgDstDataLeftFace,imgDstDataRightFace;
var leftFaceX = 0, rightFaceX = 0, leftFaceY = 0, rightFaceY = 0;
var leftFaceWidth = 0, rightFaceWidth = 0, leftFaceHeight = 0, rightFaceHeight = 0;
//var isNoFoundFace = false;
//===================================================================================================
function catchFaceSourceData() {
  console.log("catchData");
  //catchFaceImgData
  imgSourceData  = tempSrcCanvas.getImageData(0,0,tempSrcCanvas.canvas.width,tempSrcCanvas.canvas.height);
  imgFaceSrcData = tempSrcCanvas.getImageData(facePosX,facePosY,faceWidth,faceHeight);
  imgFaceDstData = tempSrcCanvas.getImageData(facePosX,facePosY,faceWidth,faceHeight);
  decideDefoemArea();
  //catchLeftFaceImgData
  //console.log(facePosX,facePosY,faceWidth,faceHeight);
  //console.log(leftFaceX,leftFaceY,leftFaceWidth,leftFaceHeight);
  //console.log(rightFaceX,rightFaceY,rightFaceWidth,rightFaceHeight);
  imgSrcDataLeftFace = tempSrcCanvas.getImageData(leftFaceX,leftFaceY,leftFaceWidth,leftFaceHeight);
  imgDstDataLeftFace = tempSrcCanvas.getImageData(leftFaceX,leftFaceY,leftFaceWidth,leftFaceHeight);
  //tempSrcCanvas.putImageData(imgSrcDataLeftFace,0,0);
  //catchRightFaceImgData
  imgSrcDataRightFace = tempSrcCanvas.getImageData(rightFaceX,rightFaceY,rightFaceWidth,rightFaceHeight);
  imgDstDataRightFace = tempSrcCanvas.getImageData(rightFaceX,rightFaceY,rightFaceWidth,rightFaceHeight);

  //----------------------- input 智能美容要畫出的 data -----------------------
  leftEyePos.x = gravityEyeX[0] + facePosX;
  leftEyePos.y = gravityEyeY[0] + facePosY;
  leftEyePos.radius = realEyeHeight[0]/2;

  rightEyePos.x = gravityEyeX[1] + facePosX;
  rightEyePos.y = gravityEyeY[1] + facePosY;
  rightEyePos.radius = realEyeHeight[1]/2;

  facePos.x = (gravityEyeX[0] + facePosX + gravityEyeX[1] + facePosX) / 2;
  if(leftFaceY <= rightFaceY) {
    facePos.y = (rightFaceY + rightFaceHeight + leftFaceY - faceWidth/4) / 2;
  }
  else {
    facePos.y = (leftFaceY + leftFaceHeight + rightFaceY - faceWidth/4) / 2;
  }

  facePos.radius = realEyeHeight[0]/2;
}
//===================================================================================================
/**
 * bigEye (ratio:small:-0.2 ~ -1.0:big)
 */
//===================================================================================================
function bigEye(ratio) {

  var dataCopy = new Uint8ClampedArray(imgFaceSrcData.data);
  imgFaceDstData.data.set(dataCopy);

  var radius1, radius2;
  if(realEyeHeight[0] * 1.5 > faceWidth / 10) {
    radius1 = Math.floor(faceWidth / 10 * 0.66);
  }
  else {
    radius1 = realEyeHeight[0] * 1.5;
  }

  if(realEyeHeight[1] * 1.5 > faceWidth / 10) {
    radius2 = Math.floor(faceWidth / 10 * 0.66);
  }
  else {
    radius2 = realEyeHeight[1] * 1.5;
  }

  //Call JsManipulate to BigEye
  JSManipulate.pinch.filter(imgFaceDstData, {amount : ratio,
                                             radius: radius1,
                                             angle: 0,
                                             centerX: gravityEyeX[0]/faceWidth,
                                             centerY: gravityEyeY[0]/faceHeight});
  JSManipulate.pinch.filter(imgFaceDstData, {amount : ratio,
                                             radius: radius2,
                                             angle: 0,
                                             centerX: gravityEyeX[1]/faceWidth,
                                             centerY: gravityEyeY[1]/faceHeight});
  return imgFaceDstData;
}
//===================================================================================================
/**
 * smallEye (ratio:small:0.2 ~ 1.0:big)
 */
//===================================================================================================
function smallEye(ratio) {

  var dataCopy = new Uint8ClampedArray(imgFaceSrcData.data);
  imgFaceDstData.data.set(dataCopy);

  var radius1, radius2;
  if(realEyeHeight[0] * 1.1 > faceWidth / 10) {
    radius1 = Math.floor(faceWidth / 10 * 0.66);
  }
  else {
    radius1 = realEyeHeight[0] * 1.1;
  }

  if(realEyeHeight[1] * 1.1 > faceWidth / 10) {
    radius2 = Math.floor(faceWidth / 10 * 0.66);
  }
  else {
    radius2 = realEyeHeight[1] * 1.1;
  }

  //Call JsManipulate to BigEye
  JSManipulate.pinch.filter(imgFaceDstData, {amount : ratio,
                                             radius: radius1,
                                             angle: 0,
                                             centerX: gravityEyeX[0]/faceWidth,
                                             centerY: gravityEyeY[0]/faceHeight});
  JSManipulate.pinch.filter(imgFaceDstData, {amount : ratio,
                                             radius: radius2,
                                             angle: 0,
                                             centerX: gravityEyeX[1]/faceWidth,
                                             centerY: gravityEyeY[1]/faceHeight});
  return imgFaceDstData;
}
//===================================================================================================
function decideDefoemArea() {

      /*
      //Determine Deform Area for Left part face
      if ( (eyePosX[0] + eyeAreaWidth / 2 - faceWidth * 0.75) < 0 ) {
        leftFaceX=0;
        leftFaceWidth = eyePosX[0] + eyeAreaWidth / 2;
      }
      else{
        leftFaceX = eyePosX[0] + eyeAreaWidth / 2 - faceWidth * 0.75;
        leftFaceWidth = faceWidth * 0.75;
      }

      if ((eyePosY[0] + eyeHorizontalProjectionFinal[0] + realEyeHeight[0] + faceHeight) > camView.height) {
        leftFaceY = eyePosY[0] + eyeHorizontalProjectionFinal[0] + realEyeHeight[0];
        leftFaceHeight = camView.height - leftFaceY;
      }
      else{
        leftFaceY = eyePosY[0] + eyeHorizontalProjectionFinal[0] +realEyeHeight[0];
        leftFaceHeight = faceHeight;
      }

      //Determine Deform  Area for Right part face
      if ((eyePosX[1] + eyeAreaWidth / 2 + faceWidth * 0.75) > camView.width) {
        rightFaceX = eyePosX[1] + eyeAreaWidth / 2;
        rightFaceWidth = camView.width - rightFaceX;
      }
      else{
        rightFaceX = eyePosX[1] + eyeAreaWidth / 2;
        rightFaceWidth = faceWidth * 0.75;
      }

      if ((eyePosY[1] + eyeHorizontalProjectionFinal[1] + realEyeHeight[1] + faceHeight) > camView.height) {
        rightFaceY = eyePosY[1] + eyeHorizontalProjectionFinal[1] + realEyeHeight[1];
        rightFaceHeight = camView.height - rightFaceY;
      }
      else{
        rightFaceY = eyePosY[1] + eyeHorizontalProjectionFinal[1] + realEyeHeight[1];
        rightFaceHeight = faceHeight;
      }
      */

      var adjustX = (imgWidth - imgHeight) / 2;
      //Determine Deform Area for Left part face
      if ( (gravityEyeX[0] + facePosX - faceWidth * 0.75) < adjustX) {
        leftFaceX = Math.floor(adjustX);
        leftFaceWidth = Math.floor(gravityEyeX[0] + facePosX - adjustX);
      }
      else{
        leftFaceX = Math.floor(gravityEyeX[0] + facePosX - faceWidth * 0.75);
        leftFaceWidth = Math.floor(faceWidth * 0.75);
      }

      if ((eyePosY[0] + eyeHorizontalProjectionFinal[0] + realEyeHeight[0] + faceHeight) > imgHeight) {
        leftFaceY = Math.floor(eyePosY[0] + eyeHorizontalProjectionFinal[0] + realEyeHeight[0]);
        leftFaceHeight = Math.floor(imgHeight - leftFaceY);
      }
      else{
        leftFaceY = Math.floor(eyePosY[0] + eyeHorizontalProjectionFinal[0] + realEyeHeight[0]);
        leftFaceHeight = Math.floor(faceHeight);
      }

      //Determine Deform  Area for Right part face
      if ((gravityEyeX[1] + facePosX + faceWidth * 0.75) > imgWidth - adjustX) {
        rightFaceX = Math.floor(gravityEyeX[1] + facePosX);
        rightFaceWidth = Math.floor(imgWidth - adjustX - gravityEyeX[1] - facePosX);
      }
      else{
        rightFaceX = Math.floor(gravityEyeX[1] + facePosX);
        rightFaceWidth = Math.floor(faceWidth * 0.75);
      }

      if ((eyePosY[1] + eyeHorizontalProjectionFinal[1] + realEyeHeight[1] + faceHeight) > imgHeight) {
        rightFaceY = Math.floor(eyePosY[1] + eyeHorizontalProjectionFinal[1] + realEyeHeight[1]);
        rightFaceHeight = Math.floor(imgHeight - rightFaceY);
      }
      else{
        rightFaceY = Math.floor(eyePosY[1] + eyeHorizontalProjectionFinal[1] + realEyeHeight[1]);
        rightFaceHeight = Math.floor(faceHeight);
      }
}
//===================================================================================================
function deformFace(ratio){
      //@ratio=Deform parameter; ratio>0==>thin face (0~0.3); ratio<0==>fat face(-0.3~0)
      var dataCopy = new Uint8ClampedArray(imgSrcDataLeftFace.data);
      imgDstDataLeftFace.data.set(dataCopy);
      var dataCopy1 = new Uint8ClampedArray(imgSrcDataRightFace.data);
      imgDstDataRightFace.data.set(dataCopy1);

      //ctx_view.putImageData(imgDataLeftFace,leftFaceX,leftFaceY);
      //var imgDataLeftDeformface = ctx_view.getImageData(leftFaceX,leftFaceY,leftFaceWidth,leftFaceHeight);
      imgDstDataLeftFace = deformImg(imgDstDataLeftFace,1+ratio);
      //x_view.putImageData(imgDstDataLeftFace,0,0);

      //ctx_view.putImageData(imgDataRightFace,rightFaceX,rightFaceY);
      //var imgDataRightDeformface = ctx_view.getImageData(rightFaceX,rightFaceY,rightFaceWidth,rightFaceHeight);
      imgDstDataRightFace = deformImg(imgDstDataRightFace,1-ratio);
      //ctx_view.putImageData(imgDataRightDeformface,rightFaceX,rightFaceY);
}
//===================================================================================================
function deformImg (img,range){
  var src=img.data;
  var width = img.width;
  var height = img.height;
  var gamma;
  var posx = 0;
  var loc,factor;
  var dst = new Uint8ClampedArray(src);
  for(var y = 0; y < height; y ++) {
    if (y<(height/2)) {
      gamma=1+(1-range)/(height/2)*y;
    } else {
      gamma=1-(1-range)/(height/2)*(y-height);
    }

    for(var x = 0; x < width-1; x ++) {
      posx=Math.pow((x/(width-1)),(1/gamma))*(width-1);
      loc=Math.floor(posx);
      factor=posx-loc;
      src[((y * width) + x) *4] = dst[((y * width) + loc)*4]*(1-factor)+dst[((y * width) + loc+1)*4]*factor;//R
      src[((y * width) + x) *4+1] = dst[((y* width) + loc)*4+1]*(1-factor)+dst[((y * width) + loc+1)*4+1]*factor;//G
      src[((y * width) + x) *4+2] = dst[((y * width) + loc)*4+2]*(1-factor)+dst[((y * width) + loc+1)*4+2]*factor;//B
    }
    src[((y * width) + x)*4] = dst[((y * width) + x)*4];//R
    src[((y * width) + x) *4+1] = dst[((y* width) + x)*4+1];//G
    src[((y * width) + x) *4+2] = dst[((y * width) + x)*4+2];//B
  }
  return  img;
}
//===================================================================================================
/**
 * [雙線性內插 Bilinear interpolation]
 * @param  {[imagedata]} pixels [圖形資料]
 * @param  {[double]} x      [x座標]
 * @param  {[double]} y      [y座標]
 * @param  {[int]} offset [偏移植 0 R 1 G 2 B 3 A]
 * @param  {[int]} width  [圖片寬度]
 * @param  {[int]} height [圖片高度]
 * @return {[double]} [雙線性內插值]
 */
function bilinear(pixels, x, y, offset, width, height) {
  x0 = Math.floor(x);
  x1 = ( Math.ceil(x) > (width-1) ? (width-1) : Math.ceil(x) );
  y0 = Math.floor(y);
  y1 = ( Math.ceil(y) > (height-1) ? (height) : Math.ceil(y) );
  var f00 = ivect(x0, y0, width);
  var f10 = ivect(x1, y0, width);
  var f01 = ivect(x0, y1, width);
  var f11 = ivect(x1, y1, width);
  var dx = x -x0;
  var dy = y -y0;
  var rt = inner(pixels[f00+offset], pixels[f10+offset],pixels[f01+offset], pixels[f11+offset], dx, dy);
  return rt;
}
function inner(f00, f10, f01, f11, x, y) {
  var un_x = 1.0 - x;
  var un_y = 1.0 - y;
  return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
}
function ivect(x, y, w) {
  return((x + w * y) * 4);
}
function hypotsq(x, y) {
  return x*x + y*y;
}
function deformImg2 (img, startObj, stopObj) {
  var src=img.data;
  var width = img.width;
  var height = img.height;
  var dst = new Uint8ClampedArray(src);
  var str = 50;
  //console.log("r=",startObj.r,"width=",width,"height=",height);
  var rmax2 = (startObj.r) * (startObj.r);
  var mPoint = stopObj;
  var mcx = mPoint.x-startObj.x;
  var mcy = mPoint.y-startObj.y;
  var ccc = Math.sqrt(mcx*mcx + mcy*mcy);
  var msq = hypotsq(mcx,mcy);
  if(msq<=200)
    msq=300;
  //console.log("mcx=",mcx,"mcy=",mcy,ccc);

  for(var y = 0; y < height-1; y++) {
    for(var x = 0; x < width-1; x++) {
      var dx = startPos.xx+x-startPos.x;
      var dy = startPos.yy+y-startPos.y;
      var rsq = hypotsq(dx,dy);
      //console.log("rsq=",rsq);
      if(rsq < rmax2) {
        //var msq = hypotsq(mcx,mcy);
        var edge_dist = rmax2 - rsq;
        var a = edge_dist / (edge_dist + msq*(100/str));
        a *= a;
        //console.log(a);

        var u =  x - a * mcx;
        var v =  y - a * mcy;
        var red = bilinear(dst, u, v, 0, width, height);
        //var red = bicubic(dst, u, v, 0, width);
        var green = bilinear(dst, u, v, 1, width, height);
        //var green = bicubic(dst, u, v, 1, width);
        var blue = bilinear(dst, u, v, 2, width, height);
        //var blue = bicubic(dst, u, v, 2, width);
        var alpha = bilinear(dst, u, v, 3, width, height);
        //var alpha = bicubic(dst, u, v, 3, width);

        src[((y * width) + x)*4] = red;//R
        src[((y * width) + x)*4+1] = green;//G
        src[((y * width) + x)*4+2] = blue;//B
        src[((y * width) + x)*4+3] = alpha;//A
        //src[((y * width) + x)*4+3] = dst[((v * width) + u)*4+3];//A
      }
    }
  }
  return img;
}
//===================================================================================================
function drawFaceDeformData() {
  if(fdImg)//如果一開始來源是image就跳開, 交給caller自己處理
    return;

  //FaceImgData
  tempSrcCanvas.putImageData(imgFaceDstData,facePosX,facePosY);
  //LeftFaceImgData
  tempSrcCanvas.putImageData(imgDstDataLeftFace,leftFaceX,leftFaceY);
  //RightFaceImgData
  tempSrcCanvas.putImageData(imgDstDataRightFace,rightFaceX,rightFaceY);
}
//===================================================================================================
function getEffectImage(isUserDrag) {
  //User有拖曳眼睛臉部特徵才重繪
  if(isUserDrag) {
    //console.log("isUserDrag=",isUserDrag);
    setTimeout(function() {
      tempSrcCanvas.putImageData(imgSourceData,0,0);
    },100);
  }

  //EyeImgData
  tempSrcCanvas.putImageData(imgFaceDstData,facePosX,facePosY);
  //LeftFaceImgData
  tempSrcCanvas.putImageData(imgDstDataLeftFace,leftFaceX,leftFaceY);
  //RightFaceImgData
  tempSrcCanvas.putImageData(imgDstDataRightFace,rightFaceX,rightFaceY);

  //drawFace();
  //drawEye(0);
  //drawEye(1);
  return tempCanvas.toDataURL();
}
//===================================================================================================
function OriginEyeOriginFace() {
  bigEye(0.0);
  deformFace(0.0);
  drawFaceDeformData();
}
//===================================================================================================
function bigEyeThinFace() {
  bigEye(-0.8);
  deformFace(0.2);
  drawFaceDeformData();
}
//===================================================================================================
function bigEyeFatFace() {
  bigEye(-0.8);
  deformFace(-0.2);
  drawFaceDeformData();
}
//===================================================================================================
function smallEyeThinFace() {
  smallEye(0.3);
  deformFace(0.2);
  drawFaceDeformData();
}
//===================================================================================================
function smallEyeFatFace() {
  smallEye(0.3);
  deformFace(-0.2);
  drawFaceDeformData();
}
//===================================================================================================
function deformEyeFace(eyeRatio,faceRatio) {
  //alert(eyeRatio);
  //alert(faceRatio);
  if(eyeRatio > 0) {
    smallEye(eyeRatio);
  }
  else {
    bigEye(eyeRatio);
  }

  deformFace(faceRatio);
  //drawFaceDeformData();
}
//===================================================================================================
function resetFaceSourceData(leftPos,rightPos,facePos) {

  //找不到臉才用比例自訂一輪廓，否則都用HAAR LIKE的方法找的輪廓
  if(faceNum == 0) {
    facePosX   = leftPos.x - 5 * leftPos.radius;
    if(facePosX < 0)
      facePosX = 0;
    facePosY   = leftPos.y - 5 * leftPos.radius;
    if(facePosY < 0)
      facePosY = 0;
    faceWidth  = tempSrcCanvas.canvas.width / 2;
    faceHeight = tempSrcCanvas.canvas.width / 2;

    eyeAreaWidth  = Math.floor(faceWidth  * 2.3 / 12);
    eyeAreaHeight = Math.floor(faceHeight * 2.3 / 12);  
    eyePosX[0] = Math.floor(facePosX + faceWidth * 2.7 / 12);
    eyePosY[0] = Math.floor(facePosY + faceHeight * 3 / 12);   
    eyePosX[1] = Math.floor(facePosX + faceWidth - (faceWidth * 2.7 / 12) - eyeAreaWidth);
    eyePosY[1] = Math.floor(facePosY + faceHeight * 3 / 12);  
  }  
    
  
  gravityEyeX[0] = leftPos.x  - facePosX;
  gravityEyeX[1] = rightPos.x - facePosX;
  gravityEyeY[0] = leftPos.y  - facePosY;
  gravityEyeY[1] = rightPos.y - facePosY;
  realEyeHeight[0] = 16;                   
  realEyeHeight[1] = 16;
  eyeHorizontalProjectionFinal[0] = realEyeHeight[0] * 3;
  eyeHorizontalProjectionFinal[1] = realEyeHeight[1] * 3;
  
 
  if(faceNum == 0)
  {
    //catchFaceImgData
    tempSrcCanvas.putImageData(imgSourceData,0,0); 
    imgFaceSrcData = tempSrcCanvas.getImageData(facePosX,facePosY,faceWidth,faceHeight);
    imgFaceDstData = tempSrcCanvas.getImageData(facePosX,facePosY,faceWidth,faceHeight);

    decideDefoemArea();

    //catchLeftFaceImgData
    imgSrcDataLeftFace = tempSrcCanvas.getImageData(leftFaceX,leftFaceY,leftFaceWidth,leftFaceHeight);
    imgDstDataLeftFace = tempSrcCanvas.getImageData(leftFaceX,leftFaceY,leftFaceWidth,leftFaceHeight);

    //catchRightFaceImgData
    imgSrcDataRightFace = tempSrcCanvas.getImageData(rightFaceX,rightFaceY,rightFaceWidth,rightFaceHeight);
    imgDstDataRightFace = tempSrcCanvas.getImageData(rightFaceX,rightFaceY,rightFaceWidth,rightFaceHeight);  
  }
}
//===================================================================================================
function getSourceData() {
  imgSourceData  = tempSrcCanvas.getImageData(0,0,tempSrcCanvas.canvas.width,tempSrcCanvas.canvas.height);
}
//===================================================================================================
/**
 * 馬賽克效果
 * mosaic(x: areaPosX, y: areaPosY, w: areaWidth, h: areaHeight, source: sourceImg, size: 1 ~ 50)
 */
//===================================================================================================
function mosaic(x,y,w,h,source,blockSize) {
  if(blockSize < 1) {
    blockSize = 1;
  }
  else if(blockSize > 50) {
    blockSize = 50;
  }

  var img = source;
  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  var ctx = tempCanvas.getContext('2d');
  ctx.drawImage(img,0,0);

  var imgDstData = ctx.getImageData(x, y, w, h);

  //mosaic function
  JSManipulate.pixelate.filter(imgDstData, {size : blockSize});

  ctx.putImageData(imgDstData, x, y);
  var dataURL = tempCanvas.toDataURL();
  //delete tempCanvas;
  return dataURL;
}
//===================================================================================================
/**
 * 凸透鏡效果
 * pinchEffect(leftObject: leftObject, rightObject: rightObject, source: sourceImg, size: -0.1 ~ -1)
 */
//===================================================================================================
function pinchEffect(leftObject,rightObject,source,ratio) {
  if(ratio > 0) {
    ratio = 0;
  }
  else if(ratio < -1) {
    ratio = -1;
  }

  var img = source;
  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  var ctx = tempCanvas.getContext('2d');
  ctx.drawImage(img,0,0);

  var imgDstLeftObjData = ctx.getImageData(leftObject.x - leftObject.r, leftObject.y - leftObject.r, leftObject.r * 2, leftObject.r * 2);
  var imgDstRightObjData = ctx.getImageData(rightObject.x - rightObject.r, rightObject.y - rightObject.r, rightObject.r * 2, rightObject.r * 2);

  JSManipulate.pinch.filter(imgDstLeftObjData, {amount : ratio,
                                                radius: leftObject.r,
                                                angle: 0,
                                                centerX: 0.5,
                                                centerY: 0.5});

  JSManipulate.pinch.filter(imgDstRightObjData, {amount : ratio,
                                                 radius: rightObject.r,
                                                 angle: 0,
                                                 centerX: 0.5,
                                                 centerY: 0.5});

  ctx.putImageData(imgDstLeftObjData, leftObject.x - leftObject.r, leftObject.y - leftObject.r);
  ctx.putImageData(imgDstRightObjData, rightObject.x - rightObject.r, rightObject.y - rightObject.r);
  var dataURL = tempCanvas.toDataURL();
  //delete tempCanvas;
  return dataURL;
}
//===================================================================================================
/**
 * 取得合併後的影像
 * getMergeImg(sourceImg: sourceImg, targetImg: targetImg)
 */
//===================================================================================================
function getMergeImg(sourceImg, targetImg) {

  var tempSrcCanvas = document.createElement('canvas');
  var srcCtx = tempSrcCanvas.getContext('2d');
  tempSrcCanvas.width = sourceImg.width;
  tempSrcCanvas.height = sourceImg.height;
  srcCtx.drawImage(sourceImg,0,0);

  var tempTarCanvas = document.createElement('canvas');
  var tarCtx = tempTarCanvas.getContext('2d');
  tempTarCanvas.width = targetImg.width;
  tempTarCanvas.height = targetImg.height;
  tarCtx.drawImage(targetImg,0,0);

  var imgSrcPixels = srcCtx.getImageData(0, 0, tempSrcCanvas.width, tempSrcCanvas.height);
  var imgTarPixels = tarCtx.getImageData(0, 0, tempTarCanvas.width, tempTarCanvas.height);

  for(var y = 0 ; y < imgTarPixels.height ; y++) {
    for(var x = 0 ; x < imgTarPixels.width ; x++) {
      var i = (y * 4) * imgTarPixels.width + x * 4;
      //不是黑色的才合併
      if(imgTarPixels.data[i] != 0) {
        imgSrcPixels.data[i] = imgTarPixels.data[i];
        imgSrcPixels.data[i + 1] = imgTarPixels.data[i + 1];
        imgSrcPixels.data[i + 2] = imgTarPixels.data[i + 2];
      }
    }
  }

  tempSrcCanvas.putImageData(imgSrcPixels, 0, 0);
  return tempSrcCanvas.toDataURL();
}
//===================================================================================================
/**
 * 手動臉部變形DIY
 * deformFaceDIY(chooseObj: chooseObj, source: sourceImg, ratio: 0 ~ 0.3, isThin: boolean)
 */
//===================================================================================================
function deformFaceDIY(startObj, stopObj, source) {
  var tempCanvas = document.createElement('canvas');
  var ctx = tempCanvas.getContext('2d');
  var retObj = drawView( tempCanvas, ctx,$('#bsHeadBar').height() + $('#bsFootBar').height(),
    source, source.width, source.height, null, null, null, null, true);
  //console.log(tempCanvas);
  //console.log("startObj=",startObj,"stopObj=",stopObj);
  var imgDstData = ctx.getImageData(startObj.xx, startObj.yy, startObj.w, startObj.h);
  //console.log(imgDstData);
  imgDstData = deformImg2(imgDstData, startObj, stopObj);
  //console.log(imgDstData);
  ctx.putImageData(imgDstData, startObj.xx, startObj.yy);
  var dataURL = tempCanvas.toDataURL();
  //delete tempCanvas;
  return dataURL;
}
//===================================================================================================
