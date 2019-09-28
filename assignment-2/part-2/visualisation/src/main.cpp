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
bool alphaLock = false;

typedef struct data Data;
struct data
{
    int length;
    int numberSeries;
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

// void drawString(char *string, float x, float y, float z)
void drawString(std::string string, float x, float y, float z, float xRot, float yRot, float zRot)
{
    const char *cstring = string.c_str();
    const char *c;

    glPushMatrix();

    glColor4f(0, 0, 0, 1);

    glTranslatef(x, y, z);
    // glRotatef(90, 0, 1, 0);
    // glRotatef(270, 0, 1, 0);
    glRotatef(xRot, 1, 0, 0);
    glRotatef(yRot, 0, 1, 0);
    glRotatef(zRot, 0, 0, 1);

    glScalef(0.001, 0.001, 0.001);

    // glScale()
    for (c = cstring; *c != '\0'; c++)
    {
        glutStrokeCharacter(GLUT_STROKE_ROMAN, *c);
    }

    glPopMatrix();

    // alpha ++;
}

void drawStrokeText(char *string, int x, int y, int z)
{
    char *c;
    glPushMatrix();
    glTranslatef(x, y + 8, z);
    glScalef(0.09f, -0.08f, z);

    //   for (c=string; *c != '\0'; c++)
    //   {
    //       std::cout << c << std::endl;
    // 		glutStrokeCharacter(GLUT_STROKE_ROMAN , *c);
    //   }
    for (int i = 0; string[i] != '\0'; i++)
    {
        std::cout << string[i] << std::endl;
        glutStrokeCharacter(GLUT_STROKE_ROMAN, *c);
    }

    glPopMatrix();
}

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
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1, -GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, -GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, -GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, -GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, -GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, -GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, -GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_LENGTH - GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            -GRAPH_WIDTH - GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1 - GRAPH_WALL_THICKNESS, GRAPH_LENGTH + GRAPH_WALL_THICKNESS,
            GRAPH_WIDTH + GRAPH_WALL_THICKNESS, -1, GRAPH_LENGTH + GRAPH_WALL_THICKNESS};

    GLfloat black[] = {0, 0, 0, 1};

    /* We have a color array and a vertex array */
    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, floor);

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

void drawSeries(double *series, GLfloat z, GLfloat height, GLfloat colour[])
{

    // number of vertices
    // front/back, sides, top
    int numberVerticies = graphData.length * 4 * 2 * 4 + 8;

    GLfloat xStep = graphData.length / (GRAPH_LENGTH * 2);
    // GLfloat seriesThickness = graphData.length / (GRAPH_WIDTH * 2);
    GLfloat seriesThickness = (GRAPH_WIDTH * 2) / graphData.length;
    GLfloat curX = -1;
    int vi = 0;

    height *= 2;

    GLfloat low = -1.0;

    // this will be the series value
    // GLfloat height = 1.0;

    GLfloat myVertices[] = {

        // front facing
        -1,
        low,
        z,
        1,
        low,
        z,
        1,
        low + height,
        z,
        -1,
        low + height,
        z,

        // rear side [not really required]
        -1,
        low,
        z + seriesThickness,
        1,
        low,
        z + seriesThickness,
        1,
        low + height,
        z + seriesThickness,
        -1,
        low + height,
        z + seriesThickness,

        // top side
        -1,
        low + height,
        z,
        1,
        low + height,
        z,
        1,
        low + height,
        z + seriesThickness,
        -1,
        low + height,
        z + seriesThickness,

        // left side
        -1,
        low,
        z,
        -1,
        low,
        z + seriesThickness,
        -1,
        low + height,
        z + seriesThickness,
        -1,
        low + height,
        z,

        // right side
        1,
        low,
        z,
        1,
        low,
        z + seriesThickness,
        1,
        low + height,
        z + seriesThickness,
        1,
        low + height,
        z};

    for (int i = 0; i < graphData.length; i++)
    {

        curX += xStep;
        vi += 3;
    }

    //attempt to rotate cube
    // glRotatef(alpha, 0, 1, 0);

    /* We have a color array and a vertex array */
    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, myVertices);

    glColor4fv(colour);

    /* Send data : 24 vertices */
    glDrawArrays(GL_QUADS, 0, 20);

    /* Cleanup states */
    glDisableClientState(GL_VERTEX_ARRAY);
}

