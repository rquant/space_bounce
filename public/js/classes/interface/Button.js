/*
 *A button used for a menu
 */
(function (window) {

    function Button(text) {
        this.initialize(text);
    }

        var p = Button.prototype = new createjs.Container();

        p.text;
        p.buttonWidth = MENU_BUTTON_WIDTH;
        p.buttonHeight = MENU_BUTTON_HEIGHT;
        p.underlay;
        p.frame;
        p.label;
        p.audioButton;
        p.Container_initialize = p.initialize;

        p.initialize = function(text) {

        this.Container_initialize();

        this.text = text;
        var button = new createjs.Container();
        var underlay = new createjs.Shape(); //this is a transparent underlay so the button will detect click events any where in the container
        underlay.graphics.beginFill("#000").drawRoundRect(0, 0 , this.buttonWidth, this.buttonHeight, 2).endFill();
        underlay.alpha = 0.7;
        var frame = new createjs.Shape();
        frame.graphics.setStrokeStyle(2).beginStroke("#FFFFFF").drawRoundRect(0, 0 , this.buttonWidth, this.buttonHeight, 2).endFill();
        var label = new createjs.Text(text, "20px Avenir", "#FFFFFF");
        label.textAlign = "center";
        label.textBaseline = "middle";
        //offset the label to be in the center of the button
        label.x = this.buttonWidth/2;
        label.y = this.buttonHeight/2;

        this.underlay = underlay;
        this.frame = frame;
        this.label = label;

        this.addChild(underlay, frame, label);
        this.mouseChildren = false;
    }

    //for some reason the properties are undefined after buttons are created. investigate this.
    //p.addEventListener("mouseover", function(event) {
    //    var target = event.target;
    //    var underlay = this.underlay;
    //    underlay.graphics.clear().beginFill("#FFF").drawRect(0, 0, this.buttonWidth, this.buttonHeight).endFill();
    //    underlay.alpha = 1;
    //});
    //
    window.Button = Button;

}(window));
