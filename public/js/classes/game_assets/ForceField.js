/*
 *Creates a static body that deflects the player's capsule, allowing the user to move it around
 */
(function (spacebounce) {

    function ForceField(parentContainer, props, physicsContext, tracingMode) {
        this.initialize(parentContainer, props, physicsContext, tracingMode);
    }

    var p = ForceField.prototype = new createjs.Shape();
    p.parentContainer;
    p.width;
    p.height;
    p.color;

    p.respawnOnTermination;

    p.Shape_initialize = p.initialize;

    p.initialize = function(parentContainer, props, physicsContext, tracingMode) {

        this.Shape_initialize();

        this.parentContainer = parentContainer;
        this.width = props.width;
        this.height = props.height;
        this.regX = this.width/2;
        this.regY = this.height/2;
        this.x = props.x;
        this.y = props.y;

        this.color = "pink";
        this.alpha = 0.2;
        this.rotation = props.angle;
        this.graphics.beginFill(this.color).drawRect(0, 0, this.width, this.height).endFill();

        // only one force field should be present at a time
        this.parentContainer.removeAllChildren();
        this.parentContainer.addChild(this);

        //box2d properties
        this.density = 20;
        this.friction = 1;
        this.restitution = 0.8;
        this.isSensor = false;
        this.bodyType = Box2D.Dynamics.b2Body.b2_staticBody;

        /*if tracing mode is on, the user is currently dragging the mouse to create the forcefield. The display drawn simply
          allows the user to trace its path visually. The actual force field body should not be created until the user has
          released mouse-press event*/
        if (!tracingMode) {
            this.alpha = 0.4;
            physicsContext.createPolygonalPhysicsBody(this);
        }

    }

    p.tick = function() {

    }

    p.terminate = function() {


      createjs.Tween.get(
        this, {loop:false}).to({alpha:1}, 100, createjs.Ease.quadIn
      ).to({alpha:0.4}, 100, createjs.Ease.quadIn).call(function () {
          this.parentContainer.removeChild(this);
      });
    }

    p.getClassName = function() {
      return ForceField.name;
    }

    spacebounce.ForceField = ForceField;

}(spacebounce));
