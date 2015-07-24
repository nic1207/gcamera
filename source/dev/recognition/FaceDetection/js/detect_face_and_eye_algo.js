var sources = {
  Face: 'img/Pink.png',
  Eye1: 'img/blue.png',
  Eye2: 'img/blue.png',
  Mouth:'img/red.png'
};  
var FaceWidth = 0;
var FaceHeight = 0; 
var FacePosX = 0;
var FacePosY = 0;
var EyeWidth = new Array(2);
var EyeHeight = new Array(2);
var EyePosX = new Array(2);
var EyePosY = new Array(2);
var IsEyeLeft = false; 
var IsEyeRight = false;
var MouthWidth = 0;
var MouthHeight = 0;
var MouthPosX = 0;
var MouthPosY = 0;
//---------------------------------------------------------------
function load_face_eyes_mouth_tag(stage,layer) {
  
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  for(var src in sources) {
    numImages++;
  }
  
  for(var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {
      if(++loadedImages >= numImages) {
        show_face_eyes_mouth(images,stage,layer);
      }
    };
    images[src].src = sources[src];
  }
}
//--------------------------------------------------------------- 
function show_face_eyes_mouth(images,stage,layer) {
  
  var FaceGroup = new Kinetic.Group({
    x: FacePosX,
    y: FacePosY,
    draggable: true
  });
  
     
  var Eye1Group = new Kinetic.Group({
    x: EyePosX[0],
    y: EyePosY[0],
    draggable: true
  });
        
  var Eye2Group = new Kinetic.Group({
    x: EyePosX[1],
    y: EyePosY[1],
    draggable: true
  });
  
  var MouthGroup = new Kinetic.Group({
    x: MouthPosX,
    y: MouthPosY,
    draggable: true
  });

   /*
    * go ahead and add the groups
    * to the layer and the layer to the
    * stage so that the groups have knowledge
    * of its layer and stage
    */
        
  layer.add(FaceGroup);
  layer.add(Eye1Group);
  layer.add(Eye2Group); 
  layer.add(MouthGroup);    
  stage.add(layer);
        
  var FaceImg = new Kinetic.Image({
    x: 0,
    y: 0,
    image: images.Face,
    width: FaceWidth,
    height: FaceHeight,
    name: 'image'
  });

  FaceGroup.add(FaceImg);
  addAnchor(FaceGroup, 0, 0, 'topLeft');
  addAnchor(FaceGroup, FaceWidth, 0, 'topRight');
  addAnchor(FaceGroup, FaceWidth, FaceHeight, 'bottomRight');
  addAnchor(FaceGroup, 0, FaceHeight, 'bottomLeft');
   
   
  var Eye1Img = new Kinetic.Image({
    x: 0,
    y: 0,
    image: images.Eye1,
    width: EyeWidth[0],
    height:EyeHeight[0],
    name: 'image'
  });

  Eye1Group.add(Eye1Img);
  addAnchor(Eye1Group, 0, 0, 'topLeft');
  addAnchor(Eye1Group, EyeWidth[0], 0, 'topRight');
  addAnchor(Eye1Group, EyeWidth[0], EyeHeight[0], 'bottomRight');
  addAnchor(Eye1Group, 0, EyeHeight[0], 'bottomLeft');

  Eye1Group.on('dragstart', function() {
    this.moveToTop();
  });
        
  var Eye2Img = new Kinetic.Image({
    x: 0,
    y: 0,
    image: images.Eye2,
    width: EyeWidth[1],
    height: EyeHeight[1],
    name: 'image'
  });

  Eye2Group.add(Eye2Img);
  addAnchor(Eye2Group, 0, 0, 'topLeft');
  addAnchor(Eye2Group, EyeWidth[1], 0, 'topRight');
  addAnchor(Eye2Group, EyeWidth[1], EyeHeight[1], 'bottomRight');
  addAnchor(Eye2Group, 0, EyeHeight[1], 'bottomLeft');

  Eye2Group.on('dragstart', function() {
    this.moveToTop();
  });
  
  var MouthImg = new Kinetic.Image({
    x: 0,
    y: 0,
    image: images.Mouth,
    width: MouthWidth,
    height: MouthHeight,
    name: 'image'
  });

  MouthGroup.add(MouthImg);
  addAnchor(MouthGroup, 0, 0, 'topLeft');
  addAnchor(MouthGroup, MouthWidth, 0, 'topRight');
  addAnchor(MouthGroup, MouthWidth, MouthHeight, 'bottomRight');
  addAnchor(MouthGroup, 0, MouthHeight, 'bottomLeft');

  MouthGroup.on('dragstart', function() {
    this.moveToTop();
  });
      
  stage.draw();  
  
  /*
  console.log('Eye1Width :' + EyeWidth[0]);
  console.log('Eye1Height :' + EyeHeight[0]);
  console.log('Eye1PosX :' + EyePosX[0]);
  console.log('Eye1PosY :' + EyePosY[0]);
  console.log('Eye2Width :' + EyeWidth[1]);
  console.log('Eye2Height :' + EyeHeight[1]);
  console.log('Eye2PosX :' + EyePosX[1]);
  console.log('Eye2PosY :' + EyePosY[1]);
  console.log('MouthWidth :' + MouthWidth);
  console.log('MouthHeight :' + MouthHeight);
  console.log('MouthPosX :' + MouthPosX);
  console.log('MouthPosY :' + MouthPosY);
  */
}
//---------------------------------------------------------------     
function detect_face(id) {
  
  //var start = new Date().getTime();

  $(id).objectdetect("all", {classifier: objectdetect.frontalface}, function(faces){
    if(faces.length == 0){            
      console.log('臉部無法辨識,請重新拍照或自行設定調整臉部範圍');                
      //設定臉部
      FacePosX = 150;
      FacePosY = 150;
      FaceWidth = 150;
      FaceHeight = 150;         
    } else {
      //臉部辨識
      console.log('Face Num : ' + faces.length);
      FacePosX = faces[0][0];//($("#face").offset().left + faces[0][0]);
      FacePosY = faces[0][1];//($("#face").offset().top  + faces[0][1]);
      FaceWidth = faces[0][2];
      FaceHeight = faces[0][3];
    }
  });//face

  //var stop = new Date().getTime();

  //var executionTime = start - performance.timing.navigationStart;


  //console.log("myJavascriptFunction() executed in " + executionTime + "milliseconds");
  
     
}
//---------------------------------------------------------------
function detect_eyes(id) {
  
  IsEyeLeft = false;
  IsEyeRight = false;
  
  //var start = new Date().getTime();
  
  $(id).objectdetect("all", {classifier: objectdetect.eye}, function(eyes) {
                        
    if(eyes.length == 0)  {
      console.log('發現眼睛0個')
      auto_set_two_eyes();    
    } else  {
      //LOG
      console.log('Eyes Num : ' + eyes.length);                    
      //Eyes Detect
      if(eyes.length >= 2)  {                            
        var tempIndex = 0;
        var eyeindex = 0;
        for(var i = 0 ; i < eyes.length ; i++) {
          //過濾超過Training data的範圍                       
          if( eyes[i][0] > FacePosX + FaceWidth || eyes[i][0] < FacePosX ||
              eyes[i][1] > (FacePosY + FaceHeight / 2) || eyes[i][1] < FacePosY ||
              eyes[i][2] > FaceWidth/3 )  {                       
          } else  { 
            //不要選同一邊的眼睛
            if(eyes[i][0] > (FacePosX + FaceWidth / 2) && (!IsEyeLeft)) {
              IsEyeLeft = true; 
              //設定眼睛正確位置
              EyePosX[tempIndex] = eyes[i][0];//($("#face").offset().left + faces[0][0]);
              EyePosY[tempIndex] = eyes[i][1];//($("#face").offset().top  + faces[0][1]);
              EyeWidth[tempIndex] = eyes[i][2];
              EyeHeight[tempIndex] = eyes[i][3];
              tempIndex++;  
              eyeindex = i;       
            } else if(eyes[i][0] < (FacePosX + FaceWidth / 2) && (!IsEyeRight)) {
              IsEyeRight = true; 
              //設定眼睛正確位置
              EyePosX[tempIndex] = eyes[i][0];//($("#face").offset().left + faces[0][0]);
              EyePosY[tempIndex] = eyes[i][1];//($("#face").offset().top  + faces[0][1]);
              EyeWidth[tempIndex] = eyes[i][2];
              EyeHeight[tempIndex] = eyes[i][3];
              tempIndex++;  
              eyeindex = i;        
            } else  {   
            }
          }//else
        }//for
                            
        //過濾後還是無法找到兩隻眼睛
        if(tempIndex < 2) {
          if(tempIndex == 1) {
            auto_set_one_eye(eyeindex,eyes);    
          } else {                     
            auto_set_two_eyes();         
          } 
        }                                      
      } else if(eyes.length == 1) {
        if( eyes[0][0] > FacePosX + FaceWidth || eyes[0][0] < FacePosX ||
            eyes[0][1] > (FacePosY + FaceHeight / 2) || eyes[0][1] < FacePosY ||
            eyes[0][2] > FaceWidth/3 ){
                                
          console.log('偵測到1眼，但被過濾掉')
          //設定雙眼
          auto_set_two_eyes();    
        } else {
          //設定單眼
          auto_set_one_eye(0,eyes);   
        }
      }//eyes.length == 1
    }//eyes.length != 0
  });//eyes
  
  /*
  var stop = new Date().getTime();

  var executionTime = stop - start;

  console.log("myJavascriptFunction() executed in " + executionTime + "milliseconds");
  */
}
//---------------------------------------------------------------
function detect_mouth(id) {
  
  //var start = new Date().getTime();
  var mouthindex = 0;
  
  $(id).objectdetect("all", {classifier: objectdetect.mouth}, function(mouth){
    if(mouth.length == 0){            
      console.log('嘴巴無法辨識,請重新拍照或自行設定調整臉部範圍'); 
      auto_set_mouth();               
      //設定嘴巴
    } else {
      for(var i = 0 ; i < mouth.length ; i++) {
        //過濾超過Training data的範圍                       
        if( mouth[i][0] + mouth[i][2] > FacePosX + FaceWidth || mouth[i][0] < FacePosX ||
            mouth[i][1] < (FacePosY + FaceHeight / 2) || mouth[i][1] > FacePosY + FaceHeight ||
            mouth[i][2] > FaceWidth/2 )  {

             
        } else {
          mouthindex++;
          //嘴巴辨識
          console.log('Mouth Num : ' + mouth.length);
          MouthPosX = mouth[i][0];//($("#face").offset().left + faces[0][0]);
          MouthPosY = mouth[i][1];//($("#face").offset().top  + faces[0][1]);
          MouthWidth = mouth[i][2];
          MouthHeight = mouth[i][3];
        }
        
        if(mouthindex == 0){
          auto_set_mouth();   
        }
        
      }//for
    }//else
  });//mouth
  
  /*
  var stop = new Date().getTime();

  var executionTime = stop - start;

  console.log("myJavascriptFunction() executed in " + executionTime + "milliseconds");
  */
     
}
//---------------------------------------------------------------
//Auto set two eyes position
function auto_set_two_eyes() {  
  
  //Eye's Size
  EyeWidth[0]  = FaceWidth / 6;
  EyeHeight[0] = FaceHeight / 6;
  EyeWidth[1]  = FaceWidth / 6;
  EyeHeight[1] = FaceHeight / 6;
        
  //Eye's XY Position                
  EyePosX[0] = FacePosX + FaceWidth / 4;
  EyePosY[0] = FacePosY + FaceHeight / 3.3;   
  EyePosX[1] = FacePosX + FaceWidth - (FaceWidth / 4) - EyeWidth[1];
  EyePosY[1] = FacePosY + FaceHeight / 3.3;      
  
}
//---------------------------------------------------------------
//Auto set one eye position
function auto_set_one_eye(eyeindex,eyes) {    
  
  //Set eye correct position
  EyePosX[0]   = eyes[eyeindex][0];//($("#face").offset().left + faces[0][0]);
  EyePosY[0]   = eyes[eyeindex][1];//($("#face").offset().top  + faces[0][1]);
  EyeWidth[0]  = eyes[eyeindex][2];
  EyeHeight[0] = eyes[eyeindex][3];   
        
  var MiddlePoint = (FacePosX + FaceWidth / 2);                       
  //Adjust eye X's position 
  if(EyePosX[0] >= MiddlePoint) {
    EyePosX[1] = MiddlePoint - EyeWidth[0] - (EyePosX[0] - MiddlePoint);    
  } else  {
    EyePosX[1] = MiddlePoint + MiddlePoint - (EyePosX[0] + EyeWidth[0]); 
  }
                            
  EyePosY[1]   = EyePosY[0];
  EyeWidth[1]  = EyeWidth[0];
  EyeHeight[1] = EyeHeight[0];  
        
}
//---------------------------------------------------------------
function auto_set_mouth() {    
  
  //Set Mouth correct position
  MouthPosX   = FacePosX + FaceWidth / 3;
  MouthPosY   = FacePosY + FaceHeight * 4/6 ;//($("#face").offset().top  + faces[0][1]);
  MouthWidth  = FaceWidth / 3;
  MouthHeight = FaceHeight / 6;           
}
//---------------------------------------------------------------