/*
 *Pauses the game and launches the pause menu
 */
(function (spacebounce) {

    function PauseButton() {
        this.initialize();
    }

        var p = PauseButton.prototype = new spacebounce.Button();

        p.parentContainer;
        p.padding = BUTTON_PADDING;
        p.Button_initialize = p.initialize;

        p.initialize = function() {

            this.Button_initialize(18, 18);

            this.frame.graphics.beginFill("#6699FF").drawRoundRect(
              0, 0 , this.width, this.height, 2
            ).endFill();
            this.alpha = 0.3;
            this.x = STAGE_WIDTH - (HUD_OFFSET + this.width);
            this.y = HUD_OFFSET;

            //these shapes together represent the pause icon
            var rectWidth = 3;
            var rectHeight = this.height*(1/2);
            var rect1 = new createjs.Shape();
            rect1.graphics.beginFill("#FFF").drawRect(0,0, rectWidth, rectHeight);
            rect1.regX = rectWidth/2;
            rect1.regY = rectHeight/2;
            rect1.x = this.width/2 - 3;
            rect1.y = this.width/2;

            var rect2 = $.extend({}, rect1);
            rect2.x = this.width/2 + 3;

            this.label.addChild(rect1, rect2);
        }

        p.addEventListener("click", function() {
            spacebounce.mainGame.stateController.pauseGame();
        });

        //ensures gameplay interactions (force field creation) is disabled when user clicks on pause button
        p.addEventListener("mouseover", function () {
            spacebounce.mainGame.stage.fireMouseEvent = false;
        });

        //re-enables gameplay interactions when user is no longer hovering over pause button
         p.addEventListener("mouseout", function () {
            spacebounce.mainGame.stage.fireMouseEvent = true;
        });

    spacebounce.PauseButton = PauseButton;

}(spacebounce));
