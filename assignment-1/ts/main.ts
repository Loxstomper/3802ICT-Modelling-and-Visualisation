import { Asteroid, asteroidFactory } from "./Asteroid";
import { Colours } from "./Colour";
import { LGE } from "./LGE";
import { Player } from "./Player";
import { Utils } from "./Utils";

/**
 * Ran on start
 */
const setup = () => {
  // Fetch canvas and set size
  Game.canvas = document.getElementById("canvas") as HTMLCanvasElement;
  Game.canvasCtx = Game.canvas.getContext("2d");
  Game.canvas.width = Game.config.resolution.x;
  Game.canvas.height = Game.config.resolution.y;

  // Event listeners for input
  window.addEventListener("keydown", Game.input.onKeyDown, false);
  window.addEventListener("keyup", Game.input.onKeyUp, false);
  window.addEventListener("click", Game.filters.switchFilter, false);

  // Instantiate graphics engine
  Game.graphicsEngine = new LGE(
    Game.canvasCtx,
    Game.config.pixelSize,
    "scanLine"
  );

  // Instantiate player
  Game.objects.player = new Player(Game.config.resolution);

  // create the initial asteroids
  while (Game.state.numberAsteroids < Game.config.maxNumberAsteroids) {
    Game.objects.asteroids.push(asteroidFactory(Game.config.resolution));
    Game.state.numberAsteroids++;
  }
};

/**
 * Called before Draw function.
 * Updates the physics
 *
 */
const update = () => {
  // updates
  Game.objects.player.update(Game.input.pressedKeys, Game.state.frameTimeDelta);

  // split on purpose
  Game.objects.asteroids.forEach((a: Asteroid, index: number) => {
    a.handleCollision(Game.objects.asteroids, index);
  });

  Game.objects.asteroids.forEach((a: Asteroid, index: number) => {
    a.update(Game.state.frameTimeDelta);
  });

  const prevAsteroids: number = Game.state.numberAsteroids;
  Game.state.numberAsteroids -= Game.objects.player.handleCollision(
    Game.objects.asteroids
  );

  if (prevAsteroids !== Game.state.numberAsteroids) {
    new Audio(Game.sounds.explosion).play();
  }

  if (
    Game.state.numberAsteroids < Game.config.maxNumberAsteroids &&
    Utils.randomInt(10) <= Game.config.asteroidSpawnProbability
  ) {
    Game.objects.asteroids.push(asteroidFactory(Game.config.resolution));
    Game.state.numberAsteroids++;
  }
};

/**
 * Draws frame
 */
const draw = () => {
  Game.graphicsEngine.clear();

  const toDraw = [...Game.objects.player.body, ...Game.objects.asteroids];

  if (Game.objects.player.isBoosted) {
    Game.sounds.thrust.play();
    toDraw.push(...Game.objects.player.flames);
  } else {
    if (!Game.sounds.thrust.paused) {
      Game.sounds.thrust.pause();
      Game.sounds.thrust.currentTime = 0;
    }
  }

  // do this then commit
  if (Game.config.showBoundingBoxes) {
    toDraw.push(Game.objects.player.boundingBox);

    Game.objects.asteroids.forEach((a: Asteroid) => {
      toDraw.push(a.boundingBox);
    });
  }

  Game.graphicsEngine.drawPolygonBuffer(toDraw);

  Game.canvasCtx.fillStyle = Colours.white.toString();
  Game.canvasCtx.font = "30px Arial";

  if (Game.config.showFps) {
    Game.canvasCtx.fillText(`Score: ${Game.objects.player.score}`, 10, 50);
    Game.canvasCtx.fillText(
      `FPS: ${Math.floor(1 / Game.state.frameTimeDelta)}`,
      10,
      100
    );
  }
};

/**
 * Key press event
 * @param e
 */
const onKeyDown = (e: KeyboardEvent) => {
  Game.input.pressedKeys[e.keyCode] = true;
};

/**
 * Key release event
 * @param e
 */
const onKeyUp = (e: KeyboardEvent) => {
  Game.input.pressedKeys[e.keyCode] = false;
};

/**
 * Switches applied CSS filter to the canvas
 */
const switchFilter = () => {
  Game.canvas.style.filter = Game.filters.list[Game.filters.selectedFilter];
  Game.filters.selectedFilter =
    (Game.filters.selectedFilter + 1) % Game.filters.list.length;
};

const Game = {
  canvas: null,
  canvasCtx: null,
  config: {
    asteroidSpawnProbability: 1,
    maxNumberAsteroids: 10,
    pixelSize: 4,
    resolution: { x: 1280, y: 720 },
    showBoundingBoxes: true,
    showFps: true
  },
  draw: draw,
  filters: {
    list: [
      "",
      "blur(2px)",
      "hue-rotate(90deg)",
      "grayscale(100%)",
      "invert(100%)",
      "saturate(200%)"
    ],
    selectedFilter: 0,
    switchFilter: switchFilter
  },
  graphicsEngine: null,
  input: {
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    pressedKeys: {}
  },
  objects: {
    asteroids: [],
    player: null
  },
  setup: setup,
  sounds: {
    explosion: "./sounds/explosion.mp3", // multiple instances
    thrust: new Audio("./sounds/rocket.mp3") // only one instance
  },
  state: {
    frameTimeDelta: 0,
    lastFrameTime: 0,
    numberAsteroids: 0
  },
  update: update
};

/**
 * The game loop
 * @param timestamp time since last called
 */
const loop = (timestamp: number) => {
  // Calculate delta
  Game.state.frameTimeDelta = (timestamp - Game.state.lastFrameTime) / 1000;
  Game.state.lastFrameTime = timestamp;

  Game.update();
  Game.draw();

  // Call the game loop on the next animation frame
  requestAnimationFrame(loop);
};

// Setup game
Game.setup();
// Start the game loop
requestAnimationFrame(loop);
