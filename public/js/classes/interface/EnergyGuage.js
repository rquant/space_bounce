/*
 *Displays the status of the player's energy
 */
(function (spacebounce) {

    function EnergyGuage() {
        this.initialize();
    }

    var p = EnergyGuage.prototype = new createjs.Container();

    //public properties
    p.parentContainer;
    p.energyGuageBar;
    p.color = "#66F0B9";
    p.energySupply;

    //constructor
    p.Container_initialize = p.initialize;

    p.initialize = function() {

        //call super
        this.Container_initialize();
        //set up loading screen
        var energyGuageWidth = 80;
        var energyGuageHeight = 10;

        var energyGuageBar = new createjs.Shape();
        energyGuageBar.graphics.beginFill(this.color).drawRect(
          0, 0, energyGuageWidth, energyGuageHeight
        ).endFill();
        var frame = new createjs.Shape();
        frame.graphics.setStrokeStyle(2).beginStroke(this.color).drawRoundRect(
          0, 0, energyGuageWidth, energyGuageHeight, 2
        );

        this.energyGuageBar = energyGuageBar;
        this.addChild(frame, energyGuageBar);

        this.x = HUD_OFFSET;
        this.y = HUD_OFFSET;
        this.alpha = 0.3;

    }

    //update the guage to match the energy supply
    p.tick = function(energySupply) {
        energySupplyRatio = energySupply/MAX_ENERGY;
        this.energyGuageBar.scaleX = energySupplyRatio;
    }

    spacebounce.EnergyGuage = EnergyGuage;

}(spacebounce));
