spacebounce.mainGame.menus = (function() {

  //create the welcome menu
  var welcomeMenu = function () {
      var instructionsButton = new MenuButton("Instructions");
      instructionsButton.addEventListener("click", function(event) {
        amplify.publish('set-child-menu', { menuName: 'instructions' });
      });

      var name = 'welcome';
      var title = "Welcome to Space Bounce";
      var menu = new Menu(name, title, [instructionsButton]);
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

    var goBackButton = new MenuButton("Go Back");
    goBackButton.addEventListener("click", function(event) {
        amplify.publish('launch-parent-menu', { childMenuName: 'instructions' });
    });

    var name = 'instructions'
    var title = "Instructions";
    var buttons = [goBackButton];

    var menu = new Menu(name, title, buttons);
    menu.buttonContainer.y = STAGE_HEIGHT - 50;
    menu.addChild(content);

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
        default:
          menu = welcomeMenu;
      }
      return menu;
    }
  }
})();
