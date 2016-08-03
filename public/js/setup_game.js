/*
 *Self executing script that sets up elements of the game and prepares it for
* initialization
 */
(function(spacebounce) {
  var classes = spacebounce.classes;
  var game = spacebounce.game;
  var containers = game.containers;
  var hud = game.hud;
  var b2Context = spacebounce.box2dContext;
  spacebounce.audio.init();

  setupBackgroundLayers();
  setupInteractiveLayers();
  b2Context.setup();

  // set up the background layers of the game. contains non-interactive
  // elements not used for actual gameplay.
  function setupBackgroundLayers() {
    var background = new createjs.Shape();
    background.graphics.beginFill(BACKGROUND_COLOR).drawRect(
      0, 0, STAGE_WIDTH, STAGE_HEIGHT
    );
    background.x = 0;
    background.y = 0;
    var planet = new spacebounce.classes.Planet();

    // setup star field used in background aniamation
    for(var i=0;i<STAR_COUNT;i++) {
      var star = new spacebounce.Star();
      containers.stars.addChild(star);
     }

     containers.background.addChild(
       background, planet, containers.stars
     );
     containers.root.addChild(containers.background);
  }

  function setupInteractiveLayers() {
    // TODO: after thinking about, maybe it's best not to pass parent container as param
    // to our objects. the createjs objects have an internal reference to parent already,
    // and the display order of objects is determined by there initialization order (bad)
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