void drawSeriesLabels()
{
    GLfloat x = -1.4;
    // GLfloat y = -1 - GRAPH_WALL_THICKNESS;
    GLfloat y = -1 - (GRAPH_WALL_THICKNESS / 2);
    GLfloat z = -0.8;

    GLfloat zStep = 0.4;

    for (int i = 0; i < graphData.numberSeries; i++)
    {
        drawString(graphData.seriesNames[i], x, y, z, 0, 180, 0);

        // z += (graphData.length / GRAPH_WIDTH);
        z += zStep;
    }
}

void drawDateLabels()
{

    GLfloat x = 1;
    GLfloat y = -1 - (GRAPH_WALL_THICKNESS / 2);
    GLfloat z = -1.7;

    GLfloat xStep = -0.4;

    for (int i = 0; i < graphData.length; i++)
    {
        drawString(graphData.dates[i], x, y, z, 0, 270, 0);

        // z += (graphData.length / GRAPH_WIDTH);
        x += xStep;
    }
}

static void render(void)
{
    GLfloat black[] = {0, 0, 0, 1};

    GLfloat yellow[] = {1, 1, 0, 1};
    GLfloat purple[] = {0.5, 0, 0.5, 1};
    GLfloat orange[] = {1, 0.5, 0, 1};
    GLfloat green[] = {0, 0, 1, 1};
    GLfloat red[] = {1, 0, 0, 1};
    GLfloat blue[] = {0, 1, 0, 1};

    std::cout << "GET NEW DATA and average per year" << std::endl;

    if (alphaLock)
    {
        alpha = 135;
        // alpha = 0;
    }

    glClearColor(255, 253, 208, 100);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glMatrixMode(GL_PROJECTION_MATRIX);
    glLoadIdentity();
    gluPerspective(60, (double)SCREEN_WIDTH / (double)SCREEN_HEIGHT, 0.1, 100);

    glMatrixMode(GL_MODELVIEW_MATRIX);

    // glTranslatef(0, 0, -5);
    // glTranslatef(0, 0, CURRENT_Z_DEPTH);
    // glTranslatef(0, 0, CURRENT_Z_DEPTH);
    glTranslatef(0, -0.5, CURRENT_Z_DEPTH);
    glRotatef(alpha, 0, 1, 0);
    // glRotatef(10, 0, 0, 1);

    // wireframe mode
    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    glColor4f(0, 0, 0, 1);
    // drawString("THIS IS SOME TEXT", 0, 0, 1);
    // drawStrokeText("THIS IS SOME TEXT", 0, 0, 1);
    // drawString("THIS IS SOME TEXT", 0, 0, 1);
    // drawStrokeText("THIS IS SOME TEXT", 0, 0, 1);

    drawGraphAxes();
    drawSeriesLabels();
    drawDateLabels();

    // normal mode
    glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

    drawSeries(graphData.series0, -1, 0.5, yellow);
    drawSeries(graphData.series0, -0.6, 1.0, purple);
    drawSeries(graphData.series0, -0.2, 0.5, orange);
    drawSeries(graphData.series0, 0.2, 1.0, green);
    drawSeries(graphData.series0, 0.6, 0.5, red);

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
    case ' ':
        alphaLock = !alphaLock;
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

    glutCreateWindow("Graph");

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

    std::cout << json << std::endl;

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

void readDataTemp()
{
    graphData.length = 5;
    graphData.numberSeries = 5;
    graphData.series0 = new double[5];

    graphData.seriesNames = new std::string[5];

    graphData.seriesNames[0] = "data0";
    graphData.seriesNames[1] = "data1";
    graphData.seriesNames[2] = "data2";
    graphData.seriesNames[3] = "data3";
    graphData.seriesNames[4] = "data4";

    graphData.dates = new std::string[5];
    graphData.dates[0] = "1901";
    graphData.dates[1] = "1902";
    graphData.dates[2] = "1903";
    graphData.dates[3] = "1904";
    graphData.dates[4] = "1905";

    // [0.1, 0.2, 0.3, 0.4, 0.5]
    for (int i = 1; i < graphData.length + 1; i++)
    {
        graphData.series0[i - 1] = i * 0.1;
        std::cout << graphData.series0[i - 1] << std::endl;
    }
}

int main(int argc, char **argv)
{
    // readData("./data/data.json");
    readDataTemp();
    glutSetup(&argc, argv);

    return EXIT_SUCCESS;
}
