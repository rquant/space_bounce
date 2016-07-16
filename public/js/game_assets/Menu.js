/*
 *The menu is a container with a title and set of buttons
 */
(function (window) {
    
    function Menu(title, buttons) {
        this.initialize(title, buttons);
    }

    var p = Menu.prototype = new createjs.Container();

    p.parentMenu;
    p.title;
    p.buttonContainer;
    p.buttons;
    p.buttonCount;
    p.buttonWidth = MENU_BUTTON_WIDTH;
    p.buttonHeight = MENU_BUTTON_HEIGHT;
    p.padding = BUTTON_PADDING;
    p.menuWidth = p.buttonWidth;
    p.menuHeight;

    p.Container_initialize = p.initialize;


    p.initialize = function(title, buttons) {

        this.Container_initialize();
        this.title = title;
        this.buttons = buttons;
        this.buttonCount = buttons.length;

        var text = new createjs.Text(title, "25px Avenir", "#FFF");
        text.textAlign = "center";
        text.x = STAGE_WIDTH/2;
        text.y = 50;
        this.title = text;
        this.addChild(text);

        var buttonContainer = new createjs.Container();
        //add the button parameters to the button container and position them properly
        for(var i=0;i<this.buttonCount;i++) {
            var button = this.buttons[i];
            button.y = i*this.buttonHeight + i*this.padding; //position button
            buttonContainer.addChild(button);
        }

        this.menuHeight = this.buttonCount*this.buttonHeight + (this.buttonCount-1)*this.padding;

        buttonContainer.x = Math.round(STAGE_WIDTH/2 - this.menuWidth/2);
        buttonContainer.y = Math.round(STAGE_HEIGHT/2 - this.menuHeight/2);
        this.buttonContainer = buttonContainer;
        this.addChild(buttonContainer);
    }

    window.Menu = Menu;

}(window));
