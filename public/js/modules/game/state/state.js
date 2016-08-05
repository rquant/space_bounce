/*
 *  This module is essentailly the core of the application, and controls the
    state and logic of the game. Other modules and classes communicate with this
    module directly, rather than directly comunicating with other modules to
    avoid tight coupling.
 */
spacebounce.game = spacebounce.game || {};

spacebounce.game.state = (function (game, state) {
    var config = spacebounce.config;
    var b2Context = spacebounce.box2dContext;
    var containers = game.containers;
    var hud = game.hud;

    var player;
    // the number of ticks remaining in Ticker before game ends
    var ticksRemaining;
    var orbDelayCounter;

    const FPS = config.framerate;
    const STAGE_WIDTH = config.stage.width;
    const STAGE_HEIGHT = config.stage.height;
    const STAR_COUNT = config.background.stars.count;

    function welcomeUser () {
      createjs.Ticker.addEventListener('tick', backgroundTick);
      state.menu.launchNewMenu('welcome');
    }

    function beginGame () {
      state.menu.clearMenu();
      containers.hud.visible = true;
      createjs.Ticker.removeEventListener('tick', backgroundTick);
      player = new spacebounce.Player(
        containers.player, b2Context
      );
      ticksRemaining = FPS * config.gameplay.timeRemaining;
      orbDelayCounter = 0;
      createjs.Ticker.addEventListener('tick', gameRunningTick);
      amplify.publish('game-active');
    }

    function pauseGame () {
      containers.hud.visible = false;
      createjs.Ticker.removeEventListener('tick', gameRunningTick);
      createjs.Ticker.addEventListener('tick', backgroundTick);
      state.menu.launchNewMenu('pause');
      amplify.publish('game-inactive');
    }

    function resumeGame() {
      state.menu.clearMenu();
      containers.hud.visible = true;
      createjs.Ticker.removeEventListener('tick', backgroundTick);
      createjs.Ticker.addEventListener('tick', gameRunningTick);
      amplify.publish('game-active');
    }

    function endGame(menuName) {
      b2Context.enqueAllBodiesForRemoval();
      containers.hud.visible = false;
      createjs.Ticker.removeEventListener('tick', gameRunningTick);
      createjs.Ticker.addEventListener('tick', backgroundTick);
      state.menu.launchNewMenu(menuName);
      amplify.publish('game-inactive');
    }

    // executes single step of background aniation when gameplay is inactive
    function backgroundTick() {
        starFieldAnimation();
        game.stage.update();
    }

    function starFieldAnimation() {
      for(var i=0; i < STAR_COUNT; i++) {
        var s = containers.stars.children[i];
        if (s.y>=STAGE_HEIGHT) {
            s.x = Math.floor(Math.random() * STAGE_WIDTH);
            s.y = 0;
        }
        s.tick();
      }
    }

    // executes a single step of active gameplay
    function gameRunningTick(event) {
      // The amount of ticks remaining until the game ends
        if (ticksRemaining <= 0)
          endGame('gamecompleted');

        starFieldAnimation();
        //generate energy orbs randomly
        orbDelayCounter++;
        if ((orbDelayCounter % 80) == 0) {
           new spacebounce.EnergyOrb(
             containers.orbs, b2Context, config.gameplay.energyOrbVal
            );
        }

        if (Math.random()<0.002) {
          new spacebounce.AntimatterOrb(
            containers.orbs, b2Context, config.gameplay.antimatterOrbVal
          );
        }

        if (player) {
          hud.energyGuage.tick(player.energySupply);
          hud.timerDisplay.tick(ticksRemaining);
          ticksRemaining--;
        }

        b2Context.update();
        game.stage.update(event);
    }

    /*
      The subscriptions submodule acts as a mediator, and passively controls
      game state based on observations of events happening in the app that
      other modules publish. This decreases coupling.
    */
    state.subscriptions = (function() {
      amplify.subscribe('player-exits-boundary', function() {
        endGame('gameover');
      });

      amplify.subscribe('player-energy-depleted', function() {
        endGame('gameover');
      });

      amplify.subscribe('player-contacts-forcefield', function(forceField) {
        createjs.Sound.play("Bounce");
        forceField.markedForRemoval = true;
      });

      amplify.subscribe('player-consumes-energyorb', function(player, orb) {
        player.increaseEnergySupply(orb.energyVal);
        orb.markedForRemoval = true;
        createjs.Sound.play("Absorb");
      });

      amplify.subscribe('player-consumes-antimatterorb', function(player, orb) {
        player.decreaseEnergySupply(orb.energyVal);
        orb.markedForRemoval = true;
        orb.terminateWithTween = true;
        createjs.Sound.play("Absorb");
      });
    })();

    state.welcomeUser = welcomeUser;
    state.beginGame = beginGame;
    state.pauseGame = pauseGame;
    state.resumeGame = resumeGame;
    state.endGame = endGame;

    return state;

})(spacebounce.game || {}, spacebounce.game.state || {});
