/*
 *  Controls the state and logic of the game. This can be thought of as the
    mediator in which other components of the game will publish an event and
    this will subscribe to it to handle it.
 */
spacebounce.mainGame.stateController = (function (mainGame) {
    var game = spacebounce.game;
    var b2Context = spacebounce.box2dContext;

    var player;
    // the number of ticks remaining in Ticker before game ends
    var ticksRemaining;
    var orbDelayCounter;

    function beginGame() {
      mainGame.menuController.clearMenu();
      mainGame.containers.hud.visible = true;
      createjs.Ticker.removeEventListener('tick', backgroundTick);
      player = new spacebounce.Player(
        mainGame.containers.player, b2Context
      );
      ticksRemaining = FPS * TIME_REMAINING;
      orbDelayCounter = 0;
      createjs.Ticker.addEventListener('tick', gameRunningTick);
      amplify.publish('game-active');
    }

    function pauseGame() {
      mainGame.containers.hud.visible = false;
      createjs.Ticker.removeEventListener('tick', gameRunningTick);
      createjs.Ticker.addEventListener('tick', backgroundTick);
      mainGame.menuController.launchNewMenu('pause');
      amplify.publish('game-inactive');
    }

    function resumeGame() {
      mainGame.menuController.clearMenu();
      mainGame.containers.hud.visible = true;
      createjs.Ticker.removeEventListener('tick', backgroundTick);
      createjs.Ticker.addEventListener('tick', gameRunningTick);
      amplify.publish('game-active');

    }

    function endGame() {
      b2Context.enqueAllBodiesForRemoval();
      mainGame.containers.hud.visible = false;
      createjs.Ticker.removeEventListener('tick', gameRunningTick);
      createjs.Ticker.addEventListener('tick', backgroundTick);
      mainGame.menuController.launchNewMenu('gameover');
      amplify.publish('game-inactive');
    }

    amplify.subscribe('preload-complete', function() {
      createjs.Ticker.addEventListener('tick', backgroundTick);
      mainGame.menuController.launchNewMenu('welcome');
    });

    amplify.subscribe('player-exits-boundary', function() {
      endGame();
    });

    amplify.subscribe('player-energy-depleted', function() {
      endGame();
    });

    amplify.subscribe('player-contacts-forcefield', function(forceField) {
      createjs.Sound.play("Bounce");
      forceField.markedForRemoval = true;
    });

    amplify.subscribe('player-consumes-energyorb', function(player, orb) {
      player.increaseEnergySupply();
      orb.markedForRemoval = true;
      orb.terminateWithTween = true;
      createjs.Sound.play("Absorb");
    });

    amplify.subscribe('player-consumes-antimatterorb', function(player, orb) {
      player.decreaseEnergySupply();
      orb.markedForRemoval = true;
      orb.terminateWithTween = true;
      createjs.Sound.play("Absorb");
    });

    // only runs background animations unrelated to gameplay
    function backgroundTick() {
        starFieldAnimation();
        game.stage.update();
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


    function gameRunningTick(event) {
      // The amount of ticks remaining until the game ends
        if (ticksRemaining <= 0)
          endGame();

        starFieldAnimation();
        //generate energy orbs randomly
        orbDelayCounter++;
        if ((orbDelayCounter % 80) == 0) {
           new spacebounce.EnergyOrb(
             mainGame.containers.orbs, b2Context
            );
        }

        if (Math.random()<0.002) {
          new spacebounce.AntimatterOrb(
            mainGame.containers.orbs, b2Context
          );
        }

        if (player) {

          mainGame.energyGuage.tick(player.energySupply);
          mainGame.timerLabel.tick(ticksRemaining);
          ticksRemaining--;
        }

        b2Context.update();
        game.stage.update(event);
    }

    function getPlayerInstance() {
      return player;
    }

    return {
      getPlayerInstance: getPlayerInstance,
      beginGame, beginGame,
      pauseGame: pauseGame,
      resumeGame: resumeGame,
      endGame: endGame
    }

})(spacebounce.mainGame);
