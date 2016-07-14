/*
 *loads all other required scripts and prepares the game for initialization
 */

$(document).ready(function () {

    //setup the main canvas used for the game
    canvas = $("#mainCanvas")[0];
    canvas.width = STAGE_WIDTH;
    canvas.height = STAGE_HEIGHT;
    context = canvas.getContext("2d");
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0,0, canvas.width, canvas.height);
    stage = new createjs.Stage("mainCanvas");

    debugCanvas = $("#debugCanvas")[0]; //seperate convas for debugging box2d simulation

    //set up loading screen
    var loadProgressContainer = new createjs.Container();

    var loadProgressLabel = new createjs.Text("Loading", "30px Avenir", "#FFFFFF");
    loadProgressLabel.lineWidth = 200;
    loadProgressLabel.textAlign = "center";
    loadProgressLabel.x = STAGE_WIDTH/2;
    loadProgressLabel.y = 0;
    loadProgressContainer.addChild(loadProgressLabel);

    var loadingBarContainer = new createjs.Container();
    var loadingBarHeight = 20;
    var loadingBarWidth = 400;

    var loadingBar = new createjs.Shape();
    loadingBar.graphics.beginFill("#FFFFFF").drawRect(0, 0, 1, loadingBarHeight).endFill();
    var frame = new createjs.Shape();
    frame.graphics.setStrokeStyle(2).beginStroke("#FFFFFF").drawRoundRect(0, 0, loadingBarWidth, loadingBarHeight, 2);


    loadingBarContainer.addChild(frame, loadingBar);

    loadingBarContainer.x = Math.round(STAGE_WIDTH/2 - loadingBarWidth/2);
    loadingBarContainer.y = 50;

    var padding = 50; //the space between the text and the loading bar
    var loadProgressContainerHeight = loadingBarHeight + padding + 30;
    loadProgressContainer.addChild(loadingBarContainer);
    loadProgressContainer.y = STAGE_HEIGHT/2 - loadProgressContainerHeight/2;

    stage.addChild(loadProgressContainer);
    stage.update();

    //the preloader is responsible for loading resources and its progress can be used to update the loading bar
    var preloader = new createjs.LoadQueue(false);
    preloader.installPlugin(createjs.Sound);
    preloader.addEventListener("progress", handleProgress);
    preloader.addEventListener("complete", handleComplete);
    preloader.loadManifest([
        {src:"js/lib/GlowFilter.js"},
        {src:"js/util.js"},
        {src:"js/modules/box2dModule.js"},

        {src:"js/game_assets/Star.js"},
        {src:"js/game_assets/Planet.js"},
        {src:"js/game_assets/ForceField.js"},
        {src:"js/game_assets/Player.js"},
        {src:"js/game_assets/EnergyOrb.js"},
        {src:"js/game_assets/AntimatterOrb.js"},
        {src:"js/setup_game.js"}
    ]);

    function handleProgress() {
        loadingBar.scaleX = preloader.progress * loadingBarWidth;
        stage.update();
    }

    //all resources loaded, begin the game introduction
    function handleComplete() {
        stage.enableMouseOver(2);
        stage.removeChild(loadProgressContainer);
        stage.addChild(backgroundContainer);

        createjs.Ticker.setFPS(30);
        createjs.Ticker.setRAF = true;
        createjs.Ticker.addEventListener("tick", backgroundTick);
        createjs.Sound.play("soundtrack", {loop: -1});
    }
});

var orbDelayCounter = 0;
var timeToRescue = FPS * TIME_TO_RESCUE;
//runs the background animation and the game itself. this is updated on every frame
function mainTick(event) {
    //run star field animation
    for(var i=0;i<starField.length;i++) {
        var s = starField[i];
        if (s.y>=STAGE_HEIGHT) {
            s.x = Math.floor(Math.random()*STAGE_WIDTH);
            s.y = 0;
        }
        s.tick();
    }

    //generate energy orbs randomly
    orbDelayCounter++;
    if ((orbDelayCounter % 80) == 0) {
       var orb = new EnergyOrb();
    }

    //generate antimatter orbs
    if (Math.random()<0.005) {
        var antimatterOrb = new AntimatterOrb();
    }

    //decrement the time until player is rescued, by 1/30 seconds decrements
    timeToRescue--;
    timeToRescueDisplay.tick(timeToRescue);
    if (timeToRescue<=0)
        stateController.launchGamecompletedMenu();

    box2d.update(); //run box2d simulation
    stage.update(event);
}

//continuously deplete player's energy. updated on every frame
function energyDepletionTick() {

    energyGuage.tick(player.energySupply);
    if (player.energySupply<=0) {
        mouseHandler.switchToMenuMode(); //the player's energy has run out, prevent them from drawing new force fields by switching to menu mode
        createjs.Ticker.removeEventListener("tick", energyDepletionTick);
    }
    player.energySupply--;
}

//runs the background animation. updated on every frame
function backgroundTick() {
    //run star field animation
    for(var i=0;i<starField.length;i++) {
        var s = starField[i];
        if (s.y>=STAGE_HEIGHT) {
            s.x = Math.floor(Math.random()*STAGE_WIDTH);
            s.y = 0;
        }
        s.tick();
    }
    stage.update();
}
