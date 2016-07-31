/*
 *The antimatter orb is a particle that depletes the player's energy by a certain amount when contacted.
 */
(function (spacebounce) {

    function AntimatterOrb(parentContainer, physicsContext) {
        this.initialize(parentContainer, physicsContext);
    }

    var p = AntimatterOrb.prototype = new createjs.Shape();
    p.parentContainer;
    p.radius;
    p.color;

    p.vx;
    p.vy;

    p.markedForRemoval;

    p.Shape_initialize = p.initialize;

    p.initialize = function(parentContainer, physicsContext) {

        this.Shape_initialize();
        this.parentContainer = parentContainer;
        this.radius = 5;

        //set a random direction for the orb to move
        var angle = Math.random()*(2*Math.PI);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);

        //set the initial position based on this velocity so the orb floats across the stage
        if ((Math.random()*(STAGE_WIDTH+STAGE_HEIGHT))>STAGE_WIDTH) {
            //position on left or right
            if (this.vx > 0)
                this.x = -this.radius;
            else
                this.x = this.radius + STAGE_WIDTH;
            //position randomly along other dimension
            if (this.vy > 0)
                this.y = Math.random() * STAGE_HEIGHT / 2;
            else
                this.y = Math.random() * STAGE_HEIGHT / 2 + STAGE_HEIGHT / 2;
        }
        else {
            //position on top or bottom
            if (this.vy > 0)
                this.y = -this.radius;
            else
                this.y = this.radius + STAGE_HEIGHT;

            //position randomly along other dimension
            if (this.vx > 0)
                this.x = Math.random() * STAGE_WIDTH / 2;
            else
                this.x = Math.random() * STAGE_WIDTH / 2 + STAGE_WIDTH / 2;
        }

        this.color = "red";
        this.alpha = 0.6;
        this.graphics.beginFill(this.color).drawCircle(0, 0, this.radius).endFill();

        this.parentContainer.addChild(this);

        //box2d properties
        this.density = 1;
        //this.friction = 1;
        this.restitution = 0.8;
        this.isSensor = true;
        this.allowSleep = false;
        this.velocityIsLinear = true;
        this.bodyType = Box2D.Dynamics.b2Body.b2_kinematicBody;
        physicsContext.createCircularPhysicsBody(this);
    }

    p.tick = function() {
    }


    p.terminate = function() {
        createjs.Tween.get(this).to({scaleX: 0, scaleY: 0}, 300, createjs.Ease.bounceIn).call(function() {
            this.parentContainer.removeChild(this); //this function runs on completion of the tween
        });
    }

    p.getClassName = function() {
      return AntimatterOrb.name;
    }

    spacebounce.AntimatterOrb = AntimatterOrb;

}(spacebounce));
