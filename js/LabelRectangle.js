
var LabelRectangle = draw2d.shape.basic.Rectangle.extend({
    
    init:function(attr)
    {
      this._super(attr);
    
      // Create any Draw2D figure as decoration for the connection
      //
      this.label = new draw2d.shape.basic.Label({
        text:"I'm a Label", 
        color:"#0d0d0d", 
        fontColor:"#0d0d0d",
        userData: {
            moveKeyStatus: false
        }
      });
      
      // add the new decoration to the connection with a position locator.
      //
      this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
      
      //this.label.installEditor(new draw2d.ui.LabelInplaceEditor());

    }
});

var LabelDiamond = draw2d.shape.basic.Diamond.extend({
    
    init:function(attr)
    {
      this._super(attr);
    
      // Create any Draw2D figure as decoration for the connection
      //
      this.label = new draw2d.shape.basic.Label({
        text:"I'm a Diamond", 
        color:"#0d0d0d", 
        fontColor:"#0d0d0d",
        userData: {
            moveKeyStatus: false
        }
      });
      
      // add the new decoration to the connection with a position locator.
      //
      this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
      
      //this.label.installEditor(new draw2d.ui.LabelInplaceEditor());

    }
});

var LabelCircle = draw2d.shape.basic.Circle.extend({
    
    init:function(attr)
    {
      this._super(attr);
    
      // Create any Draw2D figure as decoration for the connection
      //
      this.label = new draw2d.shape.basic.Label({
        text:"I'm a Diamond", 
        color:"#0d0d0d", 
        fontColor:"#0d0d0d",
        userData: {
            moveKeyStatus: false
        }
      });
      
      // add the new decoration to the connection with a position locator.
      //
      this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
      
      //this.label.installEditor(new draw2d.ui.LabelInplaceEditor());

    }
});

var RubberConnection = draw2d.Connection.extend({
  init: function (attr, setter, getter) {
    this._super($.extend({
      color: "#33691e",
      stroke: 1,
      outlineStroke: 0,
      outlineColor: null
    }, attr),
    setter,
    getter);

    this.setRouter(new draw2d.layout.connection.RubberbandRouter());
  }, 
  repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return;      
    }

    attributes = attributes || {};

    if (typeof attributes.fill === "undefined") {
      attributes.fill = "aed581";
    }

    this._super(attributes);
  },
  onMouseEnter: function () {
    var canvas = this.getCanvas();
    canvas.addSelection(this);
  },
  onMouseLeave: function () {
    this.unselect();
  }
});

var ArrowConnection = draw2d.Connection.extend({
  init: function (attr, setter, getter) {
    this._super($.extend({
      color: "#33691e",
      stroke: 3,
      outlineStroke: 2,
      outlineColor: null
    }, attr),
    setter,
    getter);

    this.setRouter(new draw2d.layout.connection.ManhattanBridgedConnectionRouter());
  }, 
  repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return;      
    }

    attributes = attributes || {};

    // if (typeof attributes.fill === "undefined") {
    //   attributes.fill = "aed581";
    // }

    this._super(attributes);
  },
  onMouseEnter: function () {
    var canvas = this.getCanvas();
    canvas.addSelection(this);
  },
  onMouseLeave: function () {
    this.unselect();
  }
});

