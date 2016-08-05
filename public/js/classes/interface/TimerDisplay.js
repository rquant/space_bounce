/*
 * Active label to reflect the amount of time in seconds when until the player
   wins the game
 */
(function (spacebounce) {

    function TimerDisplay() {
        this.initialize();
    }
    var config = spacebounce.config;
    var p = TimerDisplay.prototype = new createjs.Container();

    p.label;
    p.timer;
    p.labelWidth;
    p.color = "#FFF";
    p.secondsRemaining = config.gameplay.timeRemaining;

    p.Container_initialize = p.initialize;

    p.initialize = function() {
        this.Container_initialize();

        var label = new createjs.Text("", "13px Futura", this.color);
        label.textAlign = "center";

        this.label = label;
        this.x = config.stage.width / 2;
        this.y = 15;
        this.addChild(label);
    }

    p.tick = function(ticksRemaining) {
        var secondsRemaining = Math.floor(ticksRemaining / config.framerate);
        this.label.text = "TIME REMAINING : " + secondsRemaining;
    }

    spacebounce.TimerDisplay = TimerDisplay;

}(spacebounce));
