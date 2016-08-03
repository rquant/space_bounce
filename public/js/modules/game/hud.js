(function(game) {
  // Elements belonging to the Heads Up Dislplay (HUD) interface
  game.hud = {
    energyGuage: new spacebounce.EnergyGuage(),
    timerDisplay: new spacebounce.TimerDisplay(),
    pauseButton: new spacebounce.PauseButton(game.stage)
  }

})(spacebounce.game || {});
