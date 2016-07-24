/*
 *This file defines the Box2D instance used to incorporate physics in the game
 */
//box2d library refs
$(document).ready(function() {

    var STEP = FPS, TIMESTEP = 1/STEP; //the timestep dictates how many updates box2d will perform per second. Must match framerate.
    var SCALE = 30; //the scale used to convert between pixels and meters. Box2D measures distance in the world in meters not pixels.

    spacebounce.box2dContext = (function(box2dContext) {

      var b2Vec2 = Box2D.Common.Math.b2Vec2
              , b2BodyDef = Box2D.Dynamics.b2BodyDef
              , b2Body = Box2D.Dynamics.b2Body
              , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
              , b2Fixture = Box2D.Dynamics.b2Fixture
              , b2World = Box2D.Dynamics.b2World
              , b2MassData = Box2D.Collision.Shapes.b2MassData
              , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
              , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
              , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
              , b2ContactListener = Box2D.Dynamics.b2ContactListener
                ;

        var world;
        var actors = [];
        var bodies = [];
        var orbBodies = [];
        var forceFieldBodies = [];
        var playerActor;
        var bodiesToRemove = [];

        //Sets up the box2d world
        function setup() {
          var debugCanvas = $("#debugCanvas")[0];
          var debugContext = debugCanvas.getContext("2d");
          world = new b2World(new b2Vec2(GRAVITY_X, GRAVITY_Y), true);
          addDebug(debugContext);
          world.SetContactListener(contactListener);

          //setup boundary sensors. Used to detect when objects have left the bounds of the stage
          createSensor(0, STAGE_HEIGHT/2, 1 / SCALE, STAGE_HEIGHT * 30); //left sensor
          createSensor(STAGE_WIDTH, STAGE_HEIGHT / 2, 1, STAGE_HEIGHT * 30); //right sensor
          createSensor(STAGE_WIDTH/ 2, STAGE_HEIGHT, STAGE_WIDTH/ 2, 1); //bottom sensor
        }

        //setup a seperate box2d world for the bouncing player demo in the box2d demonstration page. Not used for the game.
        function demoSetup() {
            var debugCanvas = $("#debugCanvas")[0];
            var debugContext = debugCanvas.getContext("2d");
            world = new b2World(new b2Vec2(2, GRAVITY_Y), true);
            addDebug(debugContext);
            createStaticBoundary(BOX2D_DEMO_WIDTH/2, BOX2D_DEMO_HEIGHT, BOX2D_DEMO_WIDTH, BOX2D_DEMO_HEIGHT);
            createStaticBoundary(BOX2D_DEMO_WIDTH, BOX2D_DEMO_HEIGHT/2, 1, BOX2D_DEMO_HEIGHT);

        }

        // box2d debugger
        function addDebug(debugContext) {
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(debugContext);
            debugDraw.SetDrawScale(SCALE);
            debugDraw.SetFillAlpha(0.7);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            world.SetDebugDraw(debugDraw);
        }

        //creates an invisible static boundary to keep our bodies in place (currently only used for demo-purposes)
        function createStaticBoundary(x, y, width, height) {
            var fixture = new b2FixtureDef;
            fixture.density = 1;
            fixture.restitution = 0.8;
            fixture.shape = new b2PolygonShape;
            fixture.shape.SetAsBox(width/2/SCALE, height/2/SCALE);
            var bodyDef = new b2BodyDef;
            bodyDef.type = b2Body.b2_staticBody;
            bodyDef.position.x = x/SCALE;
            bodyDef.position.y = y/SCALE;
            var body = world.CreateBody(bodyDef);
            body.CreateFixture(fixture);
        }

        /*
         * Creates a static sensor that only detects when a body has triggered it. Does not effect the physics of the body.
         */
        function createSensor(x, y, width, height) {
            var sensorFixture = new b2FixtureDef;
            sensorFixture.shape = new b2PolygonShape;
            sensorFixture.isSensor = true;
            sensorFixture.shape.SetAsBox(width/SCALE, height/SCALE);
            var sensorBodyDef = new b2BodyDef;
            sensorBodyDef.type = b2Body.b2_staticBody;
            sensorBodyDef.position.x = x/SCALE;
            sensorBodyDef.position.y = y/SCALE;
            var sensor = world.CreateBody(sensorBodyDef);
            sensor.CreateFixture(sensorFixture);
            //this is a temporary fix. change the way it is implemented.
            var userData = new StaticActorObject(sensor, new spacebounce.Sensor());
            sensor.SetUserData(userData);
        }


        // Creates a polygonal physics body for an object, and assigns an actor object to bind the two together.
        function createPolygonalPhysicsBody(object) {
            var fixture = new b2FixtureDef;
            fixture.density = object.density;
            fixture.restitution = object.restitution;
            fixture.isSensor = object.isSensor;
            fixture.shape = new b2PolygonShape;
            fixture.shape.SetAsBox(object.width/2/SCALE, object.height/2/SCALE);
            var bodyDef = new b2BodyDef;
            bodyDef.type = object.bodyType;
            bodyDef.position.x = object.x/SCALE;
            bodyDef.position.y = object.y/SCALE;
            var body = world.CreateBody(bodyDef);
            body.CreateFixture(fixture);
            body.SetAngle(object.rotation * (Math.PI/180));
            var actor = new actorObject(body, object);
            body.SetUserData(actor);
            actors.push(actor);
            bodies.push(body);
        }

        // Creates a circular physics body for an object, and assigns an actor object to bind the two together.
         function createCircularPhysicsBody(object) {
            var fixture = new b2FixtureDef;
            fixture.density = object.density;
            fixture.restitution = object.restitution;
            fixture.isSensor = object.isSensor;
            fixture.shape = new b2CircleShape(object.radius / SCALE);;
            var bodyDef = new b2BodyDef;
            bodyDef.type = object.bodyType;
            bodyDef.position.x = object.x/SCALE;
            bodyDef.position.y = object.y/SCALE;
            bodyDef.allowSleep = object.allowSleep;
            var body = world.CreateBody(bodyDef);
            body.CreateFixture(fixture);
            body.SetAngle(object.rotation * (Math.PI/180));
            var actor = new actorObject(body, object);
            body.SetUserData(actor);
            actors.push(actor);

            //if the object is an orb type, it needs a linear velocity
            if (object.velocityIsLinear) {
                orbBodies.push(body);
                body.SetLinearVelocity(new b2Vec2(object.vx , object.vy));
            }
            else bodies.push(body);
        }

        //create an actor object that maps the physics body to the game object (display, position, rotation, ect.)
        function actorObject(body, object) {
            this.body = body;
            this.object = object;
            this.type = object.type;

            this.enteredStage = false; //determines if a kinematic body has entered the stage

            this.update = function() {
                this.object.rotation = this.body.GetAngle() * (180/Math.PI);
                this.object.x = this.body.GetWorldCenter().x * SCALE;
                this.object.y = this.body.GetWorldCenter().y * SCALE;
            }

            this.getType = function() {
                return this.type;
            }

            this.getBody = function() {
                return this.body;
            }

            this.getObject = function() {
                return this.object;
            }

            this.enteredStage = function() {
                return this.enteredStage;
            }
        }

        // TODO: this is only necessary because other bodies with createjs objects
        // mapped to it use the same interface. Implement interfaces to ensure
        // the right methods are exposed
        function StaticActorObject(body, object) {
          this.body = body;
          this.object = object;

          this.getObject = function() {
            return this.object;
          }
        }

        //terminates the object of the actor and removes the actor
        function removeActor(actor) {
            actor.object.terminate();
            actors.splice(actors.indexOf(actor),1);
        }

        //Listeners
        //collision detection listener
        var contactListener = new b2ContactListener;

        //triggered when collision begins
        // TODO: Massive dependencies here. This might be a use case for pub/sub
        // pattern. For example, the player would subsribe to service to determine
        // if energy supply should be increased. EnergyOrb would publish this notice when contact
        // event is fired.
        contactListener.BeginContact = function(contact) {

            var userDataA = contact.GetFixtureA().GetBody().GetUserData(); //the actor of body A
            var userDataB = contact.GetFixtureB().GetBody().GetUserData(); //the actor of body B

            // TODO:
            //player contacts force field, remove the force field
            if (userDataA.getObject() instanceof ForceField) {
                createjs.Sound.play("Bounce");
                bodiesToRemove.push(userDataA.getBody());
            }

            //player contacts the energy orb, increase player's energy supply and remove the orb

            // TODO: these two cases are the same for the object, but object could be assigned to either fixutre
            if (userDataA.getObject() instanceof EnergyOrb) {
                player.increaseEnergySupply();
                createjs.Sound.play("Absorb");
                bodiesToRemove.push(userDataA.getBody())
            }

            else if (userDataB.getObject() instanceof EnergyOrb) {
                player.increaseEnergySupply();
                createjs.Sound.play("Absorb");
                bodiesToRemove.push(userDataB.getBody());
            }

            //player contacts the antimatter orb, decrease player's energy supply and remove the orb
            // TODO: same thing here...
            else if (userDataA.getObject() instanceof AntimatterOrb) {
                player.decreaseEnergySupply();
                createjs.Sound.play("Absorb");
                bodiesToRemove.push(userDataA.getBody())
            }

            else if (userDataB.getObject() instanceof AntimatterOrb) {
                player.decreaseEnergySupply();
                createjs.Sound.play("Absorb");
                bodiesToRemove.push(userDataB.getBody());
            }
        }

        //triggered after collision ends
        contactListener.EndContact = function(contact) {
             var userDataA = contact.GetFixtureA().GetBody().GetUserData();
             var userDataB = contact.GetFixtureB().GetBody().GetUserData();
             var objectAType = userDataA.getObject().getClassName();
             var objectBType = userDataB.getObject().getClassName();
             var mediator = spacebounce.box2dContext.contactMediator;
             var topicToPublish = mediator.endContact(
               objectAType, objectBType
             );
             amplify.publish(topicToPublish);
         }

         contactListener.PostSolve = function(contact, impulse) {

         }

        //if a body is enqued for removal, it must be reoved from the box2d world as well as its actor object
        function removeBodiesMarkedForRemoval() {
            //remove any bodies marked for removal
            for(var i=0, l=bodiesToRemove.length;i<l;i++) {
                var body = bodiesToRemove[i];
                var actor = body.GetUserData();
                var type = actor.getType();
                removeActor(actor);

                //if the object is an orb it must be removed from the array of orbs
                if (actor.getObject() instanceof EnergyOrb || actor.getObject() instanceof AntimatterOrb) {
                    orbBodies.splice(orbBodies.indexOf(body),1);
                }

                else bodies.splice(bodies.indexOf(body), 1);

                //body.SetUserData(null); //must eventually use a callback for this to so it becomes asynchronous
                world.DestroyBody(body);
            }
            bodiesToRemove = [];
        }

        //handle each step of the simulation
        function update() {
            world.Step(TIMESTEP, 12, 10);
            world.DrawDebugData();
            world.ClearForces();

            removeBodiesMarkedForRemoval();

            //update the actors
            for(var i=0;i<actors.length;i++)
                actors[i].update();

            //enque any orbs marked for removal to be removed
            for(var i=0;i<orbBodies.length;i++) {
                var orb = orbBodies[i];
                var x = orb.GetPosition().x*SCALE;
                var y = orb.GetPosition().y*SCALE;
                var actor = orb.GetUserData();

                if (x<-BOUNDS || x>STAGE_WIDTH+BOUNDS || y<-BOUNDS || y>STAGE_HEIGHT+BOUNDS) {
                   if (actor.enteredStage()) {
                        bodiesToRemove.push(orb);
                   }
                }
                else orb.enteredStage = true;

            }
        }

        //return the box2d world
        function getWorld() {
            return world;
        }

        //eunque all box2d bodies for removal
        function clearBodies() {
            for(var i=0;i<bodies.length;i++)
                bodiesToRemove.push(bodies[i]);
            for(var i=0;i<orbBodies.length;i++)
                bodiesToRemove.push(orbBodies[i]);
        }

        //remove any forcefields on the stage
        function clearForceFields() {
            for (var i=0;i<bodies.length;i++) {
                if (bodies[i].GetUserData().getObject() instanceof ForceField) {
                    var body = bodies[i];
                    bodiesToRemove.push(body);
                }
            }
        }



        return {
            setup: setup,
            demoSetup: demoSetup,
            createPolygonalPhysicsBody: createPolygonalPhysicsBody,
            createCircularPhysicsBody: createCircularPhysicsBody,
            actorObject: actorObject,
            update: update,
            removeActor: removeActor,
            clearForceFields: clearForceFields,
            clearBodies : clearBodies,
            getWorld: getWorld,
        }


    })(spacebounce.box2dContext);
});
