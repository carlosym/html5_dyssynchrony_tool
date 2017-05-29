//******** [Constructor] ******************
function CineViewer(idViewer,element,idImage,file){
    
    //attributes of the class
    this.idViewer = idViewer;
    this.element = element;
    this.idImage = idImage;
    this.file = file;
  
    cornerstone.enable(this.element);
    cornerstoneTools.mouseInput.enable(this.element);
    cornerstoneTools.mouseWheelInput.enable(this.element);
    
}

//******** [Get methods] ******************
CineViewer.prototype.getViewerName = function() {
  return this.idViewer;
};

CineViewer.prototype.getElement = function() {
  return this.element;
};

CineViewer.prototype.getIdImage = function() {
  return this.idImage;
};

CineViewer.prototype.getFile = function() {
  return this.file;
};


//******** [Set methods] ******************
CineViewer.prototype.setViewerName = function(idViewer) {
  this.idViewer = idViewer;
};

//******** [Utility methods] ****************
CineViewer.prototype.loadImage = function(arrayBuffer,sliceId,callback) {
  // Obtain number of frames
                var viewerName = this.idViewer;
                var viewerElement = this.element;
                var viewerIdImage = this.idImage;
                    var byteArray = new Uint8Array(arrayBuffer);
                    var dataSet = dicomParser.parseDicom(byteArray);
                    var options = {
                        omitPrivateAttibutes :false ,
                        maxElementLength: 128
                    };
                    var instance = dicomParser.explicitDataSetToJS(dataSet, options);
                    var numberOfFrames = instance.x00280008;
                    var imageIds = [];
                    for (i=0;i < numberOfFrames;i++) {
                        imageIds.push(viewerIdImage+'?frame='+i);
                    }
                    
                    var stack = {
                    currentImageIdIndex : 0,
                    imageIds: imageIds
                };
                    
                    // Initialize range input
                var range, max, slice, currentValueSpan;
                range = document.getElementById(sliceId);
        
                // Set minimum and maximum value
                range.min = 0;
                range.step = 1;
                range.max = imageIds.length - 1;
                
                // Set current value
                range.value = stack.currentImageIdIndex;
                
                function onNewImage(e, data) {
                    var newImageIdIndex = stack.currentImageIdIndex;

                    // Update the slider value
                    var slider = document.getElementById(sliceId);
                    slider.value = newImageIdIndex;

                    // if we are currently playing a clip then update the FPS
                    var playClipToolData = cornerstoneTools.getToolState(viewerElement, 'playClip');
        
                }
                $(viewerElement).on("CornerstoneNewImage", onNewImage);
                
                function selectImage(event){
                    var targetElement = document.getElementById(viewerName);

                    // Get the range input value
                    var newImageIdIndex = parseInt(event.currentTarget.value, 10);

                    // Get the stack data
                    var stackToolDataSource = cornerstoneTools.getToolState(targetElement, 'stack');
                    if (stackToolDataSource === undefined) {
                        return;
                    }
                    var stackData = stackToolDataSource.data[0];
                    //console.log(stackData);

                    // Switch images, if necessary
                    if(newImageIdIndex !== stackData.currentImageIdIndex && stackData.imageIds[newImageIdIndex] !== undefined) {
                        cornerstone.loadAndCacheImage(stackData.imageIds[newImageIdIndex]).then(function(image) {
                            var viewport = cornerstone.getViewport(targetElement);
                            stackData.currentImageIdIndex = newImageIdIndex;
                            cornerstone.displayImage(targetElement, image, viewport);
                        });
                    }
                }
                
                // Bind the range slider events
                $("#"+sliceId).on("input", selectImage);
                cornerstone.loadAndCacheImage(imageIds[0]).then(function(image) {
                    // Display the image
                    cornerstone.displayImage(viewerElement, image);

                    // Set the stack as tool state
                    cornerstoneTools.addStackStateManager(viewerElement, ['stack', 'playClip']);
                    cornerstoneTools.addToolState(viewerElement, 'stack', stack);

                    // Enable all tools we want to use with this element
                    cornerstoneTools.stackScroll.activate(viewerElement, 1);
                    cornerstoneTools.stackScrollWheel.activate(viewerElement);

                    cornerstoneTools.scrollIndicator.enable(viewerElement);
                    
                    callback(viewerElement);

                });
                
                
            
            
};


