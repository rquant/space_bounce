/*
 *The space capsule. While the player isn't technically the capsule, the capsule ultimately determines the state of the game
 * (completed, gameover) so it is designated as the player.
 */
(function (spacebounce) {

    function Player(parentContainer, physicsContext) {
        this.initialize(parentContainer, physicsContext);
    }
    var config = spacebounce.config;

    var p = Player.prototype = new createjs.Container();

    p.parentContainer;
    p.energySupply; //if this runs out the game will end
    p.maxEnergy;
    //properties of the capsule
    p.capsule_radius;
    p.capsule_color;

    p.respawnOnTermination;

    p.Container_initialize = p.initialize;

    p.initialize = function(parentContainer, physicsContext) {

      playerActive = true;

      this.Container_initialize();

      this.parentContainer = parentContainer;
      this.energySupply = this.maxEnergy = config.gameplay.maxPlayerEnergy;

      this.capsule_radius = config.gameplay.playerRadius;
      this.capsule_color = "#b3b3b3";
      var capsule = new createjs.Shape();
      capsule.alpha = 1;
      capsule.graphics.beginFill(this.capsule_color).drawCircle(
        0, 0, this.capsule_radius
      ).endFill();


      this.x = config.stage.width / 2;
      this.y = -this.capsule_radius;

      this.addChild(capsule);

      var lines = 6;
      for(i=0; i<lines; i++) {
        var l1 = new createjs.Shape();
        l1.graphics.setStrokeStyle(0.2);
        l1.graphics.beginStroke('#404040');
        l1.graphics.moveTo(0, 0);

        var theta = (i/lines) * (2*Math.PI);
        var endX = this.capsule_radius * Math.cos(theta);
        var endY = this.capsule_radius * Math.sin(theta);
        l1.graphics.lineTo(endX, endY);
        l1.graphics.endStroke();

        this.addChild(l1);
      }


      var blurFilter = new createjs.BlurFilter(2, 2, 2);

      var color = 0xffffff;
      var alpha = 1;
      var blurX = 16;
      var blurY = 16;
      var strength = 1;
      var quality = 4;
      var inner = true;
      var knockout = false;
      var glowFilter = new createjs.GlowFilter(
        color, alpha, blurX, blurY, strength, quality, inner, knockout
      );


      capsule.filters = [blurFilter, glowFilter];
      capsule.cache(-this.capsule_radius, -this.capsule_radius, this.capsule_radius * 2, this.capsule_radius * 2);



      // TODO: ugly!! find a better way
      if(parentContainer) {
        parentContainer.addChild(this);
      }

      this.respawnOnTermination = false;

      //box2d properties
      this.radius = this.capsule_radius;
      this.density = 50;
      //this.friction = 1;
      this.restitution = 1;
      this.isSensor = false;
      this.allowSleep = false;
      this.terminateWithTween = false;
      this.velocityIsLinear = false;
      this.bodyType = Box2D.Dynamics.b2Body.b2_dynamicBody;
      //create the physics body for the player and map the display object to it
      physicsContext.createCircularPhysicsBody(this);
    }

    //increase the player's energy by a specified amount
    p.increaseEnergySupply = function() {
      const ENERGY_ORB_VAL = config.gameplay.energyOrbVal;
        if (this.energySupply + ENERGY_ORB_VAL > this.maxEnergy)
            this.energySupply = this.maxEnergy;
        else this.energySupply += ENERGY_ORB_VAL;
    }

    //decrease the player's energy by a specified amount
    p.decreaseEnergySupply = function() {
        this.energySupply -= config.gameplay.antimatterOrbVal;
    }

    p.tick = function() {
      if(this.energySupply >= 0)
        this.energySupply--;
      else amplify.publish('player-energy-depleted');
    }

    p.terminate = function() {
         playerActive = false;
        this.parentContainer.removeChild(this);
    }

    p.getClassName = function() {
      return Player.name;
    }

    spacebounce.Player = Player;

}(spacebounce));
