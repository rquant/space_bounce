/*
 * The mouse handler is responsible for handling all mouse interactions within the game stage.
 */
spacebounce.mainGame.mouseEventHandler = (function (mainGame) {
        var game = spacebounce.game || {};
        var stage = game.stage;
        var canvas = game.canvas;
        var b2Context = spacebounce.box2dContext;

        stage.fireMouseEvent = true; //indicates if the stage's mouse events should be fired. Disabled when user's mouse is over buttons

        var a = new createjs.Point(0, 0); //the point of user's initial mouse down
        var b = new createjs.Point(0, 0); //the point of user's mouse release

        var forceField;

        //get the point of the user's intitial click
        function handleStageMouseDown(event) {
            if (stage.fireMouseEvent) {
                 a.x = event.stageX;
                 a.y = event.stageY;
            }
        }

        //track the user's mouse movement so the force field can be traced as it is being created
        function handlePressMove(event) {
            if(stage.fireMouseEvent) {
                b.x = event.stageX;
                b.y = event.stageY;

                var length = Math.sqrt(Math.pow((a.x-b.x),2)+Math.pow((a.y-b.y),2));
                if (length>MAX_FORCE_FIELD_LENGTH) {
                    trimForceFieldLength();
                }
                forceField = createForceField(true);
            }
        }

        //////for some reason this event even fires when clicked outside of stage, so coordinates must be checked.
        //hopefully this issue will be resolved by createjs support team.
        function handleMouseUp(event) {
            if (stage.fireMouseEvent) {
                b.x = event.clientX - canvas.offsetLeft + $(window).scrollLeft();
                b.y = event.clientY - canvas.offsetTop + $(window).scrollTop();


                var length = Math.sqrt(Math.pow((a.x-b.x),2)+Math.pow((a.y-b.y),2));
                if (length>MAX_FORCE_FIELD_LENGTH) {
                   trimForceFieldLength();
                }
                createForceField(false);
            }
        }

        //the forcefield is created along the straight path of the user's initial click and final release
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
              width: length,
              height: height,
              angle: angle
            }
            return new spacebounce.ForceField(
              mainGame.containers.forceFields, properties, b2Context, tracingMode
            );
        }

    //This keeps the force field from being drawn longer than it's max length while allowing the player to freely mouse around the stage
    function trimForceFieldLength() {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var m = (dy/dx);

        var angle = Math.atan(m);
        if (dx>0) {
             b.x =  a.x + (MAX_FORCE_FIELD_LENGTH * Math.cos(angle));
             b.y  = a.y + (MAX_FORCE_FIELD_LENGTH * Math.sin(angle));
        }
        else {
            b.x =  a.x - (MAX_FORCE_FIELD_LENGTH * Math.cos(angle));
            b.y  = a.y - (MAX_FORCE_FIELD_LENGTH * Math.sin(angle));
        }
    }

    amplify.subscribe('game-active', function() {
      stage.addEventListener("stagemousedown", handleStageMouseDown);
      stage.addEventListener("pressmove", handlePressMove);
      canvas.addEventListener("mouseup", handleMouseUp, false);
    });

    amplify.subscribe('game-inactive', function() {
      stage.removeAllEventListeners();
      canvas.removeEventListener("mouseup", handleMouseUp);
    });

}(spacebounce.mainGame));
