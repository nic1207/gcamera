 /*
  * @author ericdrowell
  * @description dragImg
  */
//-------------------------------------------------------------
function update(activeAnchor) {
  
  var group = activeAnchor.getParent();
  var topLeft = group.get('.topLeft')[0];
  var topRight = group.get('.topRight')[0];
  var bottomRight = group.get('.bottomRight')[0];
  var bottomLeft = group.get('.bottomLeft')[0];
  var image = group.get('.image')[0];

  var anchorX = activeAnchor.getX();
  var anchorY = activeAnchor.getY();

  // update anchor positions
  switch (activeAnchor.getName()) {
    case 'topLeft': {
      topRight.setY(anchorY);
      bottomLeft.setX(anchorX);
      break;
    }
    case 'topRight': {
      topLeft.setY(anchorY);
      bottomRight.setX(anchorX);
      break;
    }
    case 'bottomRight': {
      bottomLeft.setY(anchorY);
      topRight.setX(anchorX); 
      break;
    }
    case 'bottomLeft': {
      bottomRight.setY(anchorY);
      topLeft.setX(anchorX); 
      break;
    }
  }

  image.setPosition(topLeft.getPosition());
  var width = topRight.getX() - topLeft.getX();
  var height = bottomLeft.getY() - topLeft.getY();
  if(width && height) {
    image.setSize(width, height);
  }
  
}
//-------------------------------------------------------------
function addAnchor(group, x, y, name) {
  
  //var stage = group.getStage();
  var layer = group.getLayer();

  var anchor = new Kinetic.Circle({
    x: x,
    y: y,
    stroke: '#666',
    fill: '#ddd',
    strokeWidth: 1,
    radius: 3,
    name: name,
    draggable: true,
    dragOnTop: false
  });

  anchor.on('dragmove', function() {
    update(this);
    layer.draw();
  });
        
  anchor.on('mousedown touchstart', function() {
    group.setDraggable(false);
    this.moveToTop();
  });
        
  anchor.on('dragend', function() {
    group.setDraggable(true);
    layer.draw();
  });
        
  // add hover styling
  anchor.on('mouseover', function() {
    var layer = this.getLayer();
    document.body.style.cursor = 'pointer';
    this.setStrokeWidth(4);
    layer.draw();
  });
        
  anchor.on('mouseout', function() {
    var layer = this.getLayer();
    document.body.style.cursor = 'default';
    this.setStrokeWidth(2);
    layer.draw();
  });

  group.add(anchor);
  
}
//-------------------------------------------------------------