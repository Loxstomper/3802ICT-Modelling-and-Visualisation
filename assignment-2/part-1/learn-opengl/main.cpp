#include <iostream>
#include <iomanip>
#include <fstream>
#include <vector>

#include <GL/glut.h>
#include <GL/gl.h>

#define GL_GLEXT_PROTOTYPES
#include <GL/gl.h>
#include <GL/glu.h>
#include <GL/glx.h>
#include <GL/glext.h>

#include "json.hpp"

using Json = nlohmann::json;

#define SCREEN_HEIGHT_DEFAULT 800
#define SCREEN_WIDTH_DEFAULT 800
#define WIREFRAME false
#define FOV 60
#define ASPECT_RATIO SCREEN_WIDTH / SCREEN_HEIGHT
#define NEAR_CLIPPING_PLANE 0.1
#define FAR_CLIPPING_PLANE 50000.0

GLfloat WATER_HEIGHT = 0;

// GLfloat TERRAIN_WIDTH = 1.0;
// GLfloat TERRAIN_LENGTH = 1.0;
GLfloat TERRAIN_WIDTH = 10.0;
GLfloat TERRAIN_LENGTH = 10.0;

GLfloat SCREEN_WIDTH = SCREEN_WIDTH_DEFAULT;
GLfloat SCREEN_HEIGHT = SCREEN_HEIGHT_DEFAULT;
GLfloat HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2.0;
GLfloat HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2.0;

GLfloat CURRENT_Z_DEPTH = -10;

GLfloat** heightMap;

GLfloat alpha = 0;

GLfloat up = 0;

GLfloat maxHeight = 1.0;

int numberX;
int numberZ;

class Point3
{
public:
    Point3(GLfloat x, GLfloat y, GLfloat z)
    {
        this->x = x;
        this->y = y;
        this->z = z;
    }

    GLfloat x;
    GLfloat y;
    GLfloat z;
};

Point3 map[2][2] = {
    {Point3(0, 0, 0), Point3(1, 0, 0)},
    {Point3(0, 0, -1), Point3(1, 0, -1)}};

void buildHeightMap(std::string path) 
{
    std::ifstream file(path);

    Json json;

    file >> json;

    // x
    int length = json["width"].get<int>();
    // z
    int width = json["height"].get<int>();

    numberX = length;
    numberZ = width;

    heightMap = new GLfloat*[width];

    for (int i = 0; i < width; i ++) {
        heightMap[i] = new GLfloat[length];

        std::vector<GLfloat> temp = json["heightMap"][i].get<std::vector<GLfloat>>();
        for (int j = 0; j < length; j ++)
        {
            heightMap[i][j] = temp[j];
        }
    }
}

GLfloat* getColour(GLfloat y)
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

/* GLUT callback Handlers */
static void onWindowResize(int width, int height)
{
    SCREEN_HEIGHT = height;
    SCREEN_WIDTH = width;

    // TERRAIN_WIDTH = SCREEN_WIDTH / 2;
    // TERRAIN_LENGTH = SCREEN_HEIGHT / 2;

    // glViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    // glMatrixMode(GL_PROJECTION);
    // glLoadIdentity();
    // glOrtho(0, SCREEN_WIDTH, 0, SCREEN_HEIGHT, 0, 1);
    // glMatrixMode(GL_MODELVIEW);
    // glLoadIdentity();

    glMatrixMode(GL_PROJECTION_MATRIX);
    glLoadIdentity();
    // gluPerspective(60, (double)SCREEN_WIDTH / (double)SCREEN_HEIGHT, 0.1, 1000);
    gluPerspective(60, (double)SCREEN_WIDTH / (double)SCREEN_HEIGHT, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

    glMatrixMode(GL_MODELVIEW_MATRIX);
    // glTranslatef(0, 0, -5);
    glTranslatef(0, 0, CURRENT_Z_DEPTH);
}

void drawTerrain()
{
    int numberVertices = numberZ * numberX;

    GLfloat terrainVerts[numberVertices * 3];

    GLfloat xStep = (TERRAIN_LENGTH * 2 )/ (GLfloat)(numberX - 1);
    GLfloat zStep = (TERRAIN_WIDTH * 2 )/ (GLfloat)(numberZ - 1);


    int index = 0;

    for (int z = 0; z < numberZ; z++)
    {
        for (int x = 0; x < numberX; x++)
        {
            GLfloat y = heightMap[x][z];

            terrainVerts[index + 0] = (x * xStep) - TERRAIN_LENGTH;
            terrainVerts[index + 1] = y * maxHeight;
            terrainVerts[index + 2] = (z * zStep) - TERRAIN_WIDTH;

            index += 3;
        }
    }

    GLfloat colors[numberVertices * 4];

    for (int i = 0; i < numberVertices; i++)
    {
        // 4 values per colour
        int index = i * 4;

        GLfloat y = terrainVerts[i * 3 + 1];

        GLfloat* colour = getColour(y / maxHeight);

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

        if (index >= numberIndices) {
            break;
        }
    }

    // for (int i = 0; i < numberIndices; i++)
    // {
    //     if (i != 0 && i % 4 == 0)
    //         std::cout << "\n";
    //     std::cout << indicies[i] << ", ";
    // }

    // std::cout << std::endl;

    if (WIREFRAME)
        glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_COLOR_ARRAY);
    // glVertexPointer(3, GL_FLOAT, 0, vertices);
    glVertexPointer(3, GL_FLOAT, 0, terrainVerts);
    glColorPointer(4, GL_FLOAT, 0, colors);

    // draw the quads
    glDrawElements(GL_QUADS, numberIndices, GL_UNSIGNED_INT, indicies);

    if (WIREFRAME)
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

    /* Cleanup states */
    glDisableClientState(GL_COLOR_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);
}

void drawWater()
{
    // only update if change

    GLfloat vertices[] =
        {
            -TERRAIN_WIDTH, -1, -TERRAIN_LENGTH,
            -TERRAIN_WIDTH, -1, TERRAIN_LENGTH,
            -TERRAIN_WIDTH, WATER_HEIGHT, TERRAIN_LENGTH,
            -TERRAIN_WIDTH, WATER_HEIGHT, -TERRAIN_LENGTH,
            TERRAIN_WIDTH, -1, -TERRAIN_LENGTH,
            TERRAIN_WIDTH, -1, TERRAIN_LENGTH,
            TERRAIN_WIDTH, WATER_HEIGHT, TERRAIN_LENGTH,
            TERRAIN_WIDTH, WATER_HEIGHT, -TERRAIN_LENGTH,
            -TERRAIN_WIDTH, -1, -TERRAIN_LENGTH,
            -TERRAIN_WIDTH, -1, TERRAIN_LENGTH,
            TERRAIN_WIDTH, -1, TERRAIN_LENGTH,
            TERRAIN_WIDTH, -1, -TERRAIN_LENGTH,
            -TERRAIN_WIDTH, WATER_HEIGHT, -TERRAIN_LENGTH,
            -TERRAIN_WIDTH, WATER_HEIGHT, TERRAIN_LENGTH,
            TERRAIN_WIDTH, WATER_HEIGHT, TERRAIN_LENGTH,
            TERRAIN_WIDTH, WATER_HEIGHT, -TERRAIN_LENGTH,
            -TERRAIN_WIDTH, -1, -TERRAIN_LENGTH,
            -TERRAIN_WIDTH, WATER_HEIGHT, -TERRAIN_LENGTH,
            TERRAIN_WIDTH, WATER_HEIGHT, -TERRAIN_LENGTH,
            TERRAIN_WIDTH, -1, -TERRAIN_LENGTH,
            -TERRAIN_WIDTH, -1, TERRAIN_LENGTH,
            -TERRAIN_WIDTH, WATER_HEIGHT, TERRAIN_LENGTH,
            TERRAIN_WIDTH, WATER_HEIGHT, TERRAIN_LENGTH,
            TERRAIN_WIDTH, -1, TERRAIN_LENGTH};

    GLfloat color[] = {0, 0, 1, 0.5};
    //attempt to rotate cube
    // glRotatef(alpha, 0, 1, 0);

    /* We have a color array and a vertex array */
    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, vertices);

    glColor4fv(color);

    /* Send data : 24 vertices */
    glDrawArrays(GL_QUADS, 0, 24);

    /* Cleanup states */
    glDisableClientState(GL_VERTEX_ARRAY);
}

