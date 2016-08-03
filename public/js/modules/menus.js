/*
  instantiates the menus used in the main game, and controls the state of the
  currently displayed menu. The publish/subscribe pattern is used to access this
  module rather than allowing direct assess in order to decrease coupling.
*/

spacebounce.game.menus = (function(game) {

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
    var menu = new Menu(name, title, [playButton, instructionsButton]);
    return menu;
  }();

  var instructionsMenu = function() {
    var content = new createjs.Container();
    var description = new createjs.Text("", "18px Avenir", "#FFF");
    description.text = "Your mission is to save the austronaut from crashing into " +
    " the planet below. Drag your mouse on the stage to \ndraw force fields. " +
    "These force fields will deflect the capsule against gravity. Once your " +
    "energy supply depletes\nhowever, you will be unable to generate new " +
    "force fields. You must collide the space capsule with the floating\n" +
    "green energy orbs to replenish your energy. Avoid the red antimatter " +
    "orbs as they will deplete it even further.\nKeep the astronaut alive " +
    "long enough for the designated time and you will save her. Good luck.";
    description.textAlign = "center";
    description.x = STAGE_WIDTH/2;
    description.y = STAGE_HEIGHT/3;
    content.addChild(description);

    var goBackButton = new spacebounce.MenuButton("Go Back");
    goBackButton.addEventListener("click", function(event) {
      game.state.menu.launchParentMenu();
    });

    var name = 'instructions'
    var title = "Instructions";
    var buttons = [goBackButton];

    var menu = new Menu(name, title, buttons);
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
    var menu = new Menu(name, title, buttons);
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
    var menu = new Menu(name, title, buttons);
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
        default:
          var errMsg = 'There is no menu matching the name "' + name + '"'
          throw new game.Exception(errMsg);
      }
      return menu;
    }
  }

})(spacebounce.game);
