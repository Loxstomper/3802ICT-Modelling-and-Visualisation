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

    // check this
    // glColor4fv(this->colours);

    glDrawArrays(GL_TRIANGLES, 0, this->length * this->width * 2);

    glDisableClientState(GL_VERTEX_ARRAY);
}

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

    // check if this is GLfloats
    GLfloat zStep = (GLfloat)(terrainWidth / this->width);
    GLfloat xStep = (GLfloat)(terrainLength / this->length);

    std::cout << "xStep: " << xStep << " "
              << "zStep: " << zStep << std::endl;

    // 2d respresentation of the mesh
    this->verticies = new GLfloat *[this->length];
    for (int y = 0; y < this->length; y++)
    {
        (this->verticies)[y] = new GLfloat[this->width * 3];

        std::vector<GLfloat> test = (*config)["heightMap"][y].get<std::vector<GLfloat>>();

        for (int x = 0; x < this->width * 3; x += 3)
        {
            (this->verticies)[y][x] = (x / 3) * xStep;           // x
            (this->verticies)[y][x + 1] = (heightMap)[y][x / 3]; // y
            (this->verticies)[y][x + 2] = y * zStep;             // z

            std::cout << "( " << this->verticies[y][x] << ", " << this->verticies[y][x + 1] << ", " << this->verticies[y][x + 2] << " ), ";
        }

        std::cout << "\n";
    }

    std::cout << "\n";

    // not using triangle strip yet, just multiple triangles
    this->numberTriangles = this->length * this->width * 2 * 3; // 3 because 3 points

    // delete heightMap -- when to do this because of the colour values can base of the Y value of the verticies though
}

void Terrain::buildTriangles()
{
    // top left, top right, bottom left, bottom right
    static GLfloat TLx, TLy, TLz, TRx, TRy, TRz, BLx, BLy, BLz, BRx, BRy, BRz;

    for (int y = 0; y < this->length - 1; y++)
    {
        for (int x = 0; x < (this->width * 3) - 3; x += 3)
        {
            // top left
            TLx = this->verticies[y][x];
            TLy = this->verticies[y][x + 1];
            TLz = this->verticies[y][x + 2];

            // top right
            TRx = this->verticies[y][x + 3];
            TRy = this->verticies[y][x + 4];
            TRz = this->verticies[y][x + 5];

            // bottom left
            BLx = this->verticies[y + 1][x];
            BLy = this->verticies[y + 1][x + 1];
            BLz = this->verticies[y + 1][x + 2];

            // bottom right
            BRx = this->verticies[y + 1][x + 1];
            BRy = this->verticies[y + 1][x + 1];
            BRz = this->verticies[y + 1][x + 2];

            // triangle 1
            this->triangles[x] = TLx;
            this->triangles[x + 1] = TLy;
            this->triangles[x + 2] = TLz;

            this->triangles[x + 3] = TRx;
            this->triangles[x + 4] = TRy;
            this->triangles[x + 5] = TRz;

            this->triangles[x + 6] = BRx;
            this->triangles[x + 7] = BRy;
            this->triangles[x + 8] = BRz;

            // triangle 2
            this->triangles[x + 9] = TLx;
            this->triangles[x + 10] = TLy;
            this->triangles[x + 11] = TLz;

            this->triangles[x + 12] = BLx;
            this->triangles[x + 13] = BLy;
            this->triangles[x + 14] = BLz;

            this->triangles[x + 15] = BRx;
            this->triangles[x + 16] = BRy;
            this->triangles[x + 17] = BRz;
        }
    }
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
