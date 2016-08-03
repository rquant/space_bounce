/*
 *The star used in the background star field animation. Perceived distance is random.
 */
(function (spacebounce) {

    function Star() {
        this.initialize();
    }
    var config = spacebounce.config;
    var p = Star.prototype = new createjs.Shape();

    //public properties
    p.radius;
    p.vY; //Velocity Y
    p.color;

    //constructor
    p.Shape_initialize = p.initialize;
    var utils = spacebounce.utils;

    p.initialize = function() {

        //call super
        this.Shape_initialize();

        this.color = "white";

        this.x = Math.floor(Math.random() * config.stage.width);
        this.y = Math.floor(Math.random() * config.stage.height);

        /*
          To acheive a sense of depth, stars will be generated with a random
          radius and a proportionate velocity will be calculated. So slower,
          smaller stars will appear to be further away from the  user and vice
          versa.
        */
        const MIN_RADIUS = 0.3;
        const MAX_RADIUS = 0.7;
        const MIN_VELOCITY = 0.1;
        const MAX_VELOCITY = 0.7;

        var radius = utils.getRandomArbitrary(MIN_RADIUS, MAX_RADIUS);

        var radius_interval_length = MAX_RADIUS - MIN_RADIUS;
        var ratio = (radius - MIN_RADIUS) / radius_interval_length;
        var velocity_interval_length = MAX_VELOCITY-MIN_VELOCITY;
        var vY = ratio * velocity_interval_length + MIN_VELOCITY;
        this.vY = vY;
        this.radius = radius;

        //draw the star as a circle
        this.graphics.beginFill(this.color).drawCircle(0,0,this.radius);
    }

    p.tick = function() {
        this.y += this.vY;
    }

    spacebounce.Star = Star;

}(spacebounce));
