#include <iostream>
#include <GL/glut.h>

#include "./headers/Terrain.hpp"
#include "headers/json.hpp"

using Json = nlohmann::json;

class Terrain 
{
    private:

    // maybe return struct/class?
    void buildVerticies(Json *config, GLfloat terrainLength, GLfloat terrainWidth)
    {
        this->length = (*config)["height"].get<int>();
        this->width = (*config)["width"].get<int>();

        this->waterHeight =  (GLfloat) (*config)["waterHeight"].get<int>();
        std::cout << "Width: " << this->width << " " << "Length: " << this->length  << std::endl;

        // alloc space and fill
        *heightMap = new float *[this->length];
        for (int y = 0; y < this->length; y++)
        {
            (*heightMap)[y] = new float[width];

            std::vector<float> test = (*config)["heightMap"][y].get<std::vector<float>>();
            for (int x = 0; x < width; x++)
            {
                (*heightMap)[y][x] = test[x];
            }
        }

        this->verticies = new GLfloat[3 * this->length * this->width];

        // check if this is GLfloats
        GLfloat zStep = (GLfloat) (terrainWidth / this->width);
        GLfloat xStep = (GLfloat) (terrainLength / this->length);

        for (int i = 0; i < this->length * this->width; i += 3) 
        {
            this->verticies[i] =  1; // x
            this->verticies[i + 1] = 1; // y
            this->verticies[i + 2] = 1; // z
        }

        this->numberTriangles = this->length * this->width * 2;
    }

    void buildColours(nlohmann::json* config) 
    {
        // RGBA
        this->colours = new GLfloat[4 * this->length * this->width];

        // look at all the Z values and add colour based off that
        int colour_i = 0;
        for(int i = 2; i < (this->length * this->width) - 2; i ++) {
            this->colours[colour_i] = 1.0;
            this->colours[colour_i + 1] = 1.0;
            this->colours[colour_i + 2] = 1.0;
            this->colours[colour_i + 3] = 1.0;
            colour_i += 4;
        }
    }


    public:

    GLfloat* verticies;
    GLfloat* triangles;
    GLfloat* colours;
    GLfloat waterHeight;
    int length;
    int width;
    int numberTriangles;
    

    Terrain(nlohmann::json* config, GLfloat terrainLength, GLfloat terrainWidth) 
    {
        this->buildVerticies(config, terrainLength, terrainWidth);
        this->buildColours(config);
    }

};





};