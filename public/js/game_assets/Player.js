/*
 *The space capsule. While the player isn't technically the capsule, the capsule ultimately determines the state of the game
 * (completed, gameover) so it is designated as the player.
 */
(function (spacebounce) {

    function Player(parentContainer) {
        this.initialize(parentContainer);
    }

    var p = Player.prototype = new createjs.Container();
    p.parentContainer;
    p.energySupply; //used for determining state of the game

    //properties of the capsule
    p.capsule_radius;
    p.capsule_color;

    //properties of port on the capsule
    p.port_radius;
    p.port_color;


    p.respawnOnTermination;

    p.Container_initialize = p.initialize;

    p.initialize = function(parentContainer) {

      playerActive = true;

      this.Container_initialize();

      this.parentContainer = parentContainer;

      this.energySupply = MAX_ENERGY;
      this.capsule_radius = PLAYER_RADIUS;
      this.capsule_color = "#E6E6E6";
      var capsule = new createjs.Shape();
      capsule.alpha = 1;
      capsule.graphics.beginFill(this.capsule_color).drawCircle(0, 0, this.capsule_radius).endFill();

      this.port_radius = PLAYER_RADIUS/3;
      this.port_color = "#FF8533";
      var port = new createjs.Shape();
      port.alpha = 1;
      capsule.graphics.beginFill(this.port_color).drawCircle(0, 0, this.port_radius).endFill();

      this.x = STAGE_WIDTH/2;
      this.y = -3 * this.port_radius;

      this.addChild(capsule, port);
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
      this.bodyType = Box2D.Dynamics.b2Body.b2_dynamicBody;
      spacebounce.box2dModule.createCircularPhysicsBody(this); //create the phsysics body for the player and map the display object to it

    }

    //increase the player's energy by a specified amount
    p.increaseEnergySupply = function() {
        if (this.energySupply + ENERGY_ORB_VAL > MAX_ENERGY)
            this.energySupply = MAX_ENERGY;
        else this.energySupply += ENERGY_ORB_VAL;
    }

    //decrease the player's energy by a specified amount
    p.decreaseEnergySupply = function() {
        this.energySupply -= ANTIMATTER_ORB_VAL;
    }

    p.collisionCallback = function() {
    }

    p.terminate = function() {
         playerActive = false;
        this.parentContainer.removeChild(this);
    }

    spacebounce.Player = Player;

}(spacebounce));
