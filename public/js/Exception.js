(function(spacebounce) {

  spacebounce.Exception = function(err) {
    console.error(err);
    var userErrorMessage = new createjs.Text("", "18px Avenir", "#FFF");
    userErrorMessage.text = "An internal error occured:\n" + err;
    userErrorMessage.x = STAGE_WIDTH / 2;
    userErrorMessage.y = STAGE_HEIGHT / 3;
    userErrorMessage.textAlign = "center";
    // TODO: make param a container
    //spacebounce.mainGame.containers.root.addChild(userErrorMessage);
  }
}(spacebounce));
