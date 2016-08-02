spacebounce.game.state = spacebounce.game.state || {};

spacebounce.game.state.menu = (function(game) {
  var currentMenu;

  function launchNewMenu(menuName) {
    var menu = game.menus.getByName(menuName);
    game.containers.menu.removeAllChildren();
    currentMenu = menu;
    game.containers.menu.addChild(currentMenu);
  }

  function launchSubMenu(menuName) {
    var menu = game.menus.getByName(menuName);
    menu.parentMenu = currentMenu;
    game.containers.menu.removeChild(currentMenu);
    currentMenu = menu;
    game.containers.menu.addChild(currentMenu);
  }

  function launchParentMenu() {
    var menu = currentMenu.parentMenu;
    game.containers.menu.removeChild(currentMenu);
    currentMenu = menu;
    game.containers.menu.addChild(currentMenu);
  }

  function clearMenu() {
    game.containers.menu.removeAllChildren();
    currentMenu = null;
  }

  return {
    launchNewMenu: launchNewMenu,
    launchSubMenu: launchSubMenu,
    launchParentMenu: launchParentMenu,
    clearMenu: clearMenu
  }
})(spacebounce.game);
