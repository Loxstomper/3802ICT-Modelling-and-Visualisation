#include <iostream>
#include <iomanip>
#include <fstream>
#include <vector>

#include <GL/glut.h>

#include "headers/Terrain.hpp"
#include "headers/Utils.hpp"
#include "headers/json.hpp"

#define SCREEN_HEIGHT 800
#define SCREEN_WIDTH 800
#define WIREFRAME false
#define FOV 60
#define ASPECT_RATIO SCREEN_WIDTH / SCREEN_HEIGHT
#define NEAR_CLIPPING_PLANE 1
#define FAR_CLIPPING_PLANE 50000

GLfloat TERRAIN_WIDTH = 400; // used to scale
GLfloat TERRAIN_HEIGHT = 0;  // height = TERRAIN_HEIGHT + heightMap[x][y]
GLfloat TERRAIN_DEPTH = 400; // used to scale

GLfloat HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;
GLfloat HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
GLfloat WATER_HEIGHT = 100;
GLfloat WATER_WIDTH = 1000;
GLfloat WATER_DEPTH = 1000;

GLfloat ROTATION_X = 0.78;
GLfloat ROTATION_Y = 0;

GLfloat CAMERA_X = 0;
GLfloat CAMERA_Y = 0;
GLfloat CAMERA_Z = 0;

int MOUSE_X = HALF_SCREEN_WIDTH;
int MOUSE_Y = HALF_SCREEN_HEIGHT;

int heightMapWidth;
int heightMapHeight;

Terrain *terrain;

using Json = nlohmann::json;

void DrawCube(GLfloat centerPosX, GLfloat centerPosY, GLfloat centerPosZ, GLfloat edgeLength)
{
    GLfloat halfSideLength = edgeLength * 0.5f;

    GLfloat vertices[] =
        {
            // front face
            centerPosX - halfSideLength, centerPosY + halfSideLength, centerPosZ + halfSideLength, // top left
            centerPosX + halfSideLength, centerPosY + halfSideLength, centerPosZ + halfSideLength, // top right
            centerPosX + halfSideLength, centerPosY - halfSideLength, centerPosZ + halfSideLength, // bottom right
            centerPosX - halfSideLength, centerPosY - halfSideLength, centerPosZ + halfSideLength, // bottom left

            // back face
            centerPosX - halfSideLength, centerPosY + halfSideLength, centerPosZ - halfSideLength, // top left
            centerPosX + halfSideLength, centerPosY + halfSideLength, centerPosZ - halfSideLength, // top right
            centerPosX + halfSideLength, centerPosY - halfSideLength, centerPosZ - halfSideLength, // bottom right
            centerPosX - halfSideLength, centerPosY - halfSideLength, centerPosZ - halfSideLength, // bottom left

            // left face
            centerPosX - halfSideLength, centerPosY + halfSideLength, centerPosZ + halfSideLength, // top left
            centerPosX - halfSideLength, centerPosY + halfSideLength, centerPosZ - halfSideLength, // top right
            centerPosX - halfSideLength, centerPosY - halfSideLength, centerPosZ - halfSideLength, // bottom right
            centerPosX - halfSideLength, centerPosY - halfSideLength, centerPosZ + halfSideLength, // bottom left

            // right face
            centerPosX + halfSideLength, centerPosY + halfSideLength, centerPosZ + halfSideLength, // top left
            centerPosX + halfSideLength, centerPosY + halfSideLength, centerPosZ - halfSideLength, // top right
            centerPosX + halfSideLength, centerPosY - halfSideLength, centerPosZ - halfSideLength, // bottom right
            centerPosX + halfSideLength, centerPosY - halfSideLength, centerPosZ + halfSideLength, // bottom left

            // top face
            centerPosX - halfSideLength, centerPosY + halfSideLength, centerPosZ + halfSideLength, // top left
            centerPosX - halfSideLength, centerPosY + halfSideLength, centerPosZ - halfSideLength, // top right
            centerPosX + halfSideLength, centerPosY + halfSideLength, centerPosZ - halfSideLength, // bottom right
            centerPosX + halfSideLength, centerPosY + halfSideLength, centerPosZ + halfSideLength, // bottom left

            // top face
            centerPosX - halfSideLength, centerPosY - halfSideLength, centerPosZ + halfSideLength, // top left
            centerPosX - halfSideLength, centerPosY - halfSideLength, centerPosZ - halfSideLength, // top right
            centerPosX + halfSideLength, centerPosY - halfSideLength, centerPosZ - halfSideLength, // bottom right
            centerPosX + halfSideLength, centerPosY - halfSideLength, centerPosZ + halfSideLength  // bottom left
        };

    if (WIREFRAME)
        glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    else
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, vertices);

    glDrawArrays(GL_QUADS, 0, 24);

    glDisableClientState(GL_VERTEX_ARRAY);
}

