//******** [Constructor] ******************
function Viewer(idViewer,element,idImage){
    
    //attributes of the class
    this.idViewer = idViewer;
    this.element = element;
    this.idImage = idImage;
  
    cornerstone.enable(this.element);
    
}

//******** [Get methods] ******************
Viewer.prototype.getViewerName = function() {
  return this.idViewer;
};

Viewer.prototype.getElement = function() {
  return this.element;
};

Viewer.prototype.getIdImage = function() {
  return this.idImage;
};


//******** [Set methods] ******************
Viewer.prototype.setViewerName = function(idViewer) {
  this.idViewer = idViewer;
};

//******** [Utility methods] ****************

Viewer.prototype.loadImage = function(callback) {
  

  var element=this.element;
  
  cornerstone.loadImage(this.idImage).then(function(image) {
       
       cornerstone.displayImage(element, image);
       cornerstoneTools.mouseInput.enable(element);
       
       callback(element);
       
  });
  
};

//********** [Other methods] ***************
Viewer.prototype.printViewerName = function() {
  console.log(this.idViewer);
};


