(function(spacebounce) {
  spacebounce.box2dContext = spacebounce.box2dContext || {};

  /*
    Determines the context of the collision of two objects. This context is
    defined by the type of objects colliding, and is abstacted into a pub/sub
    topic that is published to a subscriber in the game state module.

    Because this implementation is tightly coupled to class definitions
    used by the game, it is placed into a submodule to keep the more
    complex box2dContext parent module more loosely coupled.
  */
  spacebounce.box2dContext.contactMediator = (function() {

    amplify.subscribe('box2d-begin-contact', function(objectA, objectB) {
      var objectAType = objectA.getClassName();
      var objectBType = objectB.getClassName();


      if (objectAType == 'Player') {
        if (objectBType == 'EnergyOrb') {
          amplify.publish('player-consumes-energyorb', objectA, objectB);
        }
        else if (objectBType == 'AntimatterOrb') {
          amplify.publish('player-consumes-antimatterorb', objectA, objectB);
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
      else if (objectAType == 'AntimatterOrb') {
        if (objectBType == 'Player') {
          amplify.publish('player-consumes-antimatterorb', objectB, objectA);
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

})(spacebounce);
