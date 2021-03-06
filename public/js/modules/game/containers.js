(function(game) {
  /*
    the containers represent the stacked two dimensional layers composing the
    game
  */
  game.containers = {
    root: new createjs.Container(),
    background: new createjs.Container(),
    stars: new createjs.Container(),
    interactive: new createjs.Container(),
    menu: new createjs.Container(),
    hud: new createjs.Container(),
    gameplay: new createjs.Container(),
    orbs: new createjs.Container(),
    forceFields: new createjs.Container(),
    player: new createjs.Container()
  }

})(spacebounce.game || {});
