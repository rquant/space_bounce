/*
 * Self executing script that sets up elements of the game and prepares it for
 * initialization
 */
(function(spacebounce) {
  var config = spacebounce.config;
  var game = spacebounce.game;
  var containers = game.containers;
  var hud = game.hud;
  var audio = spacebounce.audio;
  var b2Context = spacebounce.box2dContext;

  audio.init();
  b2Context.init(game.debugCanvas);

  setupBackgroundLayers();
  setupInteractiveLayers();

  // set up the background layers of the game. contains non-interactive
  // elements not related to active gameplay.
  function setupBackgroundLayers() {
    var background = new createjs.Shape();
    background.graphics.beginFill(config.background.color).drawRect(
      0, 0, config.stage.width, config.stage.height
    );
    background.x = 0;
    background.y = 0;
    var planet = new spacebounce.Planet();

    // setup star field used in background aniamation
    for(var i=0; j=config.background.stars.count, i < j; i++) {
      var star = new spacebounce.Star();
      containers.stars.addChild(star);
     }

     containers.background.addChild(
       background, planet, containers.stars
     );
     containers.root.addChild(containers.background);
  }

  function setupInteractiveLayers() {
    containers.hud.addChild(hud.energyGuage, hud.pauseButton, hud.timerDisplay);
    containers.hud.visible = false;

    containers.gameplay.addChild(
      containers.orbs, containers.forceFields, containers.player
    );

    containers.interactive.addChild(
      containers.gameplay, containers.hud, containers.menu
    );
    containers.root.addChild(containers.interactive);
  }
})(spacebounce);
