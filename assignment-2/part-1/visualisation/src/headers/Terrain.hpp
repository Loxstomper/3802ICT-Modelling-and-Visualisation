#pragma once

#include <string>
#include <fstream>

#include <GL/gl.h>

#include "json.hpp"

#include "Colours.hpp"

using Json = nlohmann::json;

class Terrain
{
private:
    GLfloat waterHeight, maxHeight;
    GLfloat **heightMap;
    GLfloat length, width;
    int numberX, numberZ;

    void drawWater();
    void drawTerrain();
    void buildHeightMap(std::string path);
    GLfloat *getColour(GLfloat y);
    Colours colours;

public:
    Terrain(std::string path);
    Terrain(int length, int width, GLfloat frequency, int octaves);
    Terrain();

    void load(std::string path);
    void generate(int length, int width, GLfloat frequency, int octaves);

    GLfloat getWaterHeight();
    void setWaterHeight(GLfloat y);

    void draw(bool wireframe);
};