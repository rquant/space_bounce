/*
 *A button used for a menu
 */
(function (spacebounce) {

    function MenuButton(text) {

        this.initialize(text);
    }

      var p = MenuButton.prototype = new Button();
      p.Button_initialize = p.initialize;

      p.initialize = function(text) {
          this.Button_initialize(text, MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT);
          this.underlay.alpha = 0.7;
      }

    spacebounce.MenuButton = MenuButton;

}(spacebounce));
