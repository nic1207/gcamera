// Processor to detect blinks based on an approach by Burke et al,
// Medical and Biological Engineering and Computing, Volume 39, Number 3 / May, 2001
// HTML 5 implementation inspired by Paul Rouget's motion tracker work

var processor = {
  worker: null,
  video: null,
  faceCanvas: null,
  faceCtx: null,
  lastFrame: null,
  videoX:null,
  videoY:null,
  videoWidth: null,
  videoHeight: null,
  leftEye: null,
  rightEye: null,
  kEyeBoxDisarmTime: 1000,
  tolerance: 15,
  headRefX:0,
  headRefY:0,
  recalibrationTolerance: 10,
  eyeDiffTolerance: 25,
  isBlink: false,
  tmpCanvas:null,
  tmpWidth:null,
  tmpheight:null,
  cstartX:null,
  cstartY:null,

  timerCallback: function() {    
    if(openStream)
      return;

    if (this.video.q) {
      console.log('Paused');
    }
  
    this.processFrame();

    var self = this;
    setTimeout(function () {
      self.timerCallback();
    }, 67);

  },

  onLoad: function() {
    tmpCanvas= document.createElement('canvas');
    this.video = document.querySelector('video');
    this.faceCanvas = document.getElementById("camView");
    this.faceCtx = this.faceCanvas.getContext("2d");
    this.videoX = 0;
    this.videoY = 0;
    this.videoWidth = 1;//this.video.videoWidth / this.widthScale;
    this.videoHeight = 1;//this.video.videoHeight / this.heightScale;
    this.worker = new Worker("js/find_eyes.js");

    var self = this;
    this.worker.onmessage = function(event) {
      if (event.data[0] == 0) {        
        self.foundEyes(event.data.slice(1));
      }
    };    
    
    if(autoCam){
      console.log("video play");
      self.count = 0;
      self.timerCallback();      
    }
  },

  setWidth: function(value) {
    this.videoWidth = value;
  },

  setHeight: function(value) {    
    this.videoHeight = value;    
  },

  setX: function(value) {    
    this.videoX = value;    
  },

  setY: function(value) {    
    this.videoY = value;    
  },

  setTolerance: function(value) {
    this.tolerance = value;
  },

  setIsBLink: function(value) {
    this.isBlink = value;
  },

  setSizeAndLocation: function(value) {
    var recalibrate = false;

    var difX = Math.abs(value.x - this.headRefX);
    if ( difX > this.recalibrationTolerance ) recalibrate = true;

    var difY = Math.abs(value.y - this.headRefY);
    if ( difY > this.recalibrationTolerance ) recalibrate = true;      
    
    // head has moved far enough to reset
    this.cstartX=parseInt(value.cstartX);
    this.cstartY=parseInt(value.cstartY);

    if (recalibrate === true) {
      if (value.width < 90) value.width = 100;
      this.setWidth( (value.width > 110 ) ? value.width * .9 : value.width );
      
      if (value.height < 90) value.height = 100;
      this.setHeight( (value.height > 110 ) ? value.height * .9*0.7 : value.height*0.7);
      
      this.setX( value.x );
      this.setY( value.y );

      // reset the base references
      this.headRefX = value.x;
      this.headRefY = value.y;
    }    
  },  

  diffFrame: function(frame1, frame2) {
    var newFrame = new Array(this.tmpHeight*this.tmpWidth);
    for (var i = 0; i < newFrame.length; i++) {
      newFrame[i] = ( Math.abs(frame1[i * 4] - frame2[i * 4]) +
                      Math.abs(frame1[i * 4 + 1] - frame2[i * 4 + 1]) +
                      Math.abs(frame1[i * 4 + 2] - frame2[i * 4 + 2])) / 3;

      // Threshold and invert
      if (newFrame[i] > this.tolerance) {
        newFrame[i] = 0;
      } else {
        newFrame[i] = 255;
      }
    }
    return newFrame;
  },

  processFrame: function() {
    
    this.videoWidth = parseInt(this.videoWidth);
    this.videoHeight = parseInt(this.videoHeight);
    this.faceCtx.strokeStyle = "rgba(34, 170, 221,0.6)";
    this.faceCtx.lineWidth = 2;

    var nowWidthLimitMax = this.videoX - (this.videoWidth/2) + this.cstartX + this.videoWidth;
    var totalWidthLimitMax = this.cstartX + canvasElement.height;
    var tempWidthMax = nowWidthLimitMax - totalWidthLimitMax - 20;

    var nowWidthLimitMin = this.videoX - (this.videoWidth/2) + this.cstartX;
    var tempWidthMin = this.videoWidth - (this.cstartX - nowWidthLimitMin);

    var nowHeightLimitMax = this.videoY - (this.videoHeight/0.7/2) + this.cstartY + this.videoHeight;
    var totalHeightLimitMax = this.cstartY + canvasElement.width;
    var tempHeightMax = nowHeightLimitMax - totalHeightLimitMax - 20;
      
    var nowHeightLimitMin = this.videoY - (this.videoHeight/0.7/2) + this.cstartY;
    var tempHeightMin = this.videoHeight - (this.cstartY - nowHeightLimitMin);

    this.tmpWidth=Math.round(this.videoWidth);
    this.tmpHeight=Math.round(this.videoHeight);
    tmpCanvas.width=this.tmpWidth;
    tmpCanvas.height=this.tmpHeight;
    
    if(nowWidthLimitMax > totalWidthLimitMax) {
      this.faceCtx.strokeRect(nowWidthLimitMin, nowHeightLimitMin, tempWidthMax, this.videoHeight);
      tmpCanvas.getContext("2d").drawImage(
        this.faceCanvas, nowWidthLimitMin, nowHeightLimitMin, tempWidthMax, this.videoHeight, 0, 0, this.tmpWidth, this.tmpHeight
      );
    }
    else if(nowWidthLimitMin < this.cstartX) {
      this.faceCtx.strokeRect(this.cstartX + 20, nowHeightLimitMin, tempWidthMin, this.videoHeight);
      tmpCanvas.getContext("2d").drawImage(
        this.faceCanvas, this.cstartX + 20, nowHeightLimitMin, tempWidthMin, this.videoHeight, 0, 0, this.tmpWidth, this.tmpHeight
      );
    }
    else if(nowHeightLimitMax > totalHeightLimitMax) {
      this.faceCtx.strokeRect(nowWidthLimitMin, nowHeightLimitMin, this.videoWidth, tempHeightMax);
      tmpCanvas.getContext("2d").drawImage(
        this.faceCanvas, nowWidthLimitMin, nowHeightLimitMin, this.videoWidth, tempHeightMax, 0, 0, this.tmpWidth, this.tmpHeight
      );
    }
    else if(nowHeightLimitMin < this.cstartY) {
      this.faceCtx.strokeRect(nowWidthLimitMin, this.cstartY + 20, this.videoWidth, tempHeightMin);
      tmpCanvas.getContext("2d").drawImage(
        this.faceCanvas, nowWidthLimitMin, this.cstartY + 20, this.videoWidth, tempHeightMin, 0, 0, this.tmpWidth, this.tmpHeight
      );
    } 
    else
    {
      this.faceCtx.strokeRect(nowWidthLimitMin, nowHeightLimitMin, this.videoWidth, this.videoHeight);
      tmpCanvas.getContext("2d").drawImage(
        this.faceCanvas, nowWidthLimitMin, nowHeightLimitMin, this.videoWidth, this.videoHeight, 0, 0, this.tmpWidth, this.tmpHeight
      );
    }

    var imgData = tmpCanvas.getContext("2d").getImageData(0, 0, this.tmpWidth, this.tmpHeight);
    var currentFrame = imgData.data;
    
    if (this.lastFrame == null) {
      this.lastFrame = currentFrame;
      return;
    }
  
    // Get the difference frame
    var diffFrame = this.diffFrame(currentFrame, this.lastFrame);
    
    //to skip frame if the blob are many or none  
    var count=0;
     for(var x = 0; x <  this.tmpWidth; x++){
        for(var y = 0; y < (this.tmpHeight); y++){
            if  (diffFrame[ (y * this.tmpWidth) + x ] ==0) count++;
        }
    }
    
    //updata lastframe
    this.lastFrame = currentFrame;
  
    // Locate eyes in worker thread
    var args = {
      frame: diffFrame,
      height: this.tmpHeight,
      width: this.tmpWidth,      
    }
    if (count>50 && count<2000)  this.worker.postMessage(args);
  },

  foundEyes: function(result) {
    if (this.leftEye != null) return;

    // Store found eye geometry
    this.leftEye = {};
    this.rightEye = {};
    this.blink = {};
    this.blink.falsePositive = false;
    isBlink = false;
    console.log("foundEyes!");
    //console.log( result );
    // [this.leftEye.x1, this.leftEye.y1, this.leftEye.x2, this.leftEye.y2, this.rightEye.x1, this.rightEye.y1, this.rightEye.x2, this.rightEye.y2] = result;
    //////////////////
    this.leftEye.x1 = result[0];
    this.leftEye.y1 = result[1];
    this.leftEye.x2 = result[2];
    this.leftEye.y2 = result[3];
    this.rightEye.x1 = result[4];
    this.rightEye.y1 = result[5];
    this.rightEye.x2 = result[6];
    this.rightEye.y2 = result[7];

    // compare box sizes to try to rule out some false positives when the 
    var lW = (this.leftEye.x2 - this.leftEye.x1);
    var lH = (this.leftEye.y2 - this.leftEye.y1);
    var rW = (this.rightEye.x2 - this.rightEye.x1);
    var rH = (this.rightEye.y2 - this.rightEye.y1);

    this.blink.falsePositive = Math.abs( rW - lW ) > this.eyeDiffTolerance || Math.abs( rH - lH ) > this.eyeDiffTolerance;

    console.log("blink sizes: " + Math.abs( rW - lW ), Math.abs( rH - lH ), this.eyeDiffTolerance);
    if (this.blink.falsePositive){
      console.log("false Positive!!!!!!!!!: " + Math.abs( rW - lW ), Math.abs( rH - lH ), this.eyeDiffTolerance);
    }
    else{
      this.blink = true;
      console.log("valid blink detected");
      //alert("眨眼了!!!");
      this.worker.terminate(); 
      blinkCamera();
    }
    console.log("----------------");
    
    // Disarm
    var self = this;
    setTimeout(function () {
      self.leftEye = null;
      self.rightEye = null;
      //self.label.innerHTML = "";
    }, self.kEyeBoxDisarmTime);
  }
}; 