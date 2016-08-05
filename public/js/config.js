var spacebounce = spacebounce || {};

(function(spacebounce) {
  var config = {};

  const FRAMERATE = 60; // per second
  config.framerate = FRAMERATE;

  config.stage = {
    width: 950,
    height: 650,
    boundary: 10,
    hudOffset: 15
  };

  config.background = {
    color: "#303030",
    stars: {
      count: 275
    }
  };

  config.menu = {
    buttonWidth: 180,
    buttonHeight: 30,
    buttonPadding: 20
  }

  config.physics = {
    gravityX: 0,
    gravityY: 8
  }

  var playerRadius = 35;
  config.gameplay = {
    timeRemaining: 40,
    playerRadius: 35,
    maxPlayerEnergy: FRAMERATE * 26,
    energyOrbVal: FRAMERATE * 3,
    antimatterOrbVal: FRAMERATE * 2,
    maxForceFieldLength: playerRadius * 3
  }

  spacebounce.config = config;
}(spacebounce || {}));
