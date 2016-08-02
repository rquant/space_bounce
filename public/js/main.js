/*
 *loads all other required scripts and prepares the game for initialization
 */


$(document).ready(function() {
  (function (spacebounce) {
    var mainGame = spacebounce.mainGame;
    var game = spacebounce.game;

    //setup the main canvas used for the game
    var canvas = $("#main-canvas")[0];
    canvas.width = STAGE_WIDTH;
    canvas.height = STAGE_HEIGHT;

    var context = canvas.getContext("2d");
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0,0, canvas.width, canvas.height);
    var stage = new createjs.Stage("main-canvas");

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

    stage.addChild(loadProgressContainer);
    stage.update();

    game.canvas = canvas;
    game.stage = stage;

    //the preloader is responsible for loading resources and its progress can be used to update the loading bar

    var preloader = new createjs.LoadQueue(false);
    preloader.installPlugin(createjs.Sound);
    preloader.addEventListener("progress", handleProgress);
    preloader.addEventListener("complete", handleComplete);
    preloader.loadManifest([
        {src: "js/lib/GlowFilter.js"},
        {src: "js/util.js"},
        {src: "js/audio_config.js"},

        {src: "js/classes/game_assets/Star.js"},
        {src: "js/classes/game_assets/Planet.js"},
        {src: "js/classes/game_assets/Player.js"},
        {src: "js/classes/game_assets/EnergyOrb.js"},
        {src: "js/classes/game_assets/AntimatterOrb.js"},
        {src: "js/classes/game_assets/Sensor.js"},
        {src: "js/classes/game_assets/ForceField.js"},

        {src: "js/classes/interface/Menu.js"},
        {src: "js/classes/interface/Button.js"},
        {src: "js/classes/interface/MenuButton.js"},
        {src: "js/classes/interface/EnergyGuage.js"},
        {src: "js/classes/interface/PauseButton.js"},
        {src: "js/classes/interface/TimerLabel.js"},

        {src: "js/Exception.js"},
        {src: "js/modules/containers.js"},
        {src: "js/modules/box2d/box2dContext.js"},
        {src: "js/modules/box2d/contactMediator.js"},
        {src: "js/modules/mouseEventHandler.js"},
        {src: "js/modules/state/state.js"},
        {src: "js/modules/state/menu.js"},
        {src: "js/modules/menus.js"},
        {src: "js/setup_game.js"}
    ]);

    function handleProgress() {
        loadingBar.scaleX = preloader.progress * loadingBarWidth;
        stage.update();
    }

    //all resources loaded, begin the game introduction
    function handleComplete() {
        stage.enableMouseOver(2);
        stage.removeChild(loadProgressContainer);
        stage.addChild(game.containers.root);

        createjs.Ticker.setFPS(FPS);
        createjs.Ticker.setRAF = true;

        game.state.welcomeUser();
    }

  })(spacebounce);
});
