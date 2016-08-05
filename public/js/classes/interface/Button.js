(function (spacebounce) {

    function Button(width, height) {
        this.initialize(width, height);
    }

        var p = Button.prototype = new createjs.Container();

        p.x;
        p.y;
        p.width;
        p.height;
        p.text;
        p.underlay;
        p.frame;
        p.label;
        p.Container_initialize = p.initialize;

        p.initialize = function(width, height) {
          this.Container_initialize();
          this.width = width;
          this.height = height;

          // transparent layer ensuring the button will detect click events
          // any where in the container
          var underlay = new createjs.Shape();
          underlay.graphics.beginFill("#000").drawRoundRect(
            0, 0 , width, height, 2
          ).endFill();

          var frame = new createjs.Shape();
          var label = new createjs.Container();

          this.underlay = underlay;
          this.frame = frame;
          this.label = label;

          this.addChild(underlay, frame, label);
          this.mouseChildren = false;
    }

    spacebounce.Button = Button;

}(spacebounce));