void drawWater()
{

    GLfloat colours[] = {
        0, 0, 255, 0.5,
        0, 0, 255, 0.5,
        0, 0, 255, 0.5,
        0, 0, 255, 0.5,
        // 0, 0, 255,
        // 0, 0, 255,
        // 0, 0, 255,
        // 0, 0, 255,
    };

    GLfloat vertices[] = {
        // top
        -WATER_WIDTH, WATER_HEIGHT, -WATER_DEPTH,
        WATER_WIDTH, WATER_HEIGHT, -WATER_DEPTH,
        WATER_WIDTH, WATER_HEIGHT, WATER_DEPTH,
        -WATER_WIDTH, WATER_HEIGHT, WATER_DEPTH

        // front
        // -WATER_WIDTH, WATER_HEIGHT, -WATER_DEPTH,
        // WATER_WIDTH, WATER_HEIGHT, -WATER_DEPTH,
        // WATER_WIDTH, 0, -WATER_DEPTH,
        // -WATER_WIDTH, 0, -WATER_DEPTH

        // left

        // right
    };

    if (WIREFRAME)
        glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    else
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

    glEnableClientState(GL_VERTEX_ARRAY);
    // glEnableClientState(GL_COLOR_ARRAY);

    // glVertexPointer(3, GL_FLOAT, 0, vertices);
    // glColorPointer(3, GL_FLOAT, 0, colours);

    glColor4f(0, 0, 1, 1);

    glDrawArrays(GL_QUADS, 0, 1);

    // glDisableClientState(GL_COLOR_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);
}

/* GLUT callback Handlers */
static void onWindowResize(int width, int height)
{
    glViewport(0.0f, 0.0f, SCREEN_WIDTH, SCREEN_HEIGHT); // specifies the part of the window to which OpenGL will draw (in pixels), convert from normalised to pixels
    glMatrixMode(GL_PROJECTION);                         // projection matrix defines the properties of the camera that views the objects in the world coordinate frame. Here you typically set the zoom factor, aspect ratio and the near and far clipping planes
    glLoadIdentity();                                    // replace the current matrix with the identity matrix and starts us a fresh because matrix transforms such as glOrpho and glRotate cumulate, basically puts us at (0, 0, 0)
    // gluPerspective(FOV, 1, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE); // perspective
    glOrtho(0, SCREEN_WIDTH, 0, SCREEN_HEIGHT, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE); // ortho
    glMatrixMode(GL_MODELVIEW);                                                          // (default matrix mode) modelview matrix defines how your objects are transformed (meaning translation, rotation and scaling) in your world
    glLoadIdentity();                                                                    // same as above comment
}

