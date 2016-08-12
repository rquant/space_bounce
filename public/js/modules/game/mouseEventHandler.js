/*
 * The mouse handler is responsible for handling all mouse interactions
   during gameplay.

   TODO: This mouse handler should probably be decoupled from actual gameplay logic.
   It could solely be responsible for capturing coordinates and other data
   related to user input, and then publishing it to a submodule of the game
   state. Careful consideration of the effect on performance must be considered
   however as user input must be very responsive.
 */
spacebounce.game.mouseEventHandler = (function (game) {
    var config = spacebounce.config;
    const MAX_FORCE_FIELD_LENGTH = config.gameplay.maxForceFieldLength;
    const BOUNDARY_THICKNESS = 3;
    var stage = game.stage;
    var canvas = game.canvas;
    var b2Context = spacebounce.box2dContext;
    var forceFieldContainer = game.containers.forceFields;

    // indicates if the stage's mouse events should be fired. Disabled when
    // user's mouse is over buttons
    stage.fireMouseEvent = true;

    var a = new createjs.Point(0, 0); //the point of user's initial mouse down
    var b = new createjs.Point(0, 0); //the point of user's mouse release

    // get the point of the user's intitial click
    function handleStageMouseDown(event) {
      if (stage.fireMouseEvent) {
           a.x = event.stageX;
           a.y = event.stageY;

           // there should only be one force field body present at a time
           // during gameplay
           for(var i=0; j=forceFieldContainer.children.length, i < j; i++) {
             forceFieldContainer.children[i].markedForRemoval = true;
           }
      }
    }

    //t rack the user's mouse movement so the force field can be traced as it is
    // being created
    function handlePressMove(event) {
        if(stage.fireMouseEvent) {
            b.x = event.stageX;
            b.y = event.stageY;

            var length = Math.sqrt(Math.pow((a.x-b.x),2)+Math.pow((a.y-b.y),2));
            if(length <= 0) return;
            if (length > MAX_FORCE_FIELD_LENGTH)
                trimForceFieldLength();
            createForceField(true);
        }
    }

    function handleMouseUp(event) {
        if (stage.fireMouseEvent) {
            b.x = event.stageX;
            b.y = event.stageY;

            var length = Math.sqrt(Math.pow((a.x-b.x),2)+Math.pow((a.y-b.y),2));
            if (length <= 0) return;
            if (length > MAX_FORCE_FIELD_LENGTH)
               trimForceFieldLength();
            createForceField(false);
        }
    }

    // the forcefield is created along the straight path of the user's initial
    // click and final release
    function createForceField(tracingMode) {
        var length = Math.sqrt(Math.pow((a.x-b.x),2)+Math.pow((a.y-b.y),2));
        var height = BOUNDARY_THICKNESS;
        var m = ((b.y-a.y)/(b.x-a.x));
        var angle = -(2*Math.PI - Math.atan(m)) * (180/Math.PI);

        var x = (a.x+b.x)/2;
        var y = (a.y+b.y)/2;

        var properties = {
          x: x,
          y: y,
          length: length,
          angle: angle
        };

        return new spacebounce.ForceField(
          forceFieldContainer, properties, b2Context, tracingMode
        );
    }

    // This keeps the force field from being drawn longer than it's max length
    // while allowing the player to freely mouse around the stage
    function trimForceFieldLength() {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var m = (dy/dx);

        var angle = Math.atan(m);
        if (dx>0) {
             b.x = a.x + (MAX_FORCE_FIELD_LENGTH * Math.cos(angle));
             b.y = a.y + (MAX_FORCE_FIELD_LENGTH * Math.sin(angle));
        }
        else {
            b.x = a.x - (MAX_FORCE_FIELD_LENGTH * Math.cos(angle));
            b.y = a.y - (MAX_FORCE_FIELD_LENGTH * Math.sin(angle));
        }
    }

    amplify.subscribe('game-active', function() {
      stage.addEventListener("stagemousedown", handleStageMouseDown);
      stage.addEventListener("pressmove", handlePressMove);
      stage.addEventListener("stagemouseup", handleMouseUp);
    });

    amplify.subscribe('game-inactive', function() {
      stage.removeAllEventListeners();
      canvas.removeEventListener("mouseup", handleMouseUp);
    });

})(spacebounce.game || {});
