/*
 *Sets up the elements to be used in the game
 */
var player;
var playerActive = false;
var planet;
var starField = []; //array holding the star particles

//the containers (layers) for the display elements of the game
var backgroundContainer; //the parent layer containing background elements;
var starFieldContainer; //the layer containing the star field
var gameContainer; //the layer containing the running game elements
var hudContainer; //the layer containing the HUD elements

var interactiveObjectsContainer; //the parent layer containing the interactive elements, used when game is running
var orbFieldContainer; //the layer containing all orb objects
var forceFieldContainer; //the layer containing the force fields
var playerContainer;// the layer containing the player

//audio.init(); //setup audio

//box2d.setup(); //setup up box2d world and its properties
setupBackgroundElements();
setupInteractiveElements();

// var energyGuage = new EnergyGuage();
// var pauseButton = new PauseButton();
// var timeToRescueDisplay = new TimeToRescue
hudContainer = new createjs.Container();
// hudContainer.addChild(energyGuage, pauseButton, timeToRescueDisplay);

gameContainer = new createjs.Container();
gameContainer.addChild(interactiveObjectsContainer, hudContainer);



function setupBackgroundElements() {

   //create the bottom background layer
    backgroundContainer = new createjs.Container();
    var background = new createjs.Shape();
    background.graphics.beginFill(BACKGROUND_COLOR).drawRect(0, 0, canvas.width, canvas.height);
    background.x = 0;
    background.y = 0;
    backgroundContainer.addChild(background);

    //add star field to 2nd level background layer
    generateStarField();

    //add planet to top background layer
     planet = new Planet();
     stage.update();

     function generateStarField() {
        starFieldContainer = new createjs.Container();
        for(var i=0;i<STAR_COUNT;i++) {
            var star = new Star();
            starField.push(star);  //add star object to array for reference
        }
        backgroundContainer.addChild(starFieldContainer);
    }
}

 function setupInteractiveElements() {
    interactiveObjectsContainer = new createjs.Container();
    orbFieldContainer = new createjs.Container();
    antimatterOrbFieldContainer = new createjs.Container();
    forceFieldContainer = new createjs.Container();
    playerContainer = new createjs.Container();

    interactiveObjectsContainer.addChild(orbFieldContainer, forceFieldContainer, playerContainer);
}