static void render(void)
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity(); // replace the current matrix with the identity matrix and starts us a fresh because matrix transforms such as glOrpho and glRotate cumulate, basically puts us at (0, 0, 0)

    float vertices[] =
        {
            300, 300, 0.0, // top right corner
            0, 300, 0.0,   // top left corner
            0, 0, 0.0,     // bottom left corner
            300, 0, 0.0    // bottom right corner
        };

    // Render OpenGL here

    glPushMatrix();
    glTranslatef(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT, -500);
    glRotatef(ROTATION_X, 1, 0, 0);
    glRotatef(ROTATION_Y, 0, 1, 0);
    glTranslatef(-HALF_SCREEN_WIDTH, -HALF_SCREEN_HEIGHT, 500);

    glColor4f(1, 0, 0, 1);
    DrawCube(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT, -500, 200);
    glColor4f(0, 1, 0, 1);
    DrawCube(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT, -100, 100);
    // drawTerrain();

    terrain->draw();

    glPopMatrix();

    glutSwapBuffers();
}

static void onSpecialKey(int key, int x, int y)
{
    const GLfloat rotationSpeed = 10;

    switch (key)
    {
    case GLUT_KEY_UP:
        ROTATION_X -= rotationSpeed;
        break;
    case GLUT_KEY_DOWN:
        ROTATION_X += rotationSpeed;
        break;
    case GLUT_KEY_LEFT:
        ROTATION_Y -= rotationSpeed;
        break;
    case GLUT_KEY_RIGHT:
        ROTATION_Y += rotationSpeed;
        break;
    }
}

static void onKey(unsigned char key, int x, int y)
{

    std::cout << "X: " << ROTATION_X << " "
              << "Y: " << ROTATION_Y << " "
              << "Water Height: " << WATER_HEIGHT
              << std::endl;

    const GLfloat movementSpeed = 10;

    switch (key)
    {
    case 'w':
        CAMERA_Z -= movementSpeed;
        break;
    case 's':
        CAMERA_Z += movementSpeed;
        break;
    case 'a':
        CAMERA_X -= movementSpeed;
        break;
    case 'd':
        CAMERA_X += movementSpeed;
        break;
    case 'z':
        CAMERA_Y += 10;
        break;
    case 'x':
        CAMERA_Y -= 10;
        break;
    case '[':
        WATER_HEIGHT += 10;
        break;
    case ']':
        WATER_HEIGHT -= 10;
        break;

    case 'q':
        exit(0);
        break;
    }
    glutPostRedisplay();
}

static void onMouse(int button, int state, int x, int y)
{
}

void onMouseMovement(int x, int y)
{
    int dx = x - MOUSE_X;
    int dy = y - MOUSE_Y;

    ROTATION_X += (dx / SCREEN_WIDTH) * 360.0;
    ROTATION_Y += (dy / SCREEN_HEIGHT) * 360.0;

    std::cout << dx << "\t" << dy << std::endl;

    MOUSE_X = x;
    MOUSE_Y = y;
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
    // glutInitDisplayMode(GLUT_RGBA | GLUT_DOUBLE | GLUT_DEPTH);
    glutInitDisplayMode(GLUT_RGBA | GLUT_DOUBLE | GLUT_DEPTH);

    glutCreateWindow("Terrain Visualisation");

    glutReshapeFunc(onWindowResize);
    glutDisplayFunc(render);
    glutKeyboardFunc(onKey);
    glutSpecialFunc(onSpecialKey);
    glutMouseFunc(onMouse);
    glutPassiveMotionFunc(onMouseMovement); // mouse movement no buttons
    glutIdleFunc(idle);

    glutMainLoop();
}

int main(int argc, char **argv)
{
    // if (argc < 2) {
    //     std::cerr << "Provide a filename" << std::endl;
    //     exit(1);
    // }

    // std::string filename = argv[1];
    std::string filepath = "data.json";

    Json config = Utils::jsonFromFile(filepath);

    std::cout << "Input" << std::endl;
    std::cout << std::setw(4) << config << std::endl;

    float **heightMap;

    terrain = new Terrain(&config, TERRAIN_WIDTH, TERRAIN_DEPTH);

    // printHeightMap(4, 4, heightMap);

    glutSetup(&argc, argv);

    return EXIT_SUCCESS;

    exit(0);
}