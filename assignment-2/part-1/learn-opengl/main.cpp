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

#define SCREEN_HEIGHT_DEFAULT 800
#define SCREEN_WIDTH_DEFAULT 800
#define WIREFRAME false
#define FOV 60
#define ASPECT_RATIO SCREEN_WIDTH / SCREEN_HEIGHT
#define NEAR_CLIPPING_PLANE 0.1
#define FAR_CLIPPING_PLANE 50000.0

GLfloat WATER_HEIGHT = -0.9;

GLfloat TERRAIN_WIDTH = 1.0;
GLfloat TERRAIN_LENGTH = 1.0;

GLfloat SCREEN_WIDTH = SCREEN_WIDTH_DEFAULT;
GLfloat SCREEN_HEIGHT = SCREEN_HEIGHT_DEFAULT;
GLfloat HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2.0;
GLfloat HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2.0;

GLfloat CURRENT_Z_DEPTH = -5;

GLfloat alpha = 0;

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

/* GLUT callback Handlers */
static void onWindowResize(int width, int height)
{
    SCREEN_HEIGHT = height;
    SCREEN_WIDTH = width;

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

void drawWater()
{
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

    GLfloat colors[] =
        {
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
            0, 0, 1, 0.5,
        };

    //attempt to rotate cube
    glRotatef(alpha, 0, 1, 0);

    /* We have a color array and a vertex array */
    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_COLOR_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, vertices);
    glColorPointer(4, GL_FLOAT, 0, colors);

    /* Send data : 24 vertices */
    glDrawArrays(GL_QUADS, 0, 24);

    /* Cleanup states */
    glDisableClientState(GL_COLOR_ARRAY);
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
    glRotatef(alpha, 0, 1, 0);

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
    glTranslatef(0, -1, CURRENT_Z_DEPTH);

    drawCube();
    drawWater();
    alpha ++;

    glutSwapBuffers();

    return;

    glPushMatrix();
    // glTranslatef(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT, -500);

    // glLoadIdentity();

    // GLfloat vertices[] = {
    //     -0.5f, -0.5f, 0.0f,
    //     0.5f, -0.5f, 0.0f,
    //     0.0f,  0.5f, 0.0f
    // };

    GLfloat vertices[] = {
        -0.5f, -0.5f, 0.0f,
        -0.5f, 0.5f, 0.0f,
        // 0.5f, 0.5f, 0.0f,
        0.0f, 0.5f, 0.0f};

    GLfloat colours[] = {
        1.0, 0, 0, 1.0,
        0, 1.0, 0, 1.0,
        0, 0, 1.0, 1.0,
        1.0, 1.0, 0, 1.0};

    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_COLOR_ARRAY);

    // glVertexPointer(3, GL_FLOAT, 0, vertices);
    // glVertexPointer(4, GL_FLOAT, 0, vertices);
    glColorPointer(4, GL_FLOAT, 0, colours);

    // glDrawArrays(GL_TRIANGLES, 0, 3);
    // glDrawArrays(GL_QUADS, 0, 3);

    // GLfloat vertices2[] = {-0.5, -0.5, 0, // bottom left corner
    //                   -0.5,  0.5, 0, // top left corner
    //                    0.5,  0.5, 0, // top right corner
    //                    0.5, -0.5, 0}; // bottom right corner

    // GLfloat vertices2[] = {-0.5, -0.5, 0, // bottom left corner
    //                   -0.5,  0.5, 0, // top left corner
    //                    0.5,  0.5, 0, // top right corner
    //                    0.5, -0.5, 0}; // bottom right corner
    GLfloat vertices2[] = {0, 0, 0,     // bottom left corner
                           0, 100, 0,   // top left corner
                           100, 100, 0, // top right corner
                           100, -0, 0}; // bottom right corner

    GLubyte indices[] = {0, 1, 2,  // first triangle (bottom left - top left - top right)
                         0, 2, 3}; // second triangle (bottom left - top right - bottom right)

    glVertexPointer(3, GL_FLOAT, 0, vertices2);
    glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_BYTE, indices);

    glEnableClientState(GL_COLOR_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);

    glutSwapBuffers();
}

static void onSpecialKey(int key, int x, int y)
{
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

    glEnable(GL_DEPTH_TEST); // Depth Testing
    glDepthFunc(GL_LEQUAL);
    glDisable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    glutMainLoop();
}

int main(int argc, char **argv)
{
    glutSetup(&argc, argv);

    return EXIT_SUCCESS;
}
