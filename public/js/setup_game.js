/*
 *Sets up the elements to be used in the game
 */
(function(mainGame) {
  mainGame.player;
  // maybe this should be part of the state controller?
  mainGame.playerActive = false;

  // the containers define 2D layers of the game that can contain other objects
  // within that layer
  var containers = {
    root: new createjs.Container(),
    background: new createjs.Container(),
    stars: new createjs.Container(),
    interactive: new createjs.Container(),
    menu: new createjs.Container(),
    hud: new createjs.Container(),
    gameplay: new createjs.Container(),
    orbs: new createjs.Container(),
    forceFields: new createjs.Container(),
    player: new createjs.Container()
  }

  setupBackgroundLayers();
  setupInteractiveLayers();
  mainGame.box2dContext.setup();

  mainGame.containers = containers;

  // set up the background layers of the game. contains non-interactive
  // elements not used for actual gameplay.
  function setupBackgroundLayers() {
    var background = new createjs.Shape();
    background.graphics.beginFill(BACKGROUND_COLOR).drawRect(
      0, 0, STAGE_WIDTH, STAGE_HEIGHT
    );
    background.x = 0;
    background.y = 0;
    var planet = new spacebounce.Planet();

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
    containers.gameplay.addChild(
      containers.orbs, containers.forceFields, containers.player
    );
    containers.interactive.addChild(
      containers.gameplay, containers.hud, containers.menu
    );
    containers.root.addChild(containers.interactive);
  }
})(spacebounce.mainGame);
