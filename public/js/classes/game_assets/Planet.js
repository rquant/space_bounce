/*
 *The planet used for the background.
 */
(function (spacebounce) {

    function Planet() {
        this.initialize();
    }
    var config = spacebounce.config;
    var p = Planet.prototype = new createjs.Shape();

    p.radius;
    p.color;

    p.Shape_initialize = p.initialize;

    p.initialize = function() {

        this.Shape_initialize();
        const STAGE_WIDTH = config.stage.width;
        const STAGE_HEIGHT = config.stage.height;

        this.x = STAGE_WIDTH/2;
        this.y = (2.2)* STAGE_HEIGHT +50;
        this.radius = STAGE_WIDTH;
        this.color = "#E7F3FF";

        this.graphics.beginFill(this.color).drawCircle(
          0, 0, this.radius
        ).endFill();

         var blurFilter = new createjs.BlurFilter(5, 5, 2);

        var bounds = blurFilter.getBounds();

        var color = 0x00FFFF;
        var alpha = 1;
        var blurX = 32;
        var blurY = 32;
        var strength = 1;
        var quality = 1;
        var inner = false;
        var knockout = false;
        var glowFilter = new createjs.GlowFilter(
          color, alpha, blurX, blurY, strength, quality, inner, knockout
        );

        this.filters = [blurFilter, glowFilter];
        this.cache(-STAGE_WIDTH+bounds.x,
                   -STAGE_WIDTH+bounds.y,
                   (2*STAGE_WIDTH+STAGE_WIDTH)+bounds.width,
                   2*STAGE_WIDTH+bounds.height);
    }

    spacebounce.Planet = Planet;

}(spacebounce));
