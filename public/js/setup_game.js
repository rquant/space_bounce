/*
 *Sets up the elements to be used in the game
 */
(function(spacebounce) {
  var mainGame = spacebounce.mainGame;
  var classes = spacebounce.classes;
  var b2Context = spacebounce.box2dContext;
  spacebounce.audio.init();

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
  b2Context.setup();

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
    var energyGuage = new spacebounce.EnergyGuage();
    var pauseButton = new spacebounce.PauseButton();
    var timerLabel = new spacebounce.TimerLabel();
    // TODO: after thinking about, maybe it's best not to pass parent container as param
    // to our objects. the createjs objects have an internal reference to parent already,
    // and the display order of objects is determined by there initialization order (bad)
    containers.hud.addChild(energyGuage, pauseButton, timerLabel);
    containers.hud.visible = false;

    containers.gameplay.addChild(
      containers.orbs, containers.forceFields, containers.player
    );

    containers.interactive.addChild(
      containers.gameplay, containers.hud, containers.menu
    );
    containers.root.addChild(containers.interactive);

    mainGame.energyGuage = energyGuage;
    mainGame.timerLabel = timerLabel;
  }
})(spacebounce);
