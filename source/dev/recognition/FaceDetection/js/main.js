var stage = new Kinetic.Stage({
  container: 'container',
  width:  1024,
  height: 768
});
   
var layer = new Kinetic.Layer();

var targets = {
  target: 'img/forest.jpg'
}
     
var TargetImgWidth = 0, TargetImgHeight = 0;
    
//Load Image 
loadimage(targets,stage,layer);

$(function() {
  $('#try').click(function() {
            
    var $this = $(this);
    $this.text('Detecting......');
    detect_face('#face'); 
    detect_eyes('#face');
    detect_mouth('#face');
    load_face_eyes_mouth_tag(stage,layer);
    $this.text('Done!!');
  });
  return false;
});