void drawCube()
{
    GLfloat vertices[] =
        {
            -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1,
            1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1,
            -1, -1, -1, -1, -1, 1, 1, -1, 1, 1, -1, -1,
            -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
            -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
            -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1};

    GLfloat colors[] =
        {
            0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0,
            1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0,
            0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0,
            0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0,
            0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,
            0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1};

    //attempt to rotate cube
    // glRotatef(alpha, 0, 1, 0);

    /* We have a color array and a vertex array */
    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_COLOR_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, vertices);
    glColorPointer(3, GL_FLOAT, 0, colors);

    /* Send data : 24 vertices */
    glDrawArrays(GL_QUADS, 0, 24);

    /* Cleanup states */
    glDisableClientState(GL_COLOR_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);
}

static void render(void)
{
    glClearColor(255, 253, 208, 100);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glMatrixMode(GL_PROJECTION_MATRIX);
    glLoadIdentity();
    gluPerspective(60, (double)SCREEN_WIDTH / (double)SCREEN_HEIGHT, 0.1, 100);

    glMatrixMode(GL_MODELVIEW_MATRIX);
    // glTranslatef(0, 0, -5);
    // glTranslatef(0, 0, CURRENT_Z_DEPTH);
    glTranslatef(0, up, CURRENT_Z_DEPTH);
    glRotatef(alpha, 0, 1, 0);
    // glRotatef(10, 1, 0, 0);

    // drawCube();
    drawTerrain();
    drawWater();

    glutSwapBuffers();
}

static void onSpecialKey(int key, int x, int y)
{
    if (key == GLUT_KEY_UP)
    {
        up -= 0.05;
    }
    if (key == GLUT_KEY_DOWN)
    {
        up += 0.05;
    }
    if (key == GLUT_KEY_LEFT)
    {
        alpha -= 0.5;
    }
    if (key == GLUT_KEY_RIGHT)
    {
        alpha += 0.5;
    }
}

static void onKey(unsigned char key, int x, int y)
{
    static GLfloat zoomSpeed;
    static GLfloat zoomDistance;

    zoomDistance = 5;
    zoomSpeed = 0.5;

    switch (key)
    {
    case 'w':
        // if (CURRENT_Z_DEPTH < 2* zoomDistance)
        CURRENT_Z_DEPTH += zoomSpeed;
        break;
    case 's':
        // if (CURRENT_Z_DEPTH > zoomDistance)
        CURRENT_Z_DEPTH -= zoomSpeed;
        break;
    case 'z':
        if (WATER_HEIGHT < 1.0)
            WATER_HEIGHT += 0.01;
        break;
    case 'x':
        if (WATER_HEIGHT > -1.0)
            WATER_HEIGHT -= 0.01;
        break;
    case 'r':
        system("../generation/terrain-generation.py 400 400 2 > data.json");
        buildHeightMap("data.json");
        break;
    case 'l':
        buildHeightMap("data.json");
        break;
    }
    glutPostRedisplay();
}

static void onMouse(int button, int state, int x, int y)
{
}

void onMouseMovement(int x, int y)
{
}

static void idle(void)
{
    glutPostRedisplay();
}

void glutSetup(int *argc, char **argv)
{
    glutInit(argc, argv);
    glutInitWindowSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    glutInitWindowPosition(100, 100);
    glutInitDisplayMode(GLUT_RGBA | GLUT_DOUBLE | GLUT_DEPTH);

    glutCreateWindow("Terrain Visualisation");

    glutReshapeFunc(onWindowResize);
    glutDisplayFunc(render);
    glutKeyboardFunc(onKey);
    glutSpecialFunc(onSpecialKey);
    glutMouseFunc(onMouse);
    glutPassiveMotionFunc(onMouseMovement); // mouse movement no buttons
    glutIdleFunc(idle);

    glEnable(GL_DEPTH_TEST); // Depth Testing
    glDepthFunc(GL_LEQUAL);
    glDisable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    glutMainLoop();
}



int main(int argc, char **argv)
{
    buildHeightMap("data.json");
    glutSetup(&argc, argv);

    return EXIT_SUCCESS;
}
