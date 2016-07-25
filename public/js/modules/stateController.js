/*
 *  Controls the state and logic of the game. This can be thought of as the
    mediator in which other components of the game will publish an event and
    this will subscribe to it to handle it.
 */
spacebounce.mainGame.stateController = (function (mainGame) {

    var player;

    amplify.subscribe('preload-complete', function() {
      createjs.Ticker.addEventListener('tick', backgroundTick);
      mainGame.menuController.launchNewMenu('welcome');
    });

    amplify.subscribe('begin-game', function() {
      // may be leftover bodies if user leaves view then returns
      mainGame.box2dContext.clearAllBodies();

      mainGame.menuController.clearMenu();
      createjs.Ticker.removeAllEventListeners();

      // player = new spacebounce.Player(
      //   mainGame.containers.player, mainGame.box2dContext
      // );
      createjs.Ticker.addEventListener('tick', gameRunningTick);
    });

    amplify.subscribe('player-exits-boundary', function() {
      endGame();
    });

    function endGame() {
      mainGame.box2dContext.clearAllBodies();
      mainGame.box2dContext.update();
      createjs.Ticker.removeEventListener('tick', gameRunningTick);
      createjs.Ticker.addEventListener('tick', backgroundTick);
      mainGame.menuController.launchNewMenu('gameover');
    }

    // only runs background animations unrelated to gameplay
    function backgroundTick() {
        starFieldAnimation();
        mainGame.stage.update();
    }

    function starFieldAnimation() {
      for(var i=0; i < STAR_COUNT; i++) {
        var s = mainGame.containers.stars.children[i];
        if (s.y>=STAGE_HEIGHT) {
            s.x = Math.floor(Math.random()*STAGE_WIDTH);
            s.y = 0;
        }
        s.tick();
      }
    }

    var orbDelayCounter = 0;
    var timeToRescue = FPS * TIME_TO_RESCUE;
    //runs the background animation and the game itself. this is updated on every frame

    function gameRunningTick(event) {
        starFieldAnimation();
        //generate energy orbs randomly
        orbDelayCounter++;
        if ((orbDelayCounter % 120) == 0) {
           var orb = new spacebounce.EnergyOrb(
             mainGame.containers.orbs, mainGame.box2dContext
            );
        }
        mainGame.box2dContext.update();
        mainGame.stage.update(event);
    }

    return {
      endGame: endGame
    }

    // function launchGameoverMenu() {
    //     parentContainer = gameoverMenu;
    //     box2d.clearBodies();
    //     mouseHandler.switchToMenuMode();
    //     backgroundContainer.removeChild(gameContainer);
    //     backgroundContainer.addChild(gameoverMenu);
    //     createjs.Ticker.removeEventListener("tick", mainTick);
    //     createjs.Ticker.removeEventListener("tick", energyDepletionTick);
    //     createjs.Ticker.addEventListener("tick", backgroundTick);
    // }
    //
    // //temparary, remove this
    // function launchGamecompletedMenu() {
    //     parentContainer = gamecompletedMenu;
    //     box2d.clearBodies();
    //     mouseHandler.switchToMenuMode();
    //     backgroundContainer.removeChild(gameContainer);
    //     backgroundContainer.addChild(gamecompletedMenu);
    //     createjs.Ticker.removeEventListener("tick", mainTick);
    //     createjs.Ticker.removeEventListener("tick", energyDepletionTick);
    //     createjs.Ticker.addEventListener("tick", backgroundTick);
    // }
    //
    // function launchPauseMenu() {
    //     parentContainer = pauseMenu;
    //     mouseHandler.switchToMenuMode();
    //     backgroundContainer.removeChild(gameContainer);
    //     createjs.Ticker.removeEventListener("tick", mainTick);
    //     createjs.Ticker.removeEventListener("tick", energyDepletionTick);
    //     backgroundContainer.addChild(pauseMenu);
    //     createjs.Ticker.addEventListener("tick", backgroundTick);
    // }
    //
    // function startGame() {
    //     mouseHandler.switchToGameMode();
    //     backgroundContainer.removeChild(welcomeMenu);
    //     backgroundContainer.addChild(gameContainer);
    //     player = new Player(playerContainer);
    //     createjs.Ticker.removeEventListener("tick", backgroundTick);
    //     createjs.Ticker.addEventListener("tick", mainTick);
    //     createjs.Ticker.addEventListener("tick", energyDepletionTick);
    // }
    //
    // function restartGame() {
    //     mouseHandler.switchToGameMode();
    //     backgroundContainer.removeChild(gameoverMenu);
    //     backgroundContainer.addChild(gameContainer);
    //     player = new Player(playerContainer);
    //     createjs.Ticker.removeEventListener("tick", backgroundTick);
    //
    //     energySupply = MAX_ENERGY;
    //     timeToRescue = FPS * TIME_TO_RESCUE;
    //     timeToRescueDisplay.secondsToRescue = TIME_TO_RESCUE;
    //     createjs.Ticker.addEventListener("tick", mainTick);
    //     createjs.Ticker.addEventListener("tick", energyDepletionTick);
    // }
    //
    // function resumeGame() {
    //     mouseHandler.switchToGameMode();
    //     backgroundContainer.removeChild(pauseMenu);
    //     backgroundContainer.addChild(gameContainer);
    //     createjs.Ticker.removeEventListener("tick", backgroundTick);
    //     createjs.Ticker.addEventListener("tick", mainTick);
    //     createjs.Ticker.addEventListener("tick", energyDepletionTick);
    // }

    // var audioEnabled = true;
    // function isAudioEnabled() {
    //     return audioEnabled;
    // }
    //
    // //enable/disable audio and change text of all audio buttons
    // function toggleAudioEnabled() {
    //
    //     if (isAudioEnabled()) {
    //         createjs.Sound.setMute(true);
    //         for(var i=0;i<audioButtons.length;i++)
    //             audioButtons[i].label.text = "Enable Audio";
    //         audioEnabled = false;
    //     }
    //     else {
    //         createjs.Sound.setMute(false);
    //         for(var i=0;i<audioButtons.length;i++)
    //             audioButtons[i].label.text = "Disable Audio";
    //         audioEnabled = true;
    //     }
    //
    // }

})(spacebounce.mainGame);
