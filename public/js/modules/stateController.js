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
      mainGame.menuController.clearMenu();
      createjs.Ticker.removeEventListener('tick', backgroundTick);
      player = new spacebounce.Player(
        mainGame.containers.player, mainGame.box2dContext
      );
      createjs.Ticker.addEventListener('tick', gameRunningTick);
      amplify.publish('game-active');
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

    function endGame() {
      mainGame.box2dContext.enqueAllBodiesForRemoval();
      createjs.Ticker.removeEventListener('tick', gameRunningTick);
      createjs.Ticker.addEventListener('tick', backgroundTick);
      mainGame.menuController.launchNewMenu('gameover');
      amplify.publish('game-inactive');
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
        if ((orbDelayCounter % 80) == 0) {
           new spacebounce.EnergyOrb(
             mainGame.containers.orbs, mainGame.box2dContext
            );
        }

        if (Math.random()<0.002) {
          new spacebounce.AntimatterOrb(
            mainGame.containers.orbs, mainGame.box2dContext
          );
        }

        mainGame.energyGuage.tick(player.energySupply);

        mainGame.box2dContext.update();
        mainGame.stage.update(event);
    }

    function getPlayerInstance() {
      return player;
    }

    return {
      getPlayerInstance: getPlayerInstance,
      endGame: endGame
    }

})(spacebounce.mainGame);
