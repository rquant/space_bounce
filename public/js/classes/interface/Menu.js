/*
 *The menu is a container with a title and set of buttons
 */
(function (spacebounce) {

    function Menu(name, title, buttons) {
        this.initialize(name, title, buttons);
    }
    var config = spacebounce.config;
    const STAGE_WIDTH = config.stage.width;
    const STAGE_HEIGHT = config.stage.height;

    var p = Menu.prototype = new createjs.Container();
    p.parentMenu;
    p.title;
    p.buttonContainer;
    p.buttons;
    p.buttonCount;
    p.buttonWidth = config.menu.buttonWidth;;
    p.buttonHeight = config.menu.buttonHeight;
    p.buttonPadding = config.menu.buttonPadding;
    p.menuWidth = p.buttonWidth;
    p.menuHeight;


    p.Container_initialize = p.initialize;

    p.initialize = function(name, title, buttons) {

        this.Container_initialize();
        this.name = name;
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
            button.y = i*this.buttonHeight + i*this.buttonPadding; //position button
            buttonContainer.addChild(button);
        }

        this.menuHeight = this.buttonCount * this.buttonHeight + (this.buttonCount-1)*this.buttonPadding;

        buttonContainer.x = Math.round(STAGE_WIDTH/2 - this.menuWidth/2);
        buttonContainer.y = Math.round(STAGE_HEIGHT/2 - this.menuHeight/2);
        this.buttonContainer = buttonContainer;
        this.addChild(buttonContainer);
    }

    spacebounce.Menu = Menu;

}(spacebounce));
