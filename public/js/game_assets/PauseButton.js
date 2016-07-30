/*
 *Pauses the game and launches the pause menu
 */
(function (spacebounce) {

    function PauseButton(text) {
        this.initialize(text);
    }

        var p = PauseButton.prototype = new createjs.Container();

        p.parentContainer;
        p.text;
        p.buttonWidth = 18;
        p.buttonHeight = 18;
        p.padding = BUTTON_PADDING;
        p.Container_initialize = p.initialize;

        p.vX;
        p.vY;
        p.initialize = function(text) {

            this.Container_initialize();

            //this.parentContainer = gameContainer;
            this.text = text;
            var button = new createjs.Container();

            var frame = new createjs.Shape();
            frame.graphics.beginFill("#6699FF").drawRoundRect(
              0, 0 , this.buttonWidth, this.buttonHeight, 2
            ).endFill();

            //these shapes together represent the pause icon
            var rectWidth = 3;
            var rectHeight = this.buttonHeight*(1/2);
            var rect1 = new createjs.Shape();
            rect1.graphics.beginFill("#FFF").drawRect(0,0, rectWidth, rectHeight);
            rect1.regX = rectWidth/2;
            rect1.regY = rectHeight/2;
            rect1.x = this.buttonWidth/2 - 3;
            rect1.y = this.buttonHeight/2;

            var rect2 = new createjs.Shape();
            rect2.graphics.beginFill("#FFF").drawRect(0,0, rectWidth, rectHeight);
            rect2.regX = rectWidth/2;
            rect2.regY = rectHeight/2;
            rect2.x = this.buttonWidth/2 + 3;
            rect2.y = this.buttonHeight/2;


            this.addChild(frame, rect1, rect2);
            this.mouseChildren = false;
            this.x = STAGE_WIDTH - (HUD_OFFSET + this.buttonWidth);
            this.y = HUD_OFFSET;
            this.alpha = 0.3;


            this.vX = 0;
            this.vY = 0;
        }

        p.addEventListener("click", function() {
            console.log("pause click..");
            spacebounce.mainGame.stateController.pauseGame();
        });

        //ensures gameplay interactions (force field creation) is disabled when user clicks on pause button
        p.addEventListener("mouseover", function () {
            spacebounce.mainGame.stage.fireMouseEvent = false;
        });

        //re-enables gameplay interactions when user is no longer hovering over pause button
         p.addEventListener("mouseout", function () {
            spacebounce.mainGame.stage.fireMouseEvent = false;
        });

    spacebounce.PauseButton = PauseButton;

}(spacebounce));
