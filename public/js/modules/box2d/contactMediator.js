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

    function getInteractionContext(mapping, objectA, objectB) {
      var objectAType = objectA.getClassName();
      var objectBType = objectB.getClassName();

      var topic = '';
      if (mapping[objectAType] && mapping[objectAType][objectBType])
        topic = mapping[objectAType][objectBType];

      return topic;
    }

    amplify.subscribe('box2d-begin-contact', function(objectA, objectB) {

      var cotactContextMapping = {
        'Player': {
          'EnergyOrb': 'player-contacts-energyorb'
        },
        'EnergyOrb': {
          'Player': 'energyorb-contacts-player'
        }
      };

      var topic = getInteractionContext(cotactContextMapping, objectA, objectB);
      amplify.publish(topic, objectA, objectB);

    });

    amplify.subscribe('box2d-end-contact', function(objectA, objectB) {

        var cotactContextMapping = {
          'Sensor': {
            'Player': 'player-exits-boundary'
          },
          'Player': {
            'Sensor': 'player-exits-boundary'
          }
        };

        var topic = getInteractionContext(cotactContextMapping, objectA, objectB);
        amplify.publish(topic, objectA, objectB);
    });
  }());

})(spacebounce.mainGame);
