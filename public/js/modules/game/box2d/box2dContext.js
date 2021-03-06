spacebounce.box2dContext = (function(box2dContext) {
  var config = spacebounce.config;
  const STEP = config.framerate
  // dictates how many updates box2d will perform per second.
  const TIMESTEP = 1/STEP;
  // the scale used to convert between pixels and meters.
  // Box2D measures distance for the physics world in meters not pixels.
  const SCALE = 30;
  const GRAVITY_X = config.physics.gravityX;
  const GRAVITY_Y = config.physics.gravityY;
  const STAGE_WIDTH = config.stage.width;
  const STAGE_HEIGHT = config.stage.height;

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
    var forceFieldBodies = [];
    var bodiesToRemove = [];

    //Sets up the box2d world
    function init(debugCanvas) {
      var debugContext = debugCanvas.getContext("2d");
      world = new b2World(new b2Vec2(GRAVITY_X, GRAVITY_Y), true);
      addDebug(debugContext);
      world.SetContactListener(contactListener);

      /*
      setup boundary sensors. Used to detect when objects have left the bounds
      of the stage
      */

      //left sensor
      createSensor(0, STAGE_HEIGHT/2, 1 / SCALE, STAGE_HEIGHT * 30);
      //right sensor
      createSensor(STAGE_WIDTH, STAGE_HEIGHT / 2, 1, STAGE_HEIGHT * 30);
      //bottom sensor
      createSensor(STAGE_WIDTH/ 2, STAGE_HEIGHT, STAGE_WIDTH/ 2, 1);
    }

    // use seperate canvas for debugging
    function addDebug(debugContext) {
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(debugContext);
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.7);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    }

    // creates an invisible static boundary to keep our bodies in place
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
     * Creates a static sensor that only detects when a body has triggered it.
       Does not effect the physics of the body.
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


    // Creates a polygonal physics body for an object, and assigns an
    // actor object to bind the two together.
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
        var actor = new ActorObject(body, object);
        body.SetUserData(actor);
        actors.push(actor);
    }

    // Creates a circular physics body for an object, and assigns an actor
    // object to bind the two together.
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
        var actor = new ActorObject(body, object);
        body.SetUserData(actor);
        actors.push(actor);

        if (object.velocityIsLinear) {
            body.SetLinearVelocity(new b2Vec2(object.vx , object.vy));
        }
    }

    // create an actor object that maps the physics body to the game object
    // (display, position, rotation, ect.)
    function ActorObject(body, object) {
        this.body = body;
        this.object = object;
        this.type = object.type;

        // determines if a kinematic body has entered the stage
        this.enteredStage = false;

        this.update = function() {
            this.object.rotation = this.body.GetAngle() * (180/Math.PI);
            this.object.x = this.body.GetWorldCenter().x * SCALE;
            this.object.y = this.body.GetWorldCenter().y * SCALE;

            this.object.tick();
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

    // Creates an actor for a body that is static in the game world
    function StaticActorObject(body, object) {
      this.body = body;
      this.object = object;

      this.getObject = function() {
        return this.object;
      }
    }

    var contactListener = new b2ContactListener;

    // triggered when collision begins
    contactListener.BeginContact = function(contact) {
      var objectA = contact.GetFixtureA().GetBody().GetUserData().getObject();
      var objectB = contact.GetFixtureB().GetBody().GetUserData().getObject();

      amplify.publish('box2d-begin-contact', objectA, objectB);

    }

    // triggered after collision ends
    contactListener.EndContact = function(contact) {
      var objectA = contact.GetFixtureA().GetBody().GetUserData().getObject();
      var objectB = contact.GetFixtureB().GetBody().GetUserData().getObject();

      amplify.publish('box2d-end-contact', objectA, objectB);
     }

     contactListener.PostSolve = function(contact, impulse) {
     }

    // handle each step of the simulation, driven by the Ticker
    function update() {
        world.Step(TIMESTEP, 12, 10);
        world.DrawDebugData();
        world.ClearForces();

        removeBodiesMarkedForRemoval();

        // update the actors
        for(var i=0;i<actors.length;i++){
          actors[i].update();
          if (actors[i].getObject().markedForRemoval)
            bodiesToRemove.push(actors[i].getBody());
        }
    }

    // eunque all box2d bodies for removal
    function enqueAllBodiesForRemoval() {
        for(var i=0, j = actors.length; i<j; i++) {
          var actor = actors[i];
          bodiesToRemove.push(actor.getBody());
        }
    }

    // if a body is enqued for removal, it must be removed from the box2d world
    // and its actor as well
    function removeBodiesMarkedForRemoval() {
        //remove any bodies marked for removal
        for(var i=0, l=bodiesToRemove.length; i<l;i++) {
            var body = bodiesToRemove[i];
            var actor = body.GetUserData();
            removeActor(actor);
            //body.SetUserData(null); //must eventually use a callback for this to so it becomes asynchronous
            world.DestroyBody(body);
        }
        bodiesToRemove = [];
    }

    // terminates the display object of the actor and removes the actor
    function removeActor(actor) {
        actor.object.terminate();
        actors.splice(actors.indexOf(actor),1);
    }

    return {
        init: init,
        createPolygonalPhysicsBody: createPolygonalPhysicsBody,
        createCircularPhysicsBody: createCircularPhysicsBody,
        update: update,
        enqueAllBodiesForRemoval: enqueAllBodiesForRemoval
    }

})(spacebounce.box2dContext);
