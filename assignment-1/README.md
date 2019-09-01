# 3802ICT - Modelling and Visualisation - Assignment 1

## Student: Lochie Ashcroft - s5080439

## Programming Language: [Typescript](https://github.com/microsoft/TypeScript)

## Development Environment

**Editor:** [Visual Studio Code](https://code.visualstudio.com/)

**Linter:** [TSLint](https://palantir.github.io/tslint/) (recommended configuration)

**Compiler:** [tsc](https://github.com/microsoft/TypeScript/tree/master/src/compiler)

**Build script:** `Makefile`

**Docs:** [TypeDoc](https://typedoc.org/) HTML and with the Markdown plugin

### Directory Structure

| Directory | Purpose                 |
| --------- | ----------------------- |
| docs      | documentation           |
| images    | images for `index.html` |
| js        | output of tsc           |
| sounds    | game sounds             |
| ts        | source code             |

**Using a makefile as this is not a node module**

```Make
all:
	tsc ./ts/*.ts --outDir ./js/ && browserify ./js/*.js -o game.js

clean:
	rm -rf ./js/*
```

- The Typescript source is located at `/ts/`
- The compiled Typescript is output to `/js/`
- [Browserify](http://browserify.org/) is then used to pack the contents of `/js/` into a single file called `game.js`
  - Browserify is used so in `index.html` only one javascript file needs to be sourced.
- **Optional** [uglify-js](https://www.npmjs.com/package/uglify-js) is ran to compress `game.js`

## Libraries that the project is based on

[HTML5 canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

# Game

In the classic Asteroids game, you steer a ship in space, clearing it of asteroids. Asteroids are destroyed by shooting
them, and if your ship collides with an asteroid, it is destroyed. Imaginary spaceship construction has improved since
the 80s. Now the hulls can withstand a collision and it is the easiest way to destroy the asteroids. Your spaceship will
be drawn with several filled polygons, at least one of which should be concave. The spaceship must only accelerate in
the direction it is pointing,so it must be able to rotate. Control the spaceship with keys. Asteroids should bounce off
the boundaries of the display. New asteroids should spawn at regular or random intervals, with 0 to many on screen at
the same time. How the game is scored is up to you, but a score must be visible (in the console as a last resort). At
least collisions should cause a sound effect.

The completed game can be found on my website http://lochieashcroft.com/asteroid/

## Game play

In the game Rameroids the player controls a space ship and the only goal is to collide with asteroids. There is a maximum number of asteroids that can be on the screen at any given time and
when the current number drops below this there is a random probability that an asteroid will spawn.

While playing the game the user can change the configuration.

- Toggle the view of the bounding boxes (hit boxes)
- Toggle the display of an FPS counter
- The game resolution
- The maximum number of asteroids ont he screen at once

## Controls

| Key | Action       |
| --- | ------------ |
| w   | thrust       |
| a   | rotate left  |
| d   | rotate right |

## Scoring

Points are earned by colliding into asteroids, 1 point per asteroid.

# Graphics Engine Documentation

Below is the output of Typedoc with the markdown plugin. For a better experience open `./docs/index.html` or go to my website http://lochieashcroft.com/asteroid/docs/ for the HTML version.
