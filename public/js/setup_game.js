/*
 *Sets up the elements to be used in the game
 */
(function(mainGame) {

  mainGame.player;
  // maybe this should be part of the state controller?
  mainGame.playerActive = false;

  initializeContainers();
  setupBackgroundLayers();


  //the containers (layers) for the objects of the game
  function initializeContainers() {
    mainGame.backgroundContainer = new createjs.Container();
    mainGame.starFieldContainer = new createjs.Container();
    mainGame.gameContainer = new createjs.Container();
    mainGame.hudContainer = new createjs.Container();
    mainGame.interactiveObjectsContainer = new createjs.Container();
    mainGame.orbFieldContainer = new createjs.Container();
    mainGame.forceFieldContainer = new createjs.Container();
    mainGame.playerContainer = new createjs.Container();

    // the game container holds everything gameplay related
    mainGame.gameContainer.addChild(
      mainGame.interactiveObjectsContainer, mainGame.hudContainer
    );

    // hold any objects directly involved in gameplay
    mainGame.interactiveObjectsContainer.addChild(
      mainGame.orbFieldContainer, mainGame.forceFieldContainer, mainGame.playerContainer
    );
  }

  // set up the background layers of the game. contains non-interactive
  // elements not used for actual gameplay.
  function setupBackgroundLayers() {
    var background = new createjs.Shape();
    background.graphics.beginFill(BACKGROUND_COLOR).drawRect(
      0, 0, mainGame.canvas.width, mainGame.canvas.height
    );
    background.x = 0;
    background.y = 0;
    mainGame.backgroundContainer.addChild(background);
    mainGame.planet = new spacebounce.Planet();

    // setup star field for animation
    mainGame.starField = []; //stores the star particles used in animation
    for(var i=0;i<STAR_COUNT;i++) {
      var star = new spacebounce.Star();
      mainGame.starField.push(star);
     }
     mainGame.backgroundContainer.addChild(mainGame.starFieldContainer);
  }
})(spacebounce.mainGame);
