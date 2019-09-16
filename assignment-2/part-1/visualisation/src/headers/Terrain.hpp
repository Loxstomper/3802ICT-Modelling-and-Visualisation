#pragma once

#include <iostream>
#include <GL/glut.h>

#include "json.hpp"

using Json = nlohmann::json;

class Terrain
{
private:
    // maybe return struct/class?
    void buildVerticies(Json *config, GLfloat terrainLength, GLfloat terrainWidth);

    void buildColours(Json *config);

public:
    GLfloat *verticies;
    GLfloat *triangles;
    GLfloat *colours;
    GLfloat waterHeight;
    int length;
    int width;
    int numberTriangles;

    Terrain();
    Terrain(Json *config, GLfloat terrainLength, GLfloat terrainWidth);

    ~Terrain();

    void draw();
};