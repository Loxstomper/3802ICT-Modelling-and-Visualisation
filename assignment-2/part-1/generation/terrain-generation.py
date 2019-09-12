#!/bin/python3
import json
from opensimplex import OpenSimplex
from random import randrange

class TerrainGenerator:
    def __init__(self, width=400, height=400, max_height=128, water_height=32, seed=randrange(10000)):
        self.width = width
        self.height = height
        self.max_height = max_height
        self.water_height = water_height
        self.seed = seed
        self.height_map = [[0] * width for _ in range(height)]
        self.simplex = OpenSimplex(seed)

    def noise(self, nx, ny):
        # 0 to self.max_height
        return (self.simplex.noise2d(nx, ny) / 2.0 + 0.5)* self.max_height

    def json(self):
        out = dict()
        out["seed"] = self.seed
        out["width"] = self.width
        out["height"] = self.height
        out["maxHeight"] = self.max_height
        out["waterHeight"] = self.water_height
        out["heightMap"] = self.height_map

        return json.dumps(out, indent=4)

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


    def generate(self, format="values"):
        for y in range(self.height):
            for x in range(self.width):
                nx = x  / self.width - 0.5
                ny = y / self.height - 0.5
                self.height_map[y][x] = self.noise(nx, ny)

        if format == "values":
            return self.height_map
        if format == "json":
            return self.json()
        if format == "plain":
            return self.plain()

    # def 

tg = TerrainGenerator(4, 4)
print(tg.generate("json"))


