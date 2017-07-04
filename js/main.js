$(window).load(function () {

     // create the paint area. The id in the constructor must be
     // an existing DIV 
    var canvas = new draw2d.Canvas("gfx_holder");

    var currentDrawingConnection = null;
    var lineStartPoint = null;
    var currentKeyCode = 0;
    var f_keyDownFlag = 0;

    var originMovePointX = 0;
    var originMovePointY = 0;

    var keyPressPositionX = 0;
    var keyPressPositionY = 0;

    var getDistance = function (startPoint, endPoint) {
        return Math.pow((startPoint.x - endPoint.getX()), 2) + Math.pow((startPoint.y - endPoint.getY()), 2);
    }

    var getNearestPoint = function (mousePoint, points) {
        var nearDistance = getDistance(mousePoint, points.data[0]), index = 0;

        for (i = 1; i < points.data.length; i++) {
            distance = getDistance(mousePoint, points.data[i]);
            if (nearDistance > distance) {
                nearDistance = distance;
                index = i;
            }
        }
        return index;
    };

    var createConnection = function (sourcePort, targetPort) {
        return new RubberConnection({
            source: sourcePort,
            target: targetPort
        });
    };

    var getSelectFigureOnCanvas = function (canvas) {
        var overMouseFigureParent = null;
        var overMouseFigure = canvas.getBestFigure(currentMousePosition.getX(), currentMousePosition.getY());

        if (overMouseFigure != null)
            overMouseFigureParent = overMouseFigure.getRoot();

        if (overMouseFigureParent != null)
            overMouseFigure = overMouseFigureParent;

        return overMouseFigure;
    };

    var commonMouseEnter = function () {
    };

    var commonMouseLeave = function () {
    };

    var dragPolicy = new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection: createConnection
    })

    var createRectangle = function (canvas, x, y) {
        var rect = new LabelRectangle({
            width:100, 
            height:80,
            userData: {
                moveKeyStatus: false,
                linkKeyStatus: false
            }, 
            onMouseEnter: commonMouseEnter, 
            onMouseLeave: commonMouseLeave
        });
        rect.createPort("hybrid", new draw2d.layout.locator.LeftLocator(rect));
        rect.createPort("hybrid", new draw2d.layout.locator.RightLocator(rect));
        rect.createPort("hybrid", new draw2d.layout.locator.TopLocator(rect));
        rect.createPort("hybrid", new draw2d.layout.locator.BottomLocator(rect));

        canvas.add( rect, x, y);

        return rect;
    }

    var rect = createRectangle(canvas, 150, 200);

    var currentMousePosition = new draw2d.geo.Point(0, 0);

    var kp = new draw2d.policy.canvas.KeyboardPolicy({
        onKeyDown: function (canvas, keycode, shiftKey, ctrlKey) {
            currentKeyCode = keycode;

            var selectedRect = getSelectFigureOnCanvas(canvas);

            if (keycode === 68) {
                if (selectedRect == null)
                    return;

                // D key pressed
                selectedRect.setUserData({
                    moveKeyStatus: true,
                    linkKeyStatus: false,
                    mouseOffset: {
                        x: currentMousePosition.getX() - selectedRect.getPosition().getX(),
                        y: currentMousePosition.getY() - selectedRect.getPosition().getY()
                    }
                });
            } else if (keycode === 70) {
                // F key pressed
                if (f_keyDownFlag == 1)
                    return;

                canvas.setCurrentSelection(null);

                if (selectedRect != null) {
                    selectedRect.setUserData({
                        moveKeyStatus: false,
                        linkKeyStatus: true,
                        mouseOffset: {
                            x: currentMousePosition.getX() - selectedRect.getPosition().getX(),
                            y: currentMousePosition.getY() - selectedRect.getPosition().getY()
                        }
                    });

                    var sourcePorts = selectedRect.getOutputPorts();
                    var pointIndex = getNearestPoint(selectedRect.getUserData().mouseOffset, sourcePorts);

                    lineStartPoint = selectedRect.getHybridPort(pointIndex);
                    lineStartPoint.onMouseEnter();
                } else {
                    var bf = canvas.getBestFigure(currentMousePosition.getX(), currentMousePosition.getY());

                    if (bf == null)
                        return;

                    lineStartPoint = bf;
                }

                dragPolicy.onMouseDown(canvas, lineStartPoint.getAbsolutePosition().getX(), lineStartPoint.getAbsolutePosition().getY(), false, false);

                f_keyDownFlag = 1;
                keyPressPositionX = currentMousePosition.getX();
                keyPressPositionY = currentMousePosition.getY();
            } else if (keycode === 84) {
                if (selectedRect == null)
                    return;

                // T key pressed
                selectedRect.setUserData({
                    moveKeyStatus: false
                });
                var children = selectedRect.getChildren();
                var child = null;

                if (children != null && children != undefined && children.data.length > 0)
                    child = children.data[0];
                else {
                    child = selectedRect;
                }

                if (child == null)
                    return;

                var labelInplaceEditor = new draw2d.ui.LabelInplaceEditor();
                labelInplaceEditor.start(child);
            } else if (keycode === 27) {
                if (selectedRect == null)
                    return;

                // ESC key pressed
                selectedRect.setUserData({
                    moveKeyStatus: false
                });
            }
        }, 
        onKeyUp: function (canvas, keycode, shiftKey, ctrlKey) {
            currentKeyCode = 0;

            if (keycode === 68) {
                selectedRect = getSelectFigureOnCanvas(canvas);

                if (selectedRect == null)
                    return;

                selectedRect.setUserData({
                    moveKeyStatus: false
                });
            } else if (keycode === 66) {
                var newRect = createRectangle(canvas, currentMousePosition.getX(), currentMousePosition.getY());

                var children = newRect.getChildren();
                var child = null;

                if (children != null && children != undefined && children.data.length > 0)
                    child = children.data[0];
                else {
                    child = newRect;
                }

                if (child == null)
                    return;

                var labelInplaceEditor = new draw2d.ui.LabelInplaceEditor();
                labelInplaceEditor.start(child);
            } else if (keycode === 70) {
                currentDrawingConnection = null;

                if (lineStartPoint != null) {
                    lineStartPoint.onMouseLeave();

                    dragPolicy.onMouseUp(canvas, currentMousePosition.getX(), currentMousePosition.getY(), false, false);
                    var bf = canvas.getBestFigure(currentMousePosition.getX(), currentMousePosition.getY(), lineStartPoint);

                    if (bf != null) {
                        if (lineStartPoint.getId() != bf.getId()) {
                            if (lineStartPoint.getParent() != null && bf.getParent() != null) {
                                if (lineStartPoint.getParent().getId() != bf.getParent().getId()) {
                                    var newLine = dragPolicy.createConnection(lineStartPoint, bf);
                                    canvas.add(newLine);
                                }
                            }
                        }
                    }
                }

                lineStartPoint = null;
                f_keyDownFlag = 0;
            }
        },
        onMouseMove: function (canvas, x, y, shiftKey, ctrlKey) {
            currentMousePosition.setX(x);
            currentMousePosition.setY(y);

            if (currentKeyCode == 68) {
                var selectedRect = getSelectFigureOnCanvas(canvas);

                if (selectedRect == null)
                    return;

                var selectedRectMoveKeyStatus = selectedRect.getUserData().moveKeyStatus;

                if (selectedRectMoveKeyStatus) {
                    selectedRect.setPosition(x - selectedRect.getUserData().mouseOffset.x, y - selectedRect.getUserData().mouseOffset.y);
                }
            } else if (currentKeyCode == 70) {
                var diffX1 = x - keyPressPositionX;
                var diffY1 = y - keyPressPositionY;

                if (lineStartPoint != null)
                    dragPolicy.onMouseDrag(canvas, diffX1, diffY1, diffX1 - originMovePointX, diffY1 - originMovePointY, false, false);

                originMovePointX = diffX1;
                originMovePointY = diffY1;
            }
        }
    });

    canvas.uninstallEditPolicy(new draw2d.policy.canvas.DefaultKeyboardPolicy());
    canvas.installEditPolicy(kp);
    canvas.installEditPolicy(dragPolicy);

    $("body").scrollTop(0)
          .scrollLeft(0);
});