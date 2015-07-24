function search(frame, width, height,frameTime) {
  var kNoBlobsError = -1;
  var kTooManyBlobsError = -2;
  var kWrongGeometryError = -3;
  var kMaxBlobsToFind = 30;
  var kBlobsSearchBorder = 10;
  var kMinBlobsFound = 2;
  var kMaxBlobsFound = 7;
  var kMinEyeXSep = width/4;
  var kMaxEyeXSep = width*0.7;
  var kMaxEyeYSep = 20;
  var parent= {}; //for blob analysis
  
  //======================Blob analysis=================================================================
  /**
  *Blob analysis using Two-pass method
  *usage:
  *   binary: binary image 
  *   label: labeling image and return this image
  *   width: input image width
  *   height:input image height
  */
  function myConnectedComponentLabelingTwoPass(binary, label,width,height){
   // initialize label value  
    var label_value = 0;  
    var input=binary;
    var output=label;
    parent[0]=0;
    for(var j = 0; j < 2000; j ++)
      parent[j]=0;
    
  // first pass    in[y * width + x]
    for(var y = 1; y < height; y++){  
      for(var x = 1;  x < width; x++){  
        if(0 == input[y * width + x]){  
          if(255 == input[y * width + x-1] && 255 == input[ (y-1) * width + x]){  
            label_value += 1;  
            output[y * width + x] = label_value;  
          }  
          else if(0 == input[y * width + x-1] && 255 == input[(y-1) * width + x])  
            output[y * width + x]  = output[y * width + x-1] ;  
          else if(255 == input[y * width + x-1] && 0 == input[(y-1) * width + x])  
            output[y * width + x]  = output[(y-1) * width + x] ;   
          else if(0 == input[y * width + x-1] && 0 == input[(y-1) * width + x]){  
            output[y * width + x]  = output[y * width + x-1] ;  
            union_label(output[y * width + x-1], output[(y-1) * width + x], parent);  
          }
        }  
      }  
    }  
  
    // second pass   
    for(var y = 1; y < height; y++){  
      for(var x = 1;  x < width; x++){  
        if(output[y * width + x] > 0){  
          output[y * width + x] = find(output[y * width + x], parent);  
        }  
      }  
    }
   
    return   output;
  }
   //============================================================ 
  function union_label(x, y, parent){  
    var i = x;  
    var j = y;    
    while(0 != parent[i])
      i = parent[i];  
    while(0 != parent[j])  
      j = parent[j];  
    if(i != j)   parent[i] = j;  
} 
//===================================================================================================
  function find( x, parent){  
    var i = x;  
    while(0 != parent[i])  
      i = parent[i];  
    return i;  
  }  
 
//===================================================================================================  
  //console.log('findeye');
  var blobs = new Array();
  var label = new Uint8ClampedArray(width*height);
  var max=0; 
  
  //Using Blob analysis
  label = myConnectedComponentLabelingTwoPass(frame, label, width, height);
  
  //Find the maxium labeling number
  for (var i = 0 ; i < (width*height) ; i ++){
    if (label[i]>max)
      max=label[i];        
  }   

  //initial blob_area and find geometry information
  var blob_area = new Array(max+1);
  var area={ xmin: width, ymin: height, xmax: 0, ymax: 0 };
  for (var i = 0 ; i <=max ; i ++){
    blob_area[i]={ xmin: width, ymin: height, xmax: 0, ymax: 0,weight:0};    
  }
      
  for(var x = 0; x < width; x++){
    for(var y = 0; y < height; y++){
      if  (label[ (y * width) + x ]>0){              
        blob_area[label[ (y * width) + x ]].xmin=Math.min(x, blob_area[label[ (y * width) + x ]].xmin);
        blob_area[label[ (y * width) + x ]].ymin=Math.min(y, blob_area[label[ (y * width) + x ]].ymin);
        blob_area[label[ (y * width) + x ]].xmax=Math.max(x, blob_area[label[ (y * width) + x ]].xmax);
        blob_area[label[ (y * width) + x ]].ymax=Math.max(y, blob_area[label[ (y * width) + x ]].ymax);
        blob_area[label[ (y * width) + x ]].weight++;
      } 
    }
  }
    
  //selecting suitable area 
  var x_size,y_size;
  for (var i = 1 ; i <=max ; i ++){
    x_size=blob_area[i].xmax - blob_area[i].xmin;
    y_size=blob_area[i].ymax - blob_area[i].ymin;
    if( x_size>10 &&   y_size>4&& ((y_size*2) < x_size) && ( (blob_area[i].weight/(y_size *x_size) ) >0.4) )
      blobs.push(blob_area[i]);
  }
  
  // Sort blobs
  if (blobs.length < kMinBlobsFound) {
    console.log("No blobs");
    return [kNoBlobsError, "No blobs"];
  } else if (blobs.length > kMaxBlobsFound) {
    console.log("Too many blobs:"+blobs.length);
    return [kTooManyBlobsError, "Too many blobs"];
  }
  
  blobs.sort(function(a, b) { (b.xmax - b.xmin) * (b.ymax - b.ymin) - (a.xmax - a.xmin) * (a.ymax - a.ymin) });

  // Check dimensions
  xSep = Math.abs((blobs[0].xmax + blobs[0].xmin) - (blobs[1].xmax + blobs[1].xmin)) / 2;  
  ySep = Math.abs((blobs[0].ymax + blobs[0].ymin) - (blobs[1].ymax + blobs[1].ymin)) / 2;

 // Find which eye is which
  if (blobs[0].xmax < blobs[1].xmax) {
    l = 0;
    r = 1;
  } else {
    l = 1;
    r = 0;
  }

 // Check geometry information 
  if ((blobs[r].xmin-blobs[l].xmax)<8){
    console.log("Geometry off size1");
    return [kWrongGeometryError, "Geometry off, xSep:" + xSep + ", ySep:" + ySep];  
  }    

  if (blobs[r].ymin< (height*0.1) ||blobs[l].ymin<(height*0.1) || blobs[r].ymax> (height*0.7) ||blobs[l].ymax>(height*0.7) ){
    console.log("Geometry off size2");
    return [kWrongGeometryError, "Geometry off, xSep:" + xSep + ", ySep:" + ySep];  
  }
      
  if (xSep < kMinEyeXSep || xSep > kMaxEyeXSep || ySep > kMaxEyeYSep ||  ySep> xSep  ) {
    console.log("Geometry off, xSep:" + xSep + ", ySep:" + ySep);
    return [kWrongGeometryError, "Geometry off, xSep:" + xSep + ", ySep:" + ySep];
  }
  
  // Expand bounding boxes
  dx = 3;
  dy = 3;
  return [0, blobs[l].xmin - dx, blobs[l].ymin - dy, blobs[l].xmax + dx, blobs[l].ymax + dy, blobs[r].xmin - dx, blobs[r].ymin - dy, blobs[r].xmax + dx, blobs[r].ymax + dy];
}

onmessage = function(event) {
  var data = event.data;
  if (data.frame == null) { postMessage([-100]); }
  var res = search(data.frame,
                            data.width,
                            data.height);
  postMessage(res);
}