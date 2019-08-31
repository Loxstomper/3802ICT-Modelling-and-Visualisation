# 3802ICT - Modelling and Visualisation - Assignment 1

In the classic Asteroids game, you steer a ship in space, clearing it of asteroids. Asteroids are destroyed by shooting them, and if your ship collides with an asteroid, it is destroyed. Imaginary spaceship construction has improved since the 80s. Now the hulls can withstand a collision and it is the easiest way to destroy the asteroids. Your spaceship will be drawn with several filled polygons, at least one of which should be concave. The spaceship must only accelerate in the direction it is pointing, so it must be able to rotate. Control the spaceship with keys. Asteroids should bounce off the boundaries of the display. New asteroids should spawn at regular or random intervals, with 0 to many on screen at the same time. How the game is scored is up to you, but a score must be visible (in the console as a last resort). At least collisions should cause a sound effect.

# Solution

This task was accomplished using the HTML5 canvas and Typescript.
Lochie's Graphics Engine (LGE) was created using the DDA line drawing algorithm and scan line fill algorithm, these functions
take polygons as inputs and the points are extracted. The pixel size is configurable this results to the low level functions
drawing individual pixels where each pixel is a rectangle of size PIXEL_SIZE x PIXEL_SIZE, this rectangle is then drawn using
the HTML5 canvas API.

A game engine was then built that utilises LGE with a game loop, setup, update and draw function. The update function handles the physics of the game and uses the duration between the rendered frames to update the objects correctly.
