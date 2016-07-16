spacebounce.mainGame.menus = (function() {

  //create the welcome menu
  var welcomeMenu = function () {
      var instructionsButton = new MenuButton("Instructions");
      // instructionsButton.addEventListener("click", function(event) {
      //   amplify.publish('launch instructions view')
      // });

      var title = "Welcome to Space Bounce";
      var menu = new Menu(title, [instructionsButton]);
      return menu;
  }

  return {
    welcomeMenu: welcomeMenu()
  }
})();
