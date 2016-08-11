/*
  The energy orb is a particle that restores the player's energy by a certain
  amount when contacted.
 */
(function (spacebounce) {

    function EnergyOrb(physicsContext, energyVal) {
        this.initialize(physicsContext, energyVal);
    }
    var config = spacebounce.config;
    const BOUNDS = config.stage.boundary;
    const STAGE_WIDTH = config.stage.width;
    const STAGE_HEIGHT = config.stage.height;

    var p = EnergyOrb.prototype = new createjs.Shape();
    p.radius;
    p.color;

    p.vx;
    p.vy;

    p.energyVal;

    p.Shape_initialize = p.initialize;

    p.initialize = function(physicsContext, energyVal) {
        this.Shape_initialize();
        this.energyVal = energyVal;
        this.radius = 8;

        // set a random direction for the orb to move
        var angle = Math.random()*(2*Math.PI);
        this.vx = Math.cos(angle) * 2;
        this.vy = Math.sin(angle) * 2;

        // set the initial position based on this velocity so the orb floats
        // across the stage
        if ((Math.random()*(STAGE_WIDTH + STAGE_HEIGHT))> STAGE_WIDTH) {
            //position on left or right
            if (this.vx > 0)
                this.x = -this.radius;
            else
                this.x = this.radius + STAGE_WIDTH;
            // position randomly along other dimension
            if (this.vy > 0)
                this.y = Math.random() * STAGE_HEIGHT / 2;
            else
                this.y = Math.random() * STAGE_HEIGHT / 2 + STAGE_HEIGHT / 2;
        }
        else {
            // position on top or bottom
            if (this.vy > 0)
                this.y = -this.radius;
            else
                this.y = this.radius + STAGE_HEIGHT;

            // position randomly along other dimension
            if (this.vx > 0)
                this.x = Math.random() * STAGE_WIDTH / 2;
            else
                this.x = Math.random() * STAGE_WIDTH / 2 + STAGE_WIDTH / 2;
        }


        this.color = "#66F0B9";
        this.alpha = 0.6;
        this.graphics.beginFill(this.color).drawCircle(0, 0, this.radius).endFill();

        //box2d properties
        this.density = 1;
        this.restitution = 0.8;
        this.isSensor = true;
        this.allowSleep = false;
        this.bodyType = Box2D.Dynamics.b2Body.b2_kinematicBody;
        this.velocityIsLinear = true;

        this.markedForRemoval = false;
        this.enteredStage = false;

        physicsContext.createCircularPhysicsBody(this);
    }

    /*
      if orb is outside stage (after already entering it), it is ready to be
      removed. Ideally, it would be nice to use a box2d sensor rather than
      manually check every step, but they don't work with kinematic bodies
      such as this unfortunately.
    */
    p.tick = function() {
      if (this.x<-BOUNDS || this.x>STAGE_WIDTH+BOUNDS ||
          this.y<-BOUNDS || this.y>STAGE_HEIGHT+BOUNDS) {
         if (this.enteredStage) {
           this.markedForRemoval = true;
         }
      }
      else this.enteredStage = true;
    }

    p.terminate = function() {
      try {
        createjs.Tween.get(this).to(
          {scaleX: 0, scaleY: 0}, 300, createjs.Ease.bounceIn
        ).call(function() {
          this.parent.removeChild(this);
        });
      } catch(err) {
        console.log(err);
      }

    }

    p.getClassName = function() {
      return EnergyOrb.name;
    }

    spacebounce.EnergyOrb = EnergyOrb;

})(spacebounce);
