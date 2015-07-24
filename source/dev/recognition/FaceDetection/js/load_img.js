function loadimage(targets,stage,layer) {
  var image = {};
  for(var src in targets) {
    image[src] = new Image();
    image[src].src = targets[src];
         
    image[src].onload = function() {  
    };
  }
        
  var TargetGroup = new Kinetic.Group({
    x: 0,
    y: 0,
  });
        
  layer.add(TargetGroup);
  stage.add(layer);
             
  var TargetImg = new Kinetic.Image({
    x: 0,
    y: 0,
    image: image.target,
    width: image.width,
    height: image.Height,
    name: 'image',
  });
       
  TargetGroup.add(TargetImg);
        
  //畫圖
  stage.draw();
}