/*
 *The star used in the background star field animation. Perceived distance is random.
 */
(function (spacebounce) {

    function Star() {
        this.initialize();
    }

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

        this.x = Math.floor(Math.random()*STAGE_WIDTH);
        this.y = Math.floor(Math.random()*STAGE_HEIGHT);

        //get arbitrary radius within the specified interval
        var radius = utils.getRandomArbitrary(MIN_STAR_RADIUS, MAX_STAR_RADIUS);
        this.radius = radius;

        /*get the velocity that is proportionate to the radius and is within velocity range.
         *this effect makes closer stars move faster in relation to the user, while farther ones move slower.
         */
        var radius_interval_length = MAX_STAR_RADIUS - MIN_STAR_RADIUS;
        var ratio = (radius - MIN_STAR_RADIUS) / radius_interval_length;
        var velocity_interval_length = MAX_STAR_VELOCITY-MIN_STAR_VELOCITY;
        var vY = ratio * velocity_interval_length + MIN_STAR_VELOCITY;
        this.vY = vY;

        //draw the star as a circle
        this.graphics.beginFill(this.color).drawCircle(0,0,this.radius);
    }


    p.tick = function() {
        this.y += this.vY;
    }

    spacebounce.Star = Star;

}(spacebounce));
