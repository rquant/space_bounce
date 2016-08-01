/*
  instantiates the menus used in the main game, and controls the state of the
  currently displayed menu. The publish/subscribe pattern is used to access this
  module rather than allowing direct assess in order to decrease coupling.
*/

(function(mainGame) {

  //create the welcome menu
  var welcomeMenu = function () {
    var playButton = new spacebounce.MenuButton("Begin");
    playButton.addEventListener("click", function(event) {
       amplify.publish('begin-game');
    });

    var instructionsButton = new spacebounce.MenuButton("Instructions");
    instructionsButton.addEventListener("click", function(event) {
      mainGame.menuController.launchSubMenu('instructions');
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
      mainGame.menuController.launchParentMenu();
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
       amplify.publish('begin-game');
    });

    var instructionsButton = new spacebounce.MenuButton("Instructions");
    instructionsButton.addEventListener("click", function(event) {
      mainGame.menuController.launchSubMenu('instructions');
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
       mainGame.stateController.resumeGame();
    });

    var instructionsButton = new spacebounce.MenuButton("Instructions");
    instructionsButton.addEventListener("click", function(event) {
      mainGame.menuController.launchSubMenu('instructions');
    });

    var name = 'pause';
    var title = "Game Paused";
    var buttons = [resumeButton, instructionsButton];
    var menu = new Menu(name, title, buttons);
    return menu;
  }();

  var getByName = function(name) {
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
        throw new mainGame.Exception(errMsg);
    }
    return menu;
  }

  // Maybe this logic should be placed in a class defining the menu container
  // (which would inherit the createjs.Container class)
  var menuController = (function() {
    var currentMenu;

    function launchNewMenu(menuName) {
      var menu = getByName(menuName);
      mainGame.containers.menu.removeAllChildren();
      currentMenu = menu;
      mainGame.containers.menu.addChild(currentMenu);
    }

    function launchSubMenu(menuName) {
      var menu = getByName(menuName);
      menu.parentMenu = currentMenu;
      mainGame.containers.menu.removeChild(currentMenu);
      currentMenu = menu;
      mainGame.containers.menu.addChild(currentMenu);
    }

    function launchParentMenu() {
      var menu = currentMenu.parentMenu;
      mainGame.containers.menu.removeChild(currentMenu);
      currentMenu = menu;
      mainGame.containers.menu.addChild(currentMenu);
    }

    function clearMenu() {
      mainGame.containers.menu.removeAllChildren();
      currentMenu = null;
    }

    return {
      launchNewMenu: launchNewMenu,
      launchSubMenu: launchSubMenu,
      launchParentMenu: launchParentMenu,
      clearMenu: clearMenu
    }
  })();

  mainGame.menuController = menuController;
})(spacebounce.mainGame);
