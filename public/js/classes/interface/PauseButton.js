/*
 *Pauses the game and launches the pause menu
 */
(function (spacebounce) {

    function PauseButton(stage) {
        this.initialize(stage);
    }
        var config = spacebounce.config;
        var p = PauseButton.prototype = new spacebounce.Button();

        p.stage;
        p.Button_initialize = p.initialize;

        p.initialize = function(stage) {
            this.Button_initialize(18, 18);

            const HUD_OFFSET = config.stage.hudOffset;

            this.frame.graphics.beginFill("#6699FF").drawRoundRect(
              0, 0 , this.width, this.height, 2
            ).endFill();
            this.alpha = 0.3;
            this.x = config.stage.width - (HUD_OFFSET + this.width);
            this.y = HUD_OFFSET;
            this.stage = stage;

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
            spacebounce.game.state.pauseGame();
        });

        // ensures gameplay interactions such as force field creation
        // are disabled when user clicks on pause button
        p.addEventListener("mouseover", function (event) {
            event.target.stage.fireMouseEvent = false;
        });

        // re-enables gameplay interactions when user is no longer hovering over
        // pause button
         p.addEventListener("mouseout", function (event) {
            event.target.stage.fireMouseEvent = true;
        });

    spacebounce.PauseButton = PauseButton;

}(spacebounce));
