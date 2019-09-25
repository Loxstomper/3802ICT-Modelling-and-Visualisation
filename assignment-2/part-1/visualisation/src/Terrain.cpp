#include "headers/Terrain.hpp"

Terrain::Terrain(std::string path)
{
    this->length = 2.0;
    this->width = 2.0;

    this->load(path);

    this->waterHeight = -0.4;
    this->maxHeight = 1;
}

Terrain::Terrain(int length, int width, GLfloat frequency, int octaves)
{
    this->length = 2.0;
    this->width = 2.0;

    this->generate(length, width, frequency, octaves);
    this->waterHeight = -0.4;
    this->maxHeight = 1;
}

Terrain::Terrain()
{
    this->length = 2.0;
    this->width = 2.0;

    this->generate(400, 400, 10.0, 3);
    this->waterHeight = -0.4;
    this->maxHeight = 1;
}

void Terrain::load(std::string path)
{
    this->buildHeightMap(path);
}

void Terrain::generate(int length, int width, GLfloat frequency, int octaves)
{
    system("../generation/terrain-generation.py 400 400 10 > data.json");
    this->buildHeightMap("data.json");
}

void Terrain::draw(bool wireframe)
{
    // enable wireframe
    if (wireframe)
        glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    this->drawTerrain();

    // disable wireframe
    if (wireframe)
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

    this->drawWater();
}

void Terrain::drawTerrain()
{
    int numberVertices = numberZ * numberX;

    GLfloat terrainVerts[numberVertices * 3];

    GLfloat xStep = (this->length * 2) / (GLfloat)(numberX - 1);
    GLfloat zStep = (this->width * 2) / (GLfloat)(numberZ - 1);

    int index = 0;

    for (int z = 0; z < numberZ; z++)
    {
        for (int x = 0; x < numberX; x++)
        {
            GLfloat y = heightMap[x][z];

            terrainVerts[index + 0] = (x * xStep) - this->length;
            terrainVerts[index + 1] = y * this->maxHeight;
            terrainVerts[index + 2] = (z * zStep) - this->width;

            index += 3;
        }
    }

    GLfloat colors[numberVertices * 4];

    for (int i = 0; i < numberVertices; i++)
    {
        // 4 values per colour
        int index = i * 4;

        GLfloat y = terrainVerts[i * 3 + 1];

        GLfloat *colour = this->getColour(y / maxHeight);

        colors[index++] = colour[0]; // red
        colors[index++] = colour[1]; // green
        colors[index++] = colour[2]; // blue
        colors[index] = colour[3];   // alpha
    }

    unsigned int numberIndices = (numberZ - 1) * (numberX - 1) * 4;
    unsigned int indicies[numberIndices];

    int count = 0;
    index = 0;

    for (int i = 0; i < numberIndices; i++)
    {
        count++;
        if (count == numberX)
        {
            count = 0;
            continue;
        }

        // std::cout << "I: " << i << std::endl;

        indicies[index + 0] = i;
        indicies[index + 1] = i + 1;
        indicies[index + 2] = i + numberX + 1;
        indicies[index + 3] = i + numberX;

        index += 4;

        if (index >= numberIndices)
        {
            break;
        }
    }

    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_COLOR_ARRAY);

    // buffers
    glVertexPointer(3, GL_FLOAT, 0, terrainVerts);
    glColorPointer(4, GL_FLOAT, 0, colors);

    // draw the quads
    glDrawElements(GL_QUADS, numberIndices, GL_UNSIGNED_INT, indicies);

    /* Cleanup states */
    glDisableClientState(GL_COLOR_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);
}

void Terrain::buildHeightMap(std::string path)
{
    std::ifstream file(path);

    Json json;

    file >> json;

    this->numberX = json["width"].get<int>();
    this->numberZ = json["height"].get<int>();

    this->heightMap = new GLfloat *[this->numberZ];

    // copy height map values
    for (int i = 0; i < numberZ; i++)
    {
        this->heightMap[i] = new GLfloat[this->numberX];

        std::vector<GLfloat> temp = json["heightMap"][i].get<std::vector<GLfloat>>();
        for (int j = 0; j < numberX; j++)
        {
            this->heightMap[i][j] = temp[j];
        }
    }
}

void Terrain::drawWater()
{
    GLfloat vertices[] =
        {
            -this->width, -1, -this->length,
            -this->width, -1, this->length,
            -this->width, this->waterHeight, this->length,
            -this->width, this->waterHeight, -this->length,
            this->width, -1, -this->length,
            this->width, -1, this->length,
            this->width, this->waterHeight, this->length,
            this->width, this->waterHeight, -this->length,
            -this->width, -1, -this->length,
            -this->width, -1, this->length,
            this->width, -1, this->length,
            this->width, -1, -this->length,
            -this->width, this->waterHeight, -this->length,
            -this->width, this->waterHeight, this->length,
            this->width, this->waterHeight, this->length,
            this->width, this->waterHeight, -this->length,
            -this->width, -1, -this->length,
            -this->width, this->waterHeight, -this->length,
            this->width, this->waterHeight, -this->length,
            this->width, -1, -this->length,
            -this->width, -1, this->length,
            -this->width, this->waterHeight, this->length,
            this->width, this->waterHeight, this->length,
            this->width, -1, this->length};

    // blue - 50%
    GLfloat color[] = {0, 0, 1, 0.5};

    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, vertices);

    glColor4fv(color);

    glDrawArrays(GL_QUADS, 0, 24);

    glDisableClientState(GL_VERTEX_ARRAY);
}

GLfloat *Terrain::getColour(GLfloat y)
{
    static GLfloat sand[] = {0.93, 0.79, 0.69, 1};
    static GLfloat grass[] = {0.48, 0.8, 0, 1};
    static GLfloat rock[] = {0.2, 0.2, 0.26, 1};
    static GLfloat snow[] = {1, 0.98, 0.98, 1};

    if (y <= 0.1)
        return sand;

    if (y <= 0.5)
        return grass;

    if (y <= 0.8)
        return rock;

    return snow;
}

GLfloat Terrain::getWaterHeight()
{
    return this->waterHeight;
}

void Terrain::setWaterHeight(GLfloat y)
{
    this->waterHeight = y;
}