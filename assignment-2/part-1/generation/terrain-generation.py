#!/bin/python3
import json
import argparse
from opensimplex import OpenSimplex
from random import randrange
from collections import OrderedDict

class Colour:
    def __init__(self, name, height, values):
        self.name = name
        self.height = height
        self.values = values
    
    def json(self):
        out = OrderedDict()
        out["name"] = self.name
        out["height"] = self.height
        out["values"] = self.values

        return out


class TerrainGenerator:
    def __init__(self, width=400, height=400, max_height=128, water_height=32, seed=randrange(10000)):
        self.width = width
        self.height = height
        self.max_height = max_height
        self.water_height = water_height
        self.seed = seed
        self.height_map = [[0] * width for _ in range(height)]
        self.simplex = OpenSimplex(seed)

        colours = [
            Colour("water", None, [0.0, 0.0, 1.0, 0.5]),
            Colour("rock1", 0, [0.0, 1.0, 0.0, 1.0]),
            Colour("grass", 10, [0.0, 1.0, 0.0, 1.0]),
            Colour("rock2", 50, [0.0, 1.0, 0.0, 1.0]),
            Colour("snow", 100, [1.0, 1.0, 1.0, 1.0])
        ]

        self.colours = [c.json() for c in colours]

    def noise(self, nx, ny):
        # 0 to self.max_height
        # return (self.simplex.noise2d(nx, ny) / 2.0 + 0.5)* self.max_height
        return (self.simplex.noise2d(nx, ny) / 2.0 + 0.5) * 2 - 1

    def json(self):
        out = OrderedDict()
        out["seed"] = self.seed
        out["width"] = self.width
        out["height"] = self.height
        out["maxHeight"] = self.max_height
        out["waterHeight"] = self.water_height
        out["colours"] = self.colours
        out["heightMap"] = self.height_map

        # return json.dumps(out, indent=4)
        return json.dumps(out)

    def plain(self):
        out = str()
        out += str(self.seed) + "\n"
        out += str(self.width) + "\n"
        out += str(self.height) + "\n"
        out += str(self.max_height) + "\n"
        out += str(self.water_height) + "\n"

        for y in range(self.height):
            for x in range(self.width):
                out += str(self.height_map[y][x]) + "\n"

        print(out)


    def generate(self, freq=1, octaves=1, format="values"):
        for y in range(self.height):
            for x in range(self.width):
                nx = x  / self.width - 0.5
                ny = y / self.height - 0.5

                value = 0

                for i in range(octaves):
                    value += (1 / (2 ** i)) * self.noise((2 ** i) * freq * nx, (2 ** i) * freq * ny)
                
                self.height_map[y][x] = value


        if format == "values":
            return self.height_map
        if format == "json":
            return self.json()
        if format == "plain":
            return self.plain()

    # def 

parser = argparse.ArgumentParser(description="Generate a height map")
parser.add_argument('length', metavar='-l', type=int, help='the length of the terrain')
parser.add_argument('width', metavar='-w', type=int, help='the width of the terrain')
parser.add_argument('frequency', metavar='-f', type=float, help='the frequency')
parser.add_argument('octaves', metavar='-o', type=int, help='the number of octaves')

args = parser.parse_args()


tg = TerrainGenerator(args.length, args.width)
print(tg.generate(args.frequency, args.octaves, "json"))


