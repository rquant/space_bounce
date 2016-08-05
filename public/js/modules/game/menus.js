/*
  The menu instances used in the game
*/
spacebounce.game.menus = (function(game) {
  var config = spacebounce.config;
  const STAGE_WIDTH = config.stage.width;
  const STAGE_HEIGHT = config.stage.height;
  //create the welcome menu
  var welcomeMenu = function () {
    var playButton = new spacebounce.MenuButton("Begin");
    playButton.addEventListener("click", function(event) {
       game.state.beginGame();
    });

    var instructionsButton = new spacebounce.MenuButton("Instructions");
    instructionsButton.addEventListener("click", function(event) {
      game.state.menu.launchSubMenu('instructions');
    });

    var name = 'welcome';
    var title = "Welcome to Space Bounce";
    var menu = new spacebounce.Menu(
      name, title, [playButton, instructionsButton]
    );
    return menu;
  }();

  var instructionsMenu = function() {
    var content = new createjs.Container();
    var description = new createjs.Text("", "18px Avenir", "#FFF");
    description.text = "An astronaut in a spherical escape pod is crash " +
    "landing to the planet below. You must keep the capsule afloat in " +
    "space until the timer ends, when rescue will arive and the game will " +
    "be complete.\n\n";
    description.text += "Click down and drag your mouse across the game stage " +
    "to create a force field in the path of the falling capsule. The capsule " +
    "will bounce off the force field, and the force field will dissipate. " +
    "Repeat this process to keep the capsule afloat until the timer " +
    "expires.\n\n";
    description.text += "This requires energy however, which steadily " +
    "depletes and its level is shown in the green energy gauge (upper left " +
    "corner of the stage). If the energy runs " +
    "out you cannot generate more force fields and its game over.\n\n";
    description.text += "Luckily green energy orbs are floating around in " +
    "space which you can acquire. Deflect the capsule to make contact with " +
    "these orbs and replenish your energy. Avoid the red antimatter orbs " +
    "which will further deplete your energy instead.";

    description.textAlign = "left";
    description.x = STAGE_WIDTH/8;
    description.y = STAGE_HEIGHT/3;
    description.lineWidth = STAGE_WIDTH * (3/4);
    content.addChild(description);

    var goBackButton = new spacebounce.MenuButton("Go Back");
    goBackButton.addEventListener("click", function(event) {
      game.state.menu.launchParentMenu();
    });

    var name = 'instructions'
    var title = "Instructions";
    var buttons = [goBackButton];

    var menu = new spacebounce.Menu(name, title, buttons);
    menu.buttonContainer.y = STAGE_HEIGHT - 50;
    menu.addChild(content);

    return menu;
  }();

  var gameoverMenu = function() {
    var restartButton = new spacebounce.MenuButton("Restart");
    restartButton.addEventListener("click", function(event) {
       game.state.beginGame();
    });

    var instructionsButton = new spacebounce.MenuButton("Instructions");
    instructionsButton.addEventListener("click", function(event) {
      game.state.menu.launchSubMenu('instructions');
    });

    var name = 'gameover';
    var title = "Game Over";
    var buttons = [restartButton, instructionsButton];
    var menu = new spacebounce.Menu(name, title, buttons);
    return menu;
  }();

  var gameCompletedMenu = function() {
    var restartButton = new spacebounce.MenuButton("Restart");
    restartButton.addEventListener("click", function(event) {
       game.state.beginGame();
    });

    var instructionsButton = new spacebounce.MenuButton("Instructions");
    instructionsButton.addEventListener("click", function(event) {
      game.state.menu.launchSubMenu('instructions');
    });

    var name = 'gamcompleted';
    var title = "Game Completed!";
    var buttons = [restartButton, instructionsButton];
    var menu = new spacebounce.Menu(name, title, buttons);
    return menu;
  }();

  var pauseMenu = function() {
    var resumeButton = new spacebounce.MenuButton("Resume");
    resumeButton.addEventListener("click", function(event) {
       game.state.resumeGame();
    });

    var instructionsButton = new spacebounce.MenuButton("Instructions");
    instructionsButton.addEventListener("click", function(event) {
      game.state.menu.launchSubMenu('instructions');
    });

    var name = 'pause';
    var title = "Game Paused";
    var buttons = [resumeButton, instructionsButton];
    var menu = new spacebounce.Menu(name, title, buttons);
    return menu;
  }();

  return {
    getByName: function(name) {
      var menu;
      switch (name) {
        case 'welcome':
          menu = welcomeMenu;
          break;
        case 'instructions':
          menu = instructionsMenu;
          break;
        case 'gameover':
          menu = gameoverMenu;
          break
        case 'pause':
          menu = pauseMenu;
          break
        case 'gamecompleted':
          menu = gameCompletedMenu;
          break;
        default:
          var errMsg = 'There is no menu matching the name "' + name + '"'
          throw new game.Exception(errMsg);
      }
      return menu;
    }
  }

})(spacebounce.game);
