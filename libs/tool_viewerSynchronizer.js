//******** [Constructor] ******************
function ViewerSynchronizer() {

    //attributes of the class
    this.viewers = [];
}

//******** [Get methods] ******************
ViewerSynchronizer.prototype.getViewers = function () {
    return this.viewers;
};

//******** [Set methods] ******************
ViewerSynchronizer.prototype.addViewer = function (viewer) {
    this.viewers.push(viewer);
};

//******** [Utility methods] ****************

ViewerSynchronizer.prototype.synchronize = function (currentElement,activeLines,activeLinesId) {
    var xTarget;
    for (var i = 0; i < activeLines.length;i++){
        if (activeLines[i].associatedElement == currentElement) {
            xTarget = activeLines[i].x;
        }
    }
    for (var i = 0; i < activeLines.length;i++){
        activeLines[i].x = xTarget;
    }
    cornerstoneTools.customFreehand.setLines(activeLines,activeLinesId);
    for (var i = 0; i < this.viewers.length; i++) {
        var synchronizingElement = this.viewers[i].getElement();
        if (synchronizingElement != currentElement) {
            cornerstoneTools.customFreehand.updatePlugin(synchronizingElement);
        }
    }

};

//********** [Other methods] ***************
ViewerSynchronizer.prototype.printViewers = function () {
    console.log(this.viewers);
};

