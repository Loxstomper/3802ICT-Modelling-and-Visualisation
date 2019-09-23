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

#include "./headers/json.hpp"

using Json = nlohmann::json;

#define SCREEN_HEIGHT_DEFAULT 800
#define SCREEN_WIDTH_DEFAULT 800
#define WIREFRAME true
#define FOV 60
#define ASPECT_RATIO SCREEN_WIDTH / SCREEN_HEIGHT
#define NEAR_CLIPPING_PLANE 0.1
#define FAR_CLIPPING_PLANE 50000.0

#define GRAPH_WIDTH 1.0
#define GRAPH_LENGTH 1.0
#define GRAPH_HEIGHT 1.0
#define GRAPH_WALL_THICKNESS 0.25

GLfloat SCREEN_WIDTH = SCREEN_WIDTH_DEFAULT;
GLfloat SCREEN_HEIGHT = SCREEN_HEIGHT_DEFAULT;
GLfloat HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2.0;
GLfloat HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2.0;

GLfloat CURRENT_Z_DEPTH = -5;

GLfloat alpha = 0;

typedef struct data Data;
struct data
{
    int length;
    // std::string *dates;
    std::string *dates;
    std::string *seriesNames;
    double *series0;
    double *series1;
    double *series2;
    double *series3;
    double *series4;
};

Data graphData;

/* GLUT callback Handlers */
static void onWindowResize(int width, int height)
{
    SCREEN_HEIGHT = height;
    SCREEN_WIDTH = width;

    glMatrixMode(GL_PROJECTION_MATRIX);
    glLoadIdentity();
    gluPerspective(60, (double)SCREEN_WIDTH / (double)SCREEN_HEIGHT, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

    glMatrixMode(GL_MODELVIEW_MATRIX);
    glTranslatef(0, 0, CURRENT_Z_DEPTH);
}

/**
 * Draws bottom and walls
 * 
 * 
 */
void drawGraphAxes()
{
    // only update if change
    GLfloat floor[] =
        {
            -GRAPH_WIDTH, -1, -GRAPH_LENGTH,
            -GRAPH_WIDTH, -1, GRAPH_LENGTH,
            -GRAPH_WIDTH, GRAPH_WALL_THICKNESS, GRAPH_LENGTH,
            -GRAPH_WIDTH, GRAPH_WALL_THICKNESS, -GRAPH_LENGTH,
            GRAPH_WIDTH, -1, -GRAPH_LENGTH,
            GRAPH_WIDTH, -1, GRAPH_LENGTH,
            GRAPH_WIDTH, GRAPH_WALL_THICKNESS, GRAPH_LENGTH,
            GRAPH_WIDTH, GRAPH_WALL_THICKNESS, -GRAPH_LENGTH,
            -GRAPH_WIDTH, -1, -GRAPH_LENGTH,
            -GRAPH_WIDTH, -1, GRAPH_LENGTH,
            GRAPH_WIDTH, -1, GRAPH_LENGTH,
            GRAPH_WIDTH, -1, -GRAPH_LENGTH,
            -GRAPH_WIDTH, GRAPH_WALL_THICKNESS, -GRAPH_LENGTH,
            -GRAPH_WIDTH, GRAPH_WALL_THICKNESS, GRAPH_LENGTH,
            GRAPH_WIDTH, GRAPH_WALL_THICKNESS, GRAPH_LENGTH,
            GRAPH_WIDTH, GRAPH_WALL_THICKNESS, -GRAPH_LENGTH,
            -GRAPH_WIDTH, -1, -GRAPH_LENGTH,
            -GRAPH_WIDTH, GRAPH_WALL_THICKNESS, -GRAPH_LENGTH,
            GRAPH_WIDTH, GRAPH_WALL_THICKNESS, -GRAPH_LENGTH,
            GRAPH_WIDTH, -1, -GRAPH_LENGTH,
            -GRAPH_WIDTH, -1, GRAPH_LENGTH,
            -GRAPH_WIDTH, GRAPH_WALL_THICKNESS, GRAPH_LENGTH,
            GRAPH_WIDTH, GRAPH_WALL_THICKNESS, GRAPH_LENGTH,
            GRAPH_WIDTH, -1, GRAPH_LENGTH};

    GLfloat floorColours[] =
        {
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
            0,
            0,
            1,
            0.5,
        };

    //attempt to rotate cube
    // glRotatef(alpha, 0, 1, 0);

    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    /* We have a color array and a vertex array */
    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_COLOR_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, floor);
    glColorPointer(4, GL_FLOAT, 0, floorColours);

    /* Send data : 24 vertices */
    glDrawArrays(GL_QUADS, 0, 24);

    /* Cleanup states */
    glDisableClientState(GL_COLOR_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);

    // back to normal
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
    glTranslatef(0, 0, CURRENT_Z_DEPTH);
    glRotatef(alpha, 0, 1, 0);
    // glRotatef(10, 1, 0, 0);

    // wireframe mode
    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    drawGraphAxes();

    // normal mode
    glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

    alpha++;

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

    glutMainLoop();
}

void fillSeriesData(std::vector<double> input, double *out)
{
    for (int i = 0; i < input.size(); i++)
    {
        out[i] = input[i];
    }
}

void readData(std::string filename)
{
    std::ifstream file(filename);

    Json json;

    file >> json;

    // get data length
    graphData.length = json["length"].get<GLfloat>();

    // dynamically allocate
    graphData.dates = new std::string[graphData.length];
    graphData.seriesNames = new std::string[5];
    graphData.series0 = new double[graphData.length];
    graphData.series1 = new double[graphData.length];
    graphData.series2 = new double[graphData.length];
    graphData.series3 = new double[graphData.length];
    graphData.series4 = new double[graphData.length];

    // read the data
    std::vector<double> temp;

    // std::vector<double> x = json["15-24"].get<std::vector<double>>;
    fillSeriesData(json["15-24"].get<std::vector<double>>(), graphData.series0);
}

int main(int argc, char **argv)
{
    readData("./data/data.json");
    glutSetup(&argc, argv);

    return EXIT_SUCCESS;
}
