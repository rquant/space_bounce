/*
 *loads all other required scripts and prepares the game for initialization
 */


$(document).ready(function() {
  (function (mainGame) {
    //setup the main canvas used for the game
    var canvas = $("#main-canvas")[0];
    canvas.width = STAGE_WIDTH;
    canvas.height = STAGE_HEIGHT;

    var context = canvas.getContext("2d");
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0,0, canvas.width, canvas.height);
    mainGame.stage = new createjs.Stage("main-canvas");

    debugCanvas = $("#debugCanvas")[0]; //seperate convas for debugging box2d simulation

    //set up loading screen
    var loadProgressContainer = new createjs.Container();

    var loadProgressLabel = new createjs.Text(
      "Loading", "30px Avenir", "#FFFFFF"
    );
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

    mainGame.stage.addChild(loadProgressContainer);
    mainGame.stage.update();

    //the preloader is responsible for loading resources and its progress can be used to update the loading bar

    var preloader = new createjs.LoadQueue(false);
    preloader.installPlugin(createjs.Sound);
    preloader.addEventListener("progress", handleProgress);
    preloader.addEventListener("complete", handleComplete);
    preloader.loadManifest([
        {src:"js/lib/GlowFilter.js"},
        {src:"js/util.js"},
        {src:"js/modules/box2d/box2dContext.js"},
        {src: "js/modules/box2d/contactMediator.js"},

        {src:"js/game_assets/Star.js"},
        {src:"js/game_assets/Planet.js"},
        {src:"js/game_assets/Player.js"},
        {src:"js/game_assets/Menu.js"},
        {src:"js/game_assets/Button.js"},
        {src: "js/game_assets/Sensor.js"},
        {src: "js/Exception.js"},
        {src: "js/modules/stateController.js"},
        {src: "js/modules/menuModule.js"},
        {src:"js/setup_game.js"}
    ]);

    function handleProgress() {
        loadingBar.scaleX = preloader.progress * loadingBarWidth;
        mainGame.stage.update();
    }

    //all resources loaded, begin the game introduction
    function handleComplete() {
        mainGame.stage.enableMouseOver(2);
        mainGame.stage.removeChild(loadProgressContainer);
        mainGame.stage.addChild(mainGame.containers.root);

        createjs.Ticker.setFPS(FPS);
        createjs.Ticker.setRAF = true;

        createjs.Sound.play("soundtrack", {loop: -1});
        amplify.publish('preload-complete');
    }

  })(spacebounce.mainGame || {});
});

//continuously deplete player's energy. updated on every frame
function energyDepletionTick() {

    energyGuage.tick(player.energySupply);
    if (player.energySupply<=0) {
        mouseHandler.switchToMenuMode(); //the player's energy has run out, prevent them from drawing new force fields by switching to menu mode
        createjs.Ticker.removeEventListener("tick", energyDepletionTick);
    }
    player.energySupply--;
}
