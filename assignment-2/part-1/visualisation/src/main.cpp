#include <iostream>
#include <iomanip>
#include <fstream>
#include <vector>

#include <GL/glut.h>
#include <GL/gl.h>

#include <GL/gl.h>
#include <GL/glu.h>
#include <GL/glx.h>
#include <GL/glext.h>

#include "headers/Terrain.hpp"

#define SCREEN_HEIGHT_DEFAULT 800
#define SCREEN_WIDTH_DEFAULT 800
#define FOV 60
#define ASPECT_RATIO SCREEN_WIDTH / SCREEN_HEIGHT
#define NEAR_CLIPPING_PLANE 0.1
#define FAR_CLIPPING_PLANE 50000.0

#define DEFAULT_DATA_FILE "data.json"

GLfloat SCREEN_WIDTH = SCREEN_WIDTH_DEFAULT;
GLfloat SCREEN_HEIGHT = SCREEN_HEIGHT_DEFAULT;

struct Camera
{
    // position
    GLfloat x = 0;
    GLfloat y = 0;
    GLfloat z = -5;
    GLfloat yMovementSpeed = 0.05;
    GLfloat zMovementSpeed = 0.5;

    // rotation
    GLfloat rotation = 0;
    GLfloat zRotationSpeed = 1.0;

    // camera settings
    GLdouble nearClippingPlane = NEAR_CLIPPING_PLANE;
    GLdouble farClippingPlane = FAR_CLIPPING_PLANE;
    GLdouble fov = FOV;
    bool wireframe = false;
};

Terrain terrain;
Camera camera;

/* GLUT callback Handlers */
static void onWindowResize(int width, int height)
{
    SCREEN_HEIGHT = height;
    SCREEN_WIDTH = width;

    glMatrixMode(GL_PROJECTION_MATRIX);
    glLoadIdentity();

    gluPerspective(camera.fov, (double)SCREEN_WIDTH / (double)SCREEN_HEIGHT, camera.nearClippingPlane, camera.farClippingPlane);

    glMatrixMode(GL_MODELVIEW_MATRIX);

    glTranslatef(0, 0, camera.z);
}

static void render(void)
{
    glClearColor(1, 0.99, 81, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glMatrixMode(GL_PROJECTION_MATRIX);
    glLoadIdentity();
    gluPerspective(60, (double)SCREEN_WIDTH / (double)SCREEN_HEIGHT, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

    glMatrixMode(GL_MODELVIEW_MATRIX);

    glTranslatef(0, camera.y, camera.z);
    glRotatef(camera.rotation, 0, 1, 0);

    terrain.draw(camera.wireframe);

    glutSwapBuffers();
}

static void onSpecialKey(int key, int x, int y)
{
    if (key == GLUT_KEY_UP)
    {
        camera.y -= 0.05;
    }
    if (key == GLUT_KEY_DOWN)
    {
        camera.y += 0.05;
    }
    if (key == GLUT_KEY_LEFT)
    {
        camera.rotation -= 0.5;
    }
    if (key == GLUT_KEY_RIGHT)
    {
        camera.rotation += 0.5;
    }
}

static void onKey(unsigned char key, int x, int y)
{
    static GLfloat zoomSpeed;
    static GLfloat zoomDistance;

    zoomSpeed = 0.5;

    switch (key)
    {
    case 'w':
        camera.z += zoomSpeed;
        break;
    case 's':
        camera.z -= zoomSpeed;
        break;
    case 'z':
        if (terrain.getWaterHeight() < 1.0)
            terrain.setWaterHeight(terrain.getWaterHeight() + 0.01);
        break;
    case 'x':
        if (terrain.getWaterHeight() > -1.0)
            terrain.setWaterHeight(terrain.getWaterHeight() - 0.01);
        break;
    case 'r':
        std::cout << "Generating terrain..." << std::endl;

        terrain.generate(400, 400, 10, 3);

        std::cout << "done!\n"
                  << std::endl;
        break;
    case 'l':
        std::cout << DEFAULT_DATA_FILE << " loading..." << std::endl;

        terrain.load(DEFAULT_DATA_FILE);

        std::cout << "done!\n"
                  << std::endl;
        break;
    case ' ':
        camera.wireframe = !camera.wireframe;
        break;
    }
    glutPostRedisplay();
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
    glutIdleFunc(idle);

    glEnable(GL_DEPTH_TEST); // Depth Testing
    glDepthFunc(GL_LEQUAL);
    glDisable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    // transparency
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    glutMainLoop();
}

int main(int argc, char **argv)
{
    // check if DEFAULT_DATA_FILE exists
    std::ifstream f(DEFAULT_DATA_FILE);
    if (f.good())
    {
        std::cout << "Found " << DEFAULT_DATA_FILE << "\n"
                  << std::endl;
        // load the file
        terrain = Terrain(DEFAULT_DATA_FILE);
    }
    else
    {
        // generate the terrain
        terrain = Terrain();
    }

    // setup glut
    glutSetup(&argc, argv);

    return EXIT_SUCCESS;
}
