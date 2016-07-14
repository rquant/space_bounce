/*
 *Sets up the elements to be used in the game
 */
(function(mainGame) {

  mainGame.player;
  // maybe this should be part of the state controller?
  mainGame.playerActive = false;

  //the containers (layers) for the display elements of the game
  mainGame.backgroundContainer = new createjs.Container(); //the parent layer containing background elements;
  mainGame.starFieldContainer = new createjs.Container(); //the layer containing the star field
  mainGame.gameContainer = new createjs.Container(); //the layer containing the running game elements
  mainGame.hudContainer = new createjs.Container(); //the layer containing the HUD elements

  mainGame.interactiveObjectsContainer = new createjs.Container(); //the parent layer containing the interactive elements, used when game is running
  mainGame.orbFieldContainer = new createjs.Container(); //the layer containing all orb objects
  mainGame.forceFieldContainer = new createjs.Container(); //the layer containing the force fields
  mainGame.playerContainer = new createjs.Container();// the layer containing the player

  mainGame.gameContainer.addChild(mainGame.interactiveObjectsContainer, mainGame.hudContainer);

  // Setup background layer (non-interactive)
  mainGame.planet = new Planet();
  mainGame.starField = []; //array holding the star particles
  var canvas = mainGame.canvas
  var background = new createjs.Shape();
  background.graphics.beginFill(BACKGROUND_COLOR).drawRect(0, 0, mainGame.canvas.width, mainGame.canvas.height);
  background.x = 0;
  background.y = 0;
  mainGame.backgroundContainer.addChild(background);
  generateStarField();

  mainGame.stage.update();

  function generateStarField() {
    for(var i=0;i<STAR_COUNT;i++) {
      var star = new Star();
      mainGame.starField.push(star);  //add star object to array for reference
     }
     mainGame.backgroundContainer.addChild(mainGame.starFieldContainer);
  }

  //interactiveObjectsContainer.addChild(orbFieldContainer, forceFieldContainer, playerContainer);

})(spacebounce.mainGame);

// box2dModule.setup(); //setup up box2d world and its properties
// setupBackgroundElements();
// setupInteractiveElements();

// var energyGuage = new EnergyGuage();
// var pauseButton = new PauseButton();
// var timeToRescueDisplay = new TimeToRescue
// hudContainer = new createjs.Container();
// // hudContainer.addChild(energyGuage, pauseButton, timeToRescueDisplay);
//
// gameContainer = new createjs.Container();
//
//
//
//
// function setupBackgroundElements() {
//     var canvas = spacebounce.main.canvas;
//     var background = new createjs.Shape();
//     background.graphics.beginFill(BACKGROUND_COLOR).drawRect(0, 0, canvas.width, canvas.height);
//     background.x = 0;
//     background.y = 0;
//     backgroundContainer.addChild(background);
//
//     //add star field to 2nd level background layer
//     generateStarField();
//
//     //add planet to top background layer
//      planet = new Planet();
//      stage.update();
//
//      function generateStarField() {
//         starFieldContainer = new createjs.Container();
//         for(var i=0;i<STAR_COUNT;i++) {
//             var star = new Star();
//             starField.push(star);  //add star object to array for reference
//         }
//         backgroundContainer.addChild(starFieldContainer);
//     }
// }
//
//  function setupInteractiveElements() {
//     interactiveObjectsContainer = new createjs.Container();
//     orbFieldContainer = new createjs.Container();
//     antimatterOrbFieldContainer = new createjs.Container();
//     forceFieldContainer = new createjs.Container();
//     playerContainer = new createjs.Container();
//
//     interactiveObjectsContainer.addChild(orbFieldContainer, forceFieldContainer, playerContainer);
// }
