/*
 *A button used for a menu
 */
(function (spacebounce) {

    function MenuButton(text) {

        this.initialize(text);
    }

      var p = MenuButton.prototype = new spacebounce.Button();
      p.Button_initialize = p.initialize;

      p.initialize = function(text) {
          this.Button_initialize(MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT);
          this.underlay.alpha = 0.7;

          var textWrapper = new createjs.Text(text, "20px Avenir", "#FFFFFF");
          textWrapper.textAlign = "center";
          textWrapper.textBaseline = "middle";
          //offset the textWrapper to be in the center of the button
          textWrapper.x = this.width/2;
          textWrapper.y = this.height/2;

          this.label.addChild(textWrapper);
      }

    spacebounce.MenuButton = MenuButton;

}(spacebounce));
