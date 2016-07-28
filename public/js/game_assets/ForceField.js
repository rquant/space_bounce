/*
 *Creates a static body that deflects the player's capsule, allowing the user to move it around
 */
(function (spacebounce) {

    }

    var p = ForceField.prototype = new createjs.Shape();
    p.parentContainer;
    p.width;
    p.height;
    p.color;

    p.respawnOnTermination;

    p.Shape_initialize = p.initialize;


        this.Shape_initialize();

        this.parentContainer = parentContainer;
        this.width = width;
        this.height = height;
        this.regX = width/2;
        this.regY = height/2;
        this.x = x;
        this.y = y;

        this.color = "pink";
        this.alpha = 0.2;
        this.rotation = angle;
        this.graphics.beginFill(this.color).drawRect(0, 0, this.width, this.height).endFill();

        // only one force field should be present at a time
        this.parentContainer.removeAllChildren();
        this.parentContainer.addChild(this);

        //box2d properties
        this.density = 20;
        this.friction = 1;
        this.restitution = 0.8;
        this.isSensor = false;
        this.bodyType = b2Body.b2_staticBody;

        /*if tracing mode is on, the user is currently dragging the mouse to create the forcefield. The display drawn simply
          allows the user to trace its path visually. The actual force field body should not be created until the user has
          released mouse-press event*/
        if (!tracingMode) {
            this.alpha = 0.4;
            box2d.createPolygonalPhysicsBody(this);
        }

    }
    p.collisionCallback = function() {
        createjs.Tween.get(this, {loop:false}).to({alpha:1}, 100, createjs.Ease.quadIn)
        .to({alpha:0.4}, 100, createjs.Ease.quadIn).call(function () {
            p.terminate();
        });

    }
    p.terminate = function() {
        createjs.Tween.get(this, {loop:false}).to({alpha:1}, 100, createjs.Ease.quadIn)
        .to({alpha:0.4}, 100, createjs.Ease.quadIn).call(function () {
        });
    }
