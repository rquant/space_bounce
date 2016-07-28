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

    amplify.subscribe('box2d-begin-contact', function(objectA, objectB) {
      var objectAType = objectA.getClassName();
      var objectBType = objectB.getClassName();


      if (objectAType == 'Player') {
        if (objectBType == 'EnergyOrb') {
          amplify.publish('player-consumes-energyorb', objectA, objectB);
        }
        else if(objectB == 'ForceField') {
          amplify.publish('player-contacts-forcefield', objectB);
        }
      }

      else if (objectAType == 'EnergyOrb') {
        if (objectBType == 'Player') {
          amplify.publish('player-consumes-energyorb', objectB, objectA);
        }
      }

      else if (objectAType == 'ForceField') {
        if (objectBType == 'Player') {
          amplify.publish('player-contacts-forcefield', objectA);
        }
      }
    });

    amplify.subscribe('box2d-end-contact', function(objectA, objectB) {
      var objectAType = objectA.getClassName();
      var objectBType = objectB.getClassName();

      if (objectAType == 'Player') {
        if (objectBType == 'Sensor') {
          amplify.publish('player-exits-boundary', objectA, objectB);
        }
      }

      if (objectAType == 'Sensor') {
        if (objectBType == 'Player') {
          amplify.publish('player-exits-boundary', objectB, objectA);
        }
      }
    });
  }());

})(spacebounce.mainGame);
