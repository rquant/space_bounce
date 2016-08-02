/*
 *  This module is essentailly the core of the application, and controls the
    state and logic of the game. Other modules/classes communicate with this
    module directly, rather than directly comunicating with other modules to
    avoid tight coupling.
 */
spacebounce.game.state = (function (game) {
    var mainGame = spacebounce.mainGame;

    var b2Context = spacebounce.box2dContext;
    var containers = game.containers;
    var player;
    // the number of ticks remaining in Ticker before game ends
    var ticksRemaining;
    var orbDelayCounter;

    /*
      TODO: It may be feasible to greatly decouple this module by placing subscriptions
      in the other modules its referencing. i.e. container visibility could be changed
      in it's own module.
    */
    function beginGame() {
      game.menuController.clearMenu();
      containers.hud.visible = true;
      createjs.Ticker.removeEventListener('tick', backgroundTick);
      player = new spacebounce.Player(
        containers.player, b2Context
      );
      ticksRemaining = FPS * TIME_REMAINING;
      orbDelayCounter = 0;
      createjs.Ticker.addEventListener('tick', gameRunningTick);
      amplify.publish('game-active');
    }

    function pauseGame() {
      containers.hud.visible = false;
      createjs.Ticker.removeEventListener('tick', gameRunningTick);
      createjs.Ticker.addEventListener('tick', backgroundTick);
      game.menuController.launchNewMenu('pause');
      amplify.publish('game-inactive');
    }

    function resumeGame() {
      game.menuController.clearMenu();
      containers.hud.visible = true;
      createjs.Ticker.removeEventListener('tick', backgroundTick);
      createjs.Ticker.addEventListener('tick', gameRunningTick);
      amplify.publish('game-active');

    }

    function endGame() {
      b2Context.enqueAllBodiesForRemoval();
      containers.hud.visible = false;
      createjs.Ticker.removeEventListener('tick', gameRunningTick);
      createjs.Ticker.addEventListener('tick', backgroundTick);
      game.menuController.launchNewMenu('gameover');
      amplify.publish('game-inactive');
    }

    amplify.subscribe('preload-complete', function() {
      createjs.Ticker.addEventListener('tick', backgroundTick);
      game.menuController.launchNewMenu('welcome');
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
        var s = containers.stars.children[i];
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
             containers.orbs, b2Context
            );
        }

        if (Math.random()<0.002) {
          new spacebounce.AntimatterOrb(
            containers.orbs, b2Context
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

})(spacebounce.game || {});
