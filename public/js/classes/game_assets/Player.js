/*
 * The space capsule that represents the player.
 */
(function (spacebounce) {

    function Player(physicsContext) {
        this.initialize(physicsContext);
    }
    var config = spacebounce.config;

    var p = Player.prototype = new createjs.Container();

    p.energySupply; //if this runs out the game will end
    p.maxEnergy;
    //properties of the capsule
    p.radius;
    p.capsule_color;

    p.respawnOnTermination;

    p.Container_initialize = p.initialize;

    p.initialize = function(physicsContext) {
      this.Container_initialize();
      this.energySupply = this.maxEnergy = config.gameplay.maxPlayerEnergy;

      this.radius = config.gameplay.playerRadius;
      this.capsule_color = "#b3b3b3";
      var capsule = new createjs.Shape();
      capsule.alpha = 1;
      capsule.graphics.beginFill(this.capsule_color).drawCircle(
        0, 0, this.radius
      ).endFill();


      this.x = config.stage.width / 2;
      this.y = -this.radius;

      this.addChild(capsule);

      // radial lines drawn to make object appear more like a space capsule
      // rather than just a circle, and shows rotation of object
      var lines = 8;
      for(i=0; i<lines; i++) {
        var l = new createjs.Shape();
        l.graphics.setStrokeStyle(0.2);
        l.graphics.beginStroke('#404040');
        l.graphics.moveTo(0, 0);

        var theta = (i/lines) * (2*Math.PI);
        var endX = this.radius * Math.cos(theta);
        var endY = this.radius * Math.sin(theta);
        l.graphics.lineTo(endX, endY);
        l.graphics.endStroke();

        this.addChild(l);
      }

      this.respawnOnTermination = false;

      // box2d properties
      this.radius = this.radius;
      this.density = 50;
      this.restitution = 1;
      this.isSensor = false;
      this.allowSleep = false;
      this.velocityIsLinear = false;
      this.bodyType = Box2D.Dynamics.b2Body.b2_dynamicBody;
      //create the physics body for the player and map the display object to it
      physicsContext.createCircularPhysicsBody(this);
    }

    // increase the player's energy by the configured amount
    p.increaseEnergySupply = function(energyVal) {
        if (this.energySupply + energyVal > this.maxEnergy)
            this.energySupply = this.maxEnergy;
        else this.energySupply += energyVal;
    }

    //decrease the player's energy by a configured amount
    p.decreaseEnergySupply = function(energyVal) {
        this.energySupply -= energyVal;
    }

    p.tick = function() {
      if(this.energySupply >= 0)
        this.energySupply--;
      else amplify.publish('player-energy-depleted');
    }

    p.terminate = function() {
        try {
          this.parent.removeChild(this);
        }
        catch(err) {
          console.log(err);
        }
    }

    p.getClassName = function() {
      return Player.name;
    }

    spacebounce.Player = Player;

}(spacebounce));
