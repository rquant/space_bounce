(function(mainGame) {
  mainGame.box2dContext = mainGame.box2dContext || {};

  /*
    Determines the context of the collision of two objects, based on the type of
    objects colliding. Because this is tightly coupled to the type of objects
    present in the game, this logic is placed into a submodule to keep the more
    complex box2dContext parent module loosely coupled.

    The context is returned as a pub/sub topic which is subscribed to by the state
    controller to handle the collision.
  */
  mainGame.box2dContext.contactMediator = (function(){

    var stateController = mainGame.stateController;

    amplify.subscribe('box2d-end-contact', function(actorA, actorB) {
        var objectA = actorA.getObject();
        var objectB = actorB.getObject();

        var interactionContext = {
          'Sensor': {
            'Player': 'player-exits-boundary'
          },
          'Player': {
            'Sensor': 'player-exits-boundary'
          }
        };

        var objectAType = objectA.getClassName();
        var objectBType = objectB.getClassName();
        var topic = interactionContext[objectAType][objectBType];
        amplify.publish(topic, objectA, objectB);
    });
  }());

})(spacebounce.mainGame);
