$(window).load(function () {

     // create the paint area. The id in the constructor must be
     // an existing DIV 
    var canvas = new draw2d.Canvas("gfx_holder");

    var currentDrawingConnection = null;
    var lineStartPoint = null;
    var currentKeyCode = 0;
    var f_keyDownFlag = 0;
    var selectionMode = false;

    var originMovePointX = 0;
    var originMovePointY = 0;

    var keyPressPositionX = 0;
    var keyPressPositionY = 0;

    var labelInplaceEditor = new draw2d.ui.LabelInplaceEditor();

    var dragPolicy = new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection: createConnection
    })

    var boundingBoxSelection = new draw2d.policy.canvas.BoundingboxSelectionPolicy();

    var rect = createRectangle(canvas, 150, 200);
    var diamond = createDiamond(canvas, 350, 200);
    var circle = createCircle(canvas, 150, 400);

    var currentMousePosition = new draw2d.geo.Point(0, 0);

    var kp = new draw2d.policy.canvas.KeyboardPolicy({
        onKeyDown: function (canvas, keycode, shiftKey, ctrlKey) {
            currentKeyCode = keycode;

            keyPressPositionX = currentMousePosition.getX();
            keyPressPositionY = currentMousePosition.getY();

            var selectedRect = getSelectFigureOnCanvas(canvas, currentMousePosition.getX(), currentMousePosition.getY());

            if (keycode === 68) {
                var selectedFigures = getAllSelectedFigures(canvas);

                if (selectedFigures == null)
                    return;

                // D key pressed
                boundingBoxSelection.onMouseDown(canvas, currentMousePosition.getX(), currentMousePosition.getY(), false, false);
            } else if (keycode == 69) {

            } else if (keycode === 70) {
                // F key pressed
                if (f_keyDownFlag == 1)
                    return;

                canvas.setCurrentSelection(null);

                if (selectedRect != null) {
                    var objectData = selectedRect.getUserData();
                    objectData.moveKeyStatus = false;
                    objectData.linkKeyStatus = true;
                    objectData.mouseOffset.x = currentMousePosition.getX() - selectedRect.getPosition().getX();
                    objectData.mouseOffset.y = currentMousePosition.getY() - selectedRect.getPosition().getY();
                    selectedRect.setUserData(objectData);

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
            } else if (keycode === 83) {
                // S key pressed
                selectionMode = true;

                if (selectedRect == null) {
                    sKeyDownAction(canvas, currentMousePosition.getX(), currentMousePosition.getY());
                }
            } else if (keycode === 84) {
                if (selectedRect == null)
                    return;

                // T key pressed
                var objectData = selectedRect.getUserData();
                objectData.moveKeyStatus = false;
                selectedRect.setUserData(objectData);

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

                labelInplaceEditor.commit = function () {
                    this.html.unbind("blur",this.commitCallback);
                    $("body").unbind("click",this.commitCallback);
                    var label = this.html.val();
                    var cmd =new draw2d.command.CommandAttr(this.label, {text:label});
                    this.label.getCanvas().getCommandStack().execute(cmd);
                    this.html.fadeOut($.proxy(function(){
                        this.html.remove();
                        this.html = null;
                        this.listener.onCommit(this.label.getText());
                    },this));

                    var labelWidth = this.label.getWidth() + 100;
                    selectedRect.setWidth(labelWidth);
                };
            } else if (keycode === 27) {
                if (selectedRect == null)
                    return;

                // ESC key pressed
                var objectData = selectedRect.getUserData();
                objectData.moveKeyStatus = false;
                objectData.linkKeyStatus = false;
                selectedRect.setUserData(objectData);
            } else if (keycode === 13) {
                
            }
        }, 
        onKeyUp: function (canvas, keycode, shiftKey, ctrlKey) {
            currentKeyCode = 0;

            if (keycode === 66) {
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

                labelInplaceEditor.start(child);
            } else if (keycode === 68) {
                boundingBoxSelection.onMouseUp(canvas, currentMousePosition.getX(), currentMousePosition.getY(), shiftKey, ctrlKey);
            } else if (keycode == 69) {
                selectedRect = getSelectFigureOnCanvas(canvas, currentMousePosition.getX(), currentMousePosition.getY());

                if (selectedRect == null)
                    return;
                
                var currentSelection  = canvas.getSelection();

                if (currentSelection != null) {
                    var prevSelectedRect = currentSelection.getPrimary();

                    if (prevSelectedRect != null) {
                        prevSelectedRect.unselect();
                        canvas.setCurrentSelection(null);
                    }
                }

                canvas.setCurrentSelection(selectedRect.select(true));

                $('#selectType').modal();
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
            } else if (keycode === 81) {
                // Q key up
                removeSelectedFigures(canvas);

            } else if (keycode === 83) {
                // S key up

                if (selectionMode === false){
                    return;
                }

                sKeyUpAction(canvas, currentMousePosition.getX(), currentMousePosition.getY());

                selectionMode = false;
            }

            originMovePointX = 0;
            originMovePointY = 0;

            keyPressPositionX = 0;
            keyPressPositionY = 0;
        },
        onMouseMove: function (canvas, x, y, shiftKey, ctrlKey) {
            currentMousePosition.setX(x);
            currentMousePosition.setY(y);

            if (currentKeyCode == 68) {
                if (getSelectedFigure(canvas) == null)
                    return;

                var diffX1 = x - keyPressPositionX;
                var diffY1 = y - keyPressPositionY;

                boundingBoxSelection.onMouseDrag(canvas, diffX1, diffY1, diffX1 - originMovePointX, diffY1 - originMovePointY, shiftKey, ctrlKey);

                originMovePointX = diffX1;
                originMovePointY = diffY1;
            } else if (currentKeyCode == 70) {
                var diffX1 = x - keyPressPositionX;
                var diffY1 = y - keyPressPositionY;

                if (lineStartPoint != null)
                    dragPolicy.onMouseDrag(canvas, diffX1, diffY1, diffX1 - originMovePointX, diffY1 - originMovePointY, false, false);

                originMovePointX = diffX1;
                originMovePointY = diffY1;
            } else if (currentKeyCode === 83) {
                var figureOverMouse = getSelectFigureOnCanvas(canvas, currentMousePosition.getX(), currentMousePosition.getY());

                if (figureOverMouse == null)
                    return;

                var objectData = figureOverMouse.getUserData();

                if (objectData.seleted) {
                    objectData.seleted = false;
                    figureOverMouse.unselect();
                } else {
                    objectData.seleted = true;
                    figureOverMouse.select(true);
                }
                figureOverMouse.setUserData(objectData);
            }
        }
    });

    canvas.uninstallEditPolicy(new draw2d.policy.canvas.DefaultKeyboardPolicy());
    canvas.installEditPolicy(kp);
    canvas.installEditPolicy(dragPolicy);
    canvas.installEditPolicy(boundingBoxSelection);

    $("body").scrollTop(0)
          .scrollLeft(0);

    $('#selectType').on('keyup', function (e) {
        var selectedRect = getSelectedFigure(canvas);
        
        if (e.keyCode == 38) {
            if ($('.list-group-item.active').attr('data-index') !== 'top')
                $('.list-group-item.active').removeClass('active').prev().addClass('active');
        } else if (e.keyCode == 40) {
            if ($('.list-group-item.active').attr('data-index') !== 'bottom')
                $('.list-group-item.active').removeClass('active').next().addClass('active');
        } else if (e.keyCode == 13) {

            if (selectedRect == null) {
                $('#selectType').modal('hide');
                return;
            }

            var type = $('.list-group-item.active').text();
            var objectData = selectedRect.getUserData();
            objectData.objectType.type = type;
            selectedRect.setUserData(objectData);

            $('#selectType').modal('hide');
        }
    });

    $('#selectType').on('hide.bs.modal', function (e) {
        var newFigure = null;
        var selectedRect = getSelectedFigure(canvas);
        var x = selectedRect.getPosition().getX();
        var y = selectedRect.getPosition().getY();

        selectedRect.unselect();
        canvas.setCurrentSelection(null);

        var type = $('.list-group-item.active').text();

        var ports = selectedRect.getPorts();

        canvas.remove(selectedRect);

        if (type == 'Activity') {
            newFigure = createRectangle(canvas, x, y, true);
        } else if (type == 'Goal') {
            newFigure = createCircle(canvas, x, y, true);
        } else if (type == 'Abstract') {
            newFigure = createDiamond(canvas, x, y, true);
        } else {
            newFigure = createRectangle(canvas, x, y, true);
        }

        newFigure.addPort(ports.data[0], new draw2d.layout.locator.LeftLocator(newFigure));
        newFigure.addPort(ports.data[1], new draw2d.layout.locator.RightLocator(newFigure));
        newFigure.addPort(ports.data[2], new draw2d.layout.locator.TopLocator(newFigure));
        newFigure.addPort(ports.data[3], new draw2d.layout.locator.BottomLocator(newFigure));

        newFigure.layoutPorts();
    });

    $('#selectType').on('show.bs.modal', function (e) {
        var selectedRect = getSelectedFigure(canvas);

        var type = selectedRect.getUserData().objectType.type;
        
        $('.list-group-item.active').removeClass('active');

        if (type == 'default') {
            $('.list-group-item:first').addClass('active');
        } else {
            $('.list-group-item').each(function (index, element) {
                if ($(element).text() === type) {
                    $(element).addClass('active');
                }
            });
        }
    });

    $('.list-group-item').on('click', function () {
        $('.list-group-item.active').removeClass('active');
        $(this).addClass('active');
    });
});