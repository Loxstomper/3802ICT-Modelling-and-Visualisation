#include "headers/Terrain.hpp"

#define WIREFRAME true

Terrain::Terrain()
{
}

Terrain::Terrain(Json *config, GLfloat terrainLength, GLfloat terrainWidth)
{
    this->buildVerticies(config, terrainLength, terrainWidth);
    this->buildColours(config);
}

Terrain::~Terrain()
{
    std::cout << "Terrain DELETED" << std::endl;

    // TODO: cleanup
}

void Terrain::draw()
{
    if (WIREFRAME)
        glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    else
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(4, GL_FLOAT, 0, this->verticies);

    glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);

    glDisableClientState(GL_VERTEX_ARRAY);
}

// maybe return struct/class?
void Terrain::buildVerticies(Json *config, GLfloat terrainLength, GLfloat terrainWidth)
{
    this->length = (*config)["height"].get<GLfloat>();
    this->width = (*config)["width"].get<GLfloat>();

    std::cout << "Width: " << this->width << " "
              << "Length: " << this->length << std::endl;

    // alloc space and fill
    GLfloat **heightMap = new float *[this->length];
    for (int y = 0; y < this->length; y++)
    {
        (heightMap)[y] = new float[width];

        std::vector<GLfloat> test = (*config)["heightMap"][y].get<std::vector<GLfloat>>();

        for (int x = 0; x < width; x++)
        {
            (heightMap)[y][x] = test[x];
        }
    }

    this->verticies = new GLfloat[3 * this->length * this->width];

    // check if this is GLfloats
    GLfloat zStep = (GLfloat)(terrainWidth / this->width);
    GLfloat xStep = (GLfloat)(terrainLength / this->length);

    std::cout << "xStep: " << xStep << " "
              << "zStep: " << zStep << std::endl;

    for (int i = 0; i < this->length * this->width * 3; i += 3)
    {
        this->verticies[i] = ((i / 3) % this->length) * xStep;    // x
        this->verticies[i + 1] = 4;                               // y  - heightMap[y][x]
        this->verticies[i + 2] = ((i / 3) % this->width) * zStep; // z

        if (i % 4 == 0)
        {
            std::cout << "\n";
        }

        std::cout << "( " << this->verticies[i] << ", " << this->verticies[i + 1] << ", " << this->verticies[i + 2] << " ), ";
    }

    std::cout << std::endl;

    this->numberTriangles = this->length * this->width * 2;

    // delete heightMap -- when to do this because of the colour values can base of the Y value of the verticies though
}

void Terrain::buildColours(Json *config)
{
    // RGBA
    this->colours = new GLfloat[4 * this->length * this->width];

    // look at all the Z values and add colour based off that
    int colour_i = 0;
    for (int i = 2; i < (this->length * this->width) - 2; i++)
    {
        this->colours[colour_i] = 1.0;
        this->colours[colour_i + 1] = 1.0;
        this->colours[colour_i + 2] = 1.0;
        this->colours[colour_i + 3] = 1.0;
        colour_i += 4;
    }
}
