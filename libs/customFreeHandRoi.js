(function($, cornerstone, cornerstoneMath, cornerstoneTools) {

    'use strict';

    var toolType = 'customFreehand';
    
    // @CYM --> Points will store an array of the different lines in the view 
    var lines = {};
    var activeLinesId = false;
    var storedLinesId = [];
    var currentViewerSynchronizer;
    
    function mouseLineMoveCallback(e, eventData) {
        
                
        if (activeLinesId) {
            for (var i=0;i < lines[activeLinesId].length;i++) {
                if (eventData.element == lines[activeLinesId][i].associatedElement) {
                    // Set the mouseLocation handle
                    var x = Math.max(eventData.currentPoints.image.x, 0);
                    x = Math.min(x, eventData.image.width);
                    lines[activeLinesId][i].x = x;
                }
            }
            currentViewerSynchronizer.synchronize(eventData.element,lines[activeLinesId],activeLinesId)
        
        }
        
        // Force onImageRendered
        cornerstone.updateImage(eventData.element);
    }
    
    function mouseLineDownCallback(e, eventData) {
        
        if (activeLinesId) {
        if (cornerstoneTools.isMouseButtonEnabled(eventData.which, e.data.mouseButtonMask)) {
            var stopLines;
            
                for (var i=0;i < lines[activeLinesId].length;i++) {
                    if (eventData.element == lines[activeLinesId][i].associatedElement) {
                        lines[activeLinesId][i].x = eventData.currentPoints.image.x;
                        stopLines = true;
                    }
                }
            
            if (stopLines) {
                activeLinesId = false;
            }
            return false; // false = causes jquery to preventDefault() and stopPropagation() this event
        }
        currentViewerSynchronizer.synchronize(eventData.element,lines[activeLinesId],activeLinesId)
        }
        cornerstone.updateImage(eventData.element);
    }

    ///////// END ACTIVE TOOL ///////

    ///////// BEGIN IMAGE RENDERING ///////
    
    function onImageRenderedLine(e, eventData) {
        
        var allLines = [];
        for (var i = 0;i < storedLinesId.length;i++) {
            for (var j=0;j < lines[storedLinesId[i]].length;j++) {
                allLines.push(lines[storedLinesId[i]][j]);
            }
        }

        // we have tool data for this element - iterate over each one and draw it
        var context = eventData.canvasContext.canvas.getContext('2d');
        context.setTransform(1, 0, 0, 1, 0, 0);

        for (var i = 0; i < allLines.length; i++) {
            context.save();
            
            if (eventData.element == allLines[i].associatedElement) {
                var currentPosition = {x:allLines[i].x, y:0}
                var handleStartCanvas = cornerstone.pixelToCanvas(eventData.element, currentPosition);
                context.beginPath();
                context.strokeStyle = allLines[i].color;
                context.lineWidth = 1.2;//cornerstoneTools.toolStyle.getActiveWidth();
                context.moveTo(handleStartCanvas.x, 0);
                //context.lineTo(handleStartCanvas.x, eventData.image.rows);
                //alert(eventData.image.rows);
                //@CYM Te he echo un apaño cutre que funciona
                context.lineTo(handleStartCanvas.x, eventData.image.rows*2);
                context.stroke();
            }
        }
        context.restore();
        
        
    }
    ///////// END IMAGE RENDERING ///////

    /***************************************
     * This method return the points picked
     * return points picked
     * *************************************/
    
    // @CYM return all the available lines
    function getLines(){
        return lines;
    }
    
    function getViewerSynchronizer(){
        return currentViewerSynchronizer;
    }
    
    function setLines(modifiedLines,id){
        lines[id] = modifiedLines;
    }
    
    // @CYM add line to the lineList
    function addLine(element, mouseButtonMask, xs, ids, color, actualViewerSynchronizer, inactive){
        $(element).off('CornerstoneToolsMouseDown', eventData, mouseLineDownCallback);
        $(element).off('CornerstoneToolsMouseMove', mouseLineMoveCallback);
        $(element).off('CornerstoneImageRendered', onImageRenderedLine);
        //Add a line and set x

        //@CYM Comprobar que el id no este en nuestro array de lineas;

        removeLine(element,ids);
            
            var eventData = {
                mouseButtonMask: mouseButtonMask,
            };
            
            var line={
                x:xs,
                id:ids,
                color:color,
                associatedElement:element,
        }
        
        if (!lines[line.id]) {
            lines[line.id] = [];
        }
        lines[line.id].push(line);
        activeLinesId = line.id;
        
        var newLineId = true;
        for (var i=0;i < storedLinesId.length;i++) {
            if (storedLinesId[i] == line.id) {
                newLineId = false;
                break;
            }
        }
        if (newLineId) {
            storedLinesId.push(line.id);
        }
        
        currentViewerSynchronizer = actualViewerSynchronizer;
        
        if (inactive) {
            activeLinesId = false;
        }
                
        $(element).on('CornerstoneToolsMouseMove', mouseLineMoveCallback);
        $(element).on('CornerstoneToolsMouseDown', eventData, mouseLineDownCallback);
        $(element).on('CornerstoneImageRendered', onImageRenderedLine);
    }
    
    function updatePlugin(element){
        cornerstone.updateImage(element);
    }
    
    
    
    function removeLine(element,lineId){
        
        if (lines[lineId]) {
        for (var i=0;i < lines[lineId].length;i++){
            if (lines[lineId][i].associatedElement == element) {
                lines[lineId].splice(i,1);
            }
        }
        }
                
        
        cornerstone.updateImage(element);
    }
    
    // module/private exports
    cornerstoneTools.customFreehand = {
        getLines: getLines,
        setLines: setLines,
        addLine:addLine,
        removeLine:removeLine,
        updatePlugin:updatePlugin,
        getViewerSynchronizer:getViewerSynchronizer,
    };

})($, cornerstone, cornerstoneMath, cornerstoneTools);