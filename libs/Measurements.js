/*! cornerstoneTools - v0.7.5 - 2015-09-17 | (c) 2014 Chris Hafey | https://github.com/chafey/cornerstoneTools */
// Begin Source: src/header.js
if (typeof cornerstone === 'undefined') {
    cornerstone = {};
}

if (typeof cornerstoneTools === 'undefined') {
    cornerstoneTools = {
        referenceLines: {}, orientation: {}
    };
}
 
// End Source; src/header.js

// Begin Source: src/imageTools/measureL.js
(function($, cornerstone, cornerstoneTools) {

    'use strict';

    function defaultStrategy(eventData) {
        var enabledElement = cornerstone.getEnabledElement(eventData.element);

        cornerstone.updateImage(eventData.element);

        var context = enabledElement.canvas.getContext('2d');
        context.setTransform(1, 0, 0, 1, 0, 0);

        var color = '#ff0000';

        context.save();

        var x = Math.round(eventData.currentPoints.image.x);
        var y = Math.round(eventData.currentPoints.image.y);

        if (x < 0 || y < 0 || x >= eventData.image.columns || y >= eventData.image.rows) {
            return;
        }

        var coords = {x, y}
        var realCoords = cornerstone.pixelToCanvas(eventData.element, coords);

        context.beginPath();
        context.lineWidth = cornerstoneTools.toolStyle.getActiveWidth();
        context.moveTo(realCoords.x, 0);
        context.lineTo(realCoords.x, eventData.image.rows);
        context.strokeStyle = color;
        context.stroke();
        context.restore();
    }

    function mouseUpCallback(e, eventData) {
        $(eventData.element).off('CornerstoneToolsMouseDrag', onDrag);
        $(eventData.element).off('CornerstoneToolsMouseUp', mouseUpCallback);
        //cornerstone.updateImage(eventData.element);
    }

    function mouseDownCallback(e, eventData) {
        if (cornerstoneTools.isMouseButtonEnabled(eventData.which, e.data.mouseButtonMask)) {
            $(eventData.element).on('CornerstoneToolsMouseDrag', onDrag);
            $(eventData.element).on('CornerstoneToolsMouseUp', mouseUpCallback);
            defaultStrategy(eventData);
            return false; // false = causes jquery to preventDefault() and stopPropagation() this event
        }
    }

    function onDrag(e, eventData) {
        defaultStrategy(eventData);
        return false; // false = causes jquery to preventDefault() and stopPropagation() this event
    }

    cornerstoneTools.measureL = cornerstoneTools.simpleMouseButtonTool(mouseDownCallback);
    cornerstoneTools.measureLTouch = cornerstoneTools.touchDragTool(onDrag);
    

    
})($, cornerstone, cornerstoneTools);
 
// End Source; src/imageTools/measureL.js

// Begin Source: src/imageTools/measure.js
(function($, cornerstone, cornerstoneTools) {

    'use strict';

    var toolType = 'measure';
    

    ///////// BEGIN ACTIVE TOOL ///////
    function createNewMeasurement(mouseEventData) {
        // create the measurement data for this tool with the end handle activated
        var measurementData = {
            visible: true, active: true, handles: {
                end: {
                    x: mouseEventData.currentPoints.image.x, y: mouseEventData.currentPoints.image.y, highlight: true, active: true
                }
            }
        };
        return measurementData;
    }
    ///////// END ACTIVE TOOL ///////

    ///////// BEGIN IMAGE RENDERING ///////
    function pointNearTool(element, data, coords) {
        var endCanvas = cornerstone.pixelToCanvas(element, data.handles.end);
        return cornerstoneMath.point.distance(endCanvas, coords) < 5
    }

    function onImageRendered(e, eventData) {
        // if we have no toolData for this element, return immediately as there is nothing to do
        var toolData = cornerstoneTools.getToolState(e.currentTarget, toolType);
        if (!toolData) {
            return;
        }

        // we have tool data for this element - iterate over each one and draw it
        var context = eventData.canvasContext.canvas.getContext('2d');
        context.setTransform(1, 0, 0, 1, 0, 0);

        var color = '#ff0000';

        for (var i = 0; i < toolData.data.length; i++) {

            //context.save();
            var data = toolData.data[i];

            // draw the handles
            cornerstoneTools.drawLines(context, eventData, data.handles, color);

            var x = Math.round(data.handles.end.x);
            var y = Math.round(data.handles.end.y);

            if (x < 0 || y < 0 || x >= eventData.image.columns || y >= eventData.image.rows) {
                return;
            }

            console.log(data.handles)
            context.restore();
        }
    }
    ///////// END IMAGE RENDERING ///////

    // module exports
    cornerstoneTools.measure = cornerstoneTools.mouseButtonTool({
        createNewMeasurement: createNewMeasurement, onImageRendered: onImageRendered, pointNearTool: pointNearTool, toolType: toolType
    });
    cornerstoneTools.measureTouch = cornerstoneTools.touchTool({
        createNewMeasurement: createNewMeasurement, onImageRendered: onImageRendered, pointNearTool: pointNearTool, toolType: toolType
    });

})($, cornerstone, cornerstoneTools);
 
// End Source; src/imageTools/measure.js

// Begin Source: src/manipulators/drawLines.js
(function(cornerstone, cornerstoneTools) {

    'use strict';

    function drawLines(context, renderData, handles, color) {
        context.strokeStyle = color;

        Object.keys(handles).forEach(function(name) {
            var handle = handles[name];
            context.beginPath();

            context.lineWidth = cornerstoneTools.toolStyle.getActiveWidth();

            var handleCanvasCoords = cornerstone.pixelToCanvas(renderData.element, handle);
            context.moveTo(handleCanvasCoords.x, 0);
            context.lineTo(handleCanvasCoords.x, renderData.image.rows);

            context.stroke();
        });
    }

    // module/private exports
    cornerstoneTools.drawLines = drawLines;

})(cornerstone, cornerstoneTools);
 
// End Source; src/manipulators/drawLines.js