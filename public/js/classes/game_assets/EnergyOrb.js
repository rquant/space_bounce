/*
 *The energy orb is a particle that restores the player's energy by a certain amount when contacted.
 */
(function (spacebounce) {

    function EnergyOrb(parentContainer, physicsContext) {
        this.initialize(parentContainer, physicsContext);
    }

    var p = EnergyOrb.prototype = new createjs.Shape();
    p.parentContainer;
    p.radius;
    p.color;

    p.vx;
    p.vy;

   // p.markedForRemoval;

    p.Shape_initialize = p.initialize;

    p.initialize = function(parentContainer, physicsContext) {

        this.Shape_initialize();
        this.parentContainer = parentContainer;
        this.radius = 8;

        //set a random direction for the orb to move
        var angle = Math.random()*(2*Math.PI);
        this.vx = Math.cos(angle) * 2;
        this.vy = Math.sin(angle) * 2;

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


        this.color = "#66F0B9";
        this.alpha = 0.6;
        this.graphics.beginFill(this.color).drawCircle(0, 0, this.radius).endFill();

        try {
          this.parentContainer.addChild(this);
        }
        catch(err) {
          throw new spacebounce.mainGame.Exception(err);
        }


        //box2d properties
        this.density = 1;
        this.restitution = 0.8;
        this.isSensor = true;
        this.allowSleep = false;
        this.bodyType = Box2D.Dynamics.b2Body.b2_kinematicBody;
        this.velocityIsLinear = true;

        this.markedForRemoval = false;
        this.enteredStage = false;
        this.terminateWithTween = false;


        physicsContext.createCircularPhysicsBody(this);
    }

    p.tick = function() {
      if (this.x<-BOUNDS || this.x>STAGE_WIDTH+BOUNDS || this.y<-BOUNDS || this.y>STAGE_HEIGHT+BOUNDS) {
         if (this.enteredStage) {
              this.markedForRemoval = true;
         }
      }
      else this.enteredStage = true;
    }

    p.terminate = function() {
      if(this.terminateWithTween) {
        createjs.Tween.get(this).to(
          {scaleX: 0, scaleY: 0}, 300, createjs.Ease.bounceIn
        ).call(function() {
          this.parentContainer.removeChild(this); //this function runs on completion of the tween
        });
      }
      else {
        this.parentContainer.removeChild(this);
      }
    }

    p.getClassName = function() {
      return EnergyOrb.name;
    }

    spacebounce.EnergyOrb = EnergyOrb;

})(spacebounce);
