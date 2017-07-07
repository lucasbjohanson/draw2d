var LabelSvgRectangle = draw2d.SVGFigure.extend({
    init:function(attr)
    {
      this._super(attr);
    
      // Create any Draw2D figure as decoration for the connection
      //
      this.label = new draw2d.shape.basic.Label({
        text:"I'm a SVG", 
        color:"#0d0d0d", 
        fontColor:"#0d0d0d",
        userData: {
            moveKeyStatus: false
        }
      });

      this.setSVG('<svg width="100px" height="60px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" ><rect id="Rectangle-1" stroke="#979797" fill="#D8D8D8" width="39" height="39" rx="8"></rect></svg>');
      
      // add the new decoration to the connection with a position locator.
      //
      this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
      
      //this.label.installEditor(new draw2d.ui.LabelInplaceEditor());

    }
});

var LabelSvgPentacle = draw2d.SVGFigure.extend({
    init:function(attr)
    {
      this._super(attr);
    
      // Create any Draw2D figure as decoration for the connection
      //
      this.label = new draw2d.shape.basic.Label({
        text:"I'm a Pentagram", 
        color:"#0d0d0d", 
        fontColor:"#0d0d0d",
        userData: {
            moveKeyStatus: false
        }
      });

      this.setSVG('<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg"><path stroke="#000" id="svg_3" d="m3.606718,12.334785l8.709842,0l2.691408,-8.967823l2.69141,8.967823l8.70984,0l-7.046397,5.542356l2.691547,8.967823l-7.0464,-5.542507l-7.046399,5.542507l2.691548,-8.967823l-7.046399,-5.542356z" stroke-width="1.5" fill="#fff"/></svg>');
      
      // add the new decoration to the connection with a position locator.
      //
      this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
      
      //this.label.installEditor(new draw2d.ui.LabelInplaceEditor());

    }
});

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

