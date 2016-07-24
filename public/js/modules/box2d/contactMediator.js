spacebounce.box2dContext = spacebounce.box2dContext || {};

/*
  Determines the context of the collision of two objects, based on the type of
  objects colliding. Because this is tightly coupled to the type of objects
  present in the game, this logic is placed into a submodule to keep the more
  complex box2dContext parent module loosely coupled.

  The context is returned as a pub/sub topic which is subscribed to by the state
  controller to handle the collision.
*/
spacebounce.box2dContext.contactMediator = (function(mainGame){

  function getEndContactEvent(objectAType, objectBType) {
    var interaction = {
      'Sensor': {
        'Player': 'player-exits-boundary'
      },
      'Player': {
        'Sensor': 'player-exits-boundary'
      }
    };

    return (interaction[objectAType][objectBType] || '');
  }

  return {
    getEndContactEvent: getEndContactEvent
  }
}(spacebounce.mainGame));
