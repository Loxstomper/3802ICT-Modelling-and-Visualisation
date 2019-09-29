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
#define GRAPH_TICK_LENGTH 0.1

GLfloat SCREEN_WIDTH = SCREEN_WIDTH_DEFAULT;
GLfloat SCREEN_HEIGHT = SCREEN_HEIGHT_DEFAULT;
GLfloat HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2.0;
GLfloat HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2.0;

GLfloat CURRENT_Z_DEPTH = -5;

GLfloat alpha = 0;
bool alphaLock = false;

// what to scale the values by [-1, 1]
GLfloat largestValue = -1;
GLfloat smallestValue = 999;

typedef struct data Data;
struct data
{
    int length;
    int numberSeries;
    // std::string *dates;
    std::string *dates;
    std::string *seriesNames;
    GLfloat *series0;
    GLfloat *series1;
    GLfloat *series2;
    GLfloat *series3;
    GLfloat *series4;
    GLfloat *series5;
    GLfloat *series6;
};

Data graphData;

GLfloat scale(GLfloat value, GLfloat min, GLfloat max)
{
    // scales between 0 and 1, multiply by 2 and subtract 1
    // scales between -1 and 1
    return (2 * ((value - min) / (max - min))) - 1;
}

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

    int numberDecimals = 0;
    bool inDecimal = false;

    // glScale()
    for (c = cstring; *c != '\0'; c++)
    {
        if (*c == '.')
        {
            inDecimal = true;
        }

        if (inDecimal && *c == '0')
        {
            numberDecimals++;
        }

        glutStrokeCharacter(GLUT_STROKE_ROMAN, *c);

        if (numberDecimals)
        {
            break;
        }
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

void drawSeriesBad(GLfloat *series, GLfloat z, GLfloat seriesThickness, GLfloat colour[])
{
    GLfloat xStep = (2 * GRAPH_LENGTH) / graphData.length;
    // GLfloat seriesThickness = graphData.length / (GRAPH_WIDTH * 2);
    // GLfloat seriesThickness = (GRAPH_WIDTH * 2) / graphData.numberSeries;
    GLfloat curX = -1;
    int vi = 0;

    GLfloat low = -1.0;

    // GLfloat padding = 0.1;

    GLfloat black[] = {0, 0, 0, 0.5};

    // set colour
    glColor4fv(colour);

    // front and back
    glColor4fv(colour);
    glBegin(GL_QUADS);
    for (int i = 0; i < graphData.length - 1; i++)
    {
        glVertex3f(curX, low, z);
        glVertex3f(curX, scale(series[i], smallestValue, largestValue), z);
        glVertex3f(curX + xStep, scale(series[i + 1], smallestValue, largestValue), z);
        glVertex3f(curX + xStep, low, z);

        glVertex3f(curX, low, z + seriesThickness);
        glVertex3f(curX, scale(series[i], smallestValue, largestValue), z + seriesThickness);
        glVertex3f(curX + xStep, scale(series[i + 1], smallestValue, largestValue), z + seriesThickness);
        glVertex3f(curX + xStep, low, z + seriesThickness);
        curX += xStep;
    }
    glEnd();

    // side 1
    glBegin(GL_QUADS);
    glVertex3f(curX, low, z);
    glVertex3f(curX, low, z + seriesThickness);
    glVertex3f(curX, scale(series[graphData.length - 1], smallestValue, largestValue), z + seriesThickness);
    glVertex3f(curX, scale(series[graphData.length - 1], smallestValue, largestValue), z);
    glEnd();

    // side 2
    curX = -1;
    glBegin(GL_QUADS);
    glVertex3f(-1, low, z);
    glVertex3f(-1, low, z + seriesThickness);
    glVertex3f(-1, scale(series[0], smallestValue, largestValue), z + seriesThickness);
    glVertex3f(-1, scale(series[0], smallestValue, largestValue), z);
    glEnd();

    // tops
    curX = -1;
    glBegin(GL_QUADS);
    for (int i = 0; i < graphData.length - 1; i++)
    {
        glVertex3f(curX, scale(series[i], smallestValue, largestValue), z);
        glVertex3f(curX, scale(series[i], smallestValue, largestValue), z + seriesThickness);

        curX += xStep;

        glVertex3f(curX, scale(series[i + 1], smallestValue, largestValue), z);
        glVertex3f(curX, scale(series[i + 1], smallestValue, largestValue), z + seriesThickness);
    }

    glEnd();

    // drawing outline - had issues with wireframe
    glColor3fv(black);
    curX = -1;
    glBegin(GL_LINE_LOOP);
    glVertex3f(curX, low, z);
    for (int i = 0; i < graphData.length; i++)
    {
        glVertex3f(curX, scale(series[i], smallestValue, largestValue), z);
        curX += xStep;
    }
    glVertex3f(curX - xStep, low, z);
    curX = -1;
    glEnd();

    glColor3fv(black);
    curX = -1;
    glBegin(GL_LINE_LOOP);
    glVertex3f(curX, low, z + seriesThickness);
    for (int i = 0; i < graphData.length; i++)
    {
        glVertex3f(curX, scale(series[i], smallestValue, largestValue), z + seriesThickness);
        curX += xStep;
    }
    glVertex3f(curX - xStep, low, z + seriesThickness);
    curX = -1;
    glEnd();

    glBegin(GL_LINES);
    glVertex3f(curX, low, z);
    glVertex3f(curX, low, z + seriesThickness);

    curX = -1;

    glVertex3f(curX, low, z);
    glVertex3f(curX, low, z + seriesThickness);

    glEnd();

    glBegin(GL_LINES);

    curX = -1;

    for (int i = 0; i < graphData.length; i++)
    {
        glVertex3f(curX, scale(series[i], smallestValue, largestValue), z);
        glVertex3f(curX, scale(series[i], smallestValue, largestValue), z + seriesThickness);
        curX += xStep;
    }

    glEnd();
}

void drawSeriesLabels()
{
    GLfloat x = 1.4;
    GLfloat y = -1 - (GRAPH_WALL_THICKNESS / 5);
    GLfloat z = -1;

    GLfloat zStep = (1.8 / graphData.numberSeries);

    for (int i = 0; i < graphData.numberSeries; i++)
    {
        drawString(graphData.seriesNames[i], x, y, z, 0, 0, 0);

        z += zStep;
    }
}

void drawDateLabels()
{

    // GLfloat x = 1;
    GLfloat x = -0.8;
    // GLfloat x = -1.8;
    // GLfloat x = -1.8;
    GLfloat y = -1 - (GRAPH_WALL_THICKNESS / 4);
    GLfloat z = 1.7;

    int labelIncrement = 5;

    // GLfloat xStep = -0.4;
    // GLfloat xStep = -(1.75 / (graphData.length / labelIncrement));
    GLfloat xStep = (1.75 / (graphData.length / labelIncrement));

    for (int i = 2; i < graphData.length; i += labelIncrement)
    // for (int i = graphData.length - 3; i > 2; i -= labelIncrement)
    {
        drawString(graphData.dates[i], x, y, z, 0, 90, 0);

        // z += (graphData.length / GRAPH_WIDTH);
        x += xStep;
    }
}

void drawYLabels()
{
    // 0 to 30 increment of 5
    GLfloat x = 1;
    GLfloat y = -1.05;
    GLfloat z = -1.7;

    GLfloat yStep = 0.3325;

    int labelIncrement = 5;

    for (int i = 0; i <= 30; i += 5)
    {
        // drawString(std::to_string(i), x, y, z, 0, 270, 0);
        // drawString(std::to_string((GLfloat)i), x, y, z, 0, 90, 0);
        drawString(std::to_string((GLfloat)i), 1 + GRAPH_WALL_THICKNESS + 0.15, y, -1 - GRAPH_WALL_THICKNESS, 0, 0, 0);

        // drawString(std::to_string(i), -1, y, 1, 0, 180, 0);
        drawString(std::to_string((GLfloat)i), -1 - GRAPH_WALL_THICKNESS, y, 1 + GRAPH_WALL_THICKNESS + 0.4, 0, 90, 0);

        y += yStep;
    }
}

void drawTitles()
{
    drawString("Underemployment Ratio (proportion of employed persons)", -2, 2, 0, 0, 45, 0);
    // drawString("Age bracket", 2, -1, 0.6, 15, 70, 0);
    drawString("Age bracket", 2, -1, 0.4, 0, 80, 0);
    drawString("Year", 0, -1, 2, 0, 0, 0);
    drawString("Ratio %", -1 - GRAPH_WALL_THICKNESS, -0.4, 1 + GRAPH_WALL_THICKNESS + 0.6, 0, 90, 90);
}

void drawFloor()
{
    GLfloat curX = -1 - GRAPH_WALL_THICKNESS;
    GLfloat curY = -1;
    GLfloat curZ = -1 - GRAPH_WALL_THICKNESS;

    glColor4f(1, 1, 1, 1);

    glBegin(GL_QUADS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(1 + GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(1 + GRAPH_WALL_THICKNESS, -1, 1 + GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, 1 + GRAPH_WALL_THICKNESS);
    glEnd();

    glColor4f(0, 0, 0, 1);
    glBegin(GL_LINE_LOOP);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(1 + GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(1 + GRAPH_WALL_THICKNESS, -1, 1 + GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, 1 + GRAPH_WALL_THICKNESS);
    glEnd();

    glBegin(GL_LINES);

    curX = -0.8;
    GLfloat xStep = 1 / (8 / 2.0);

    // for (int i = 0; i < (int)(2 / (30 / yStep)); i++)
    for (int i = 0; i < 7; i++)
    {
        glVertex3f(curX, -1, 1 + GRAPH_WALL_THICKNESS);
        glVertex3f(curX, -1, 1 + GRAPH_WALL_THICKNESS + GRAPH_TICK_LENGTH);

        curX += xStep;
    }

    glEnd();
}

void drawWalls()
{
    GLfloat curX = -1 - GRAPH_WALL_THICKNESS;
    GLfloat curY = -1;
    GLfloat curZ = -1 - GRAPH_WALL_THICKNESS;

    // GLfloat yStep = (30 / 6) / 2;
    GLfloat yStep = 2 / 6.0;

    glColor4f(1, 1, 1, 1);

    glBegin(GL_QUADS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(1 + GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(1 + GRAPH_WALL_THICKNESS, 1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, 1, -1 - GRAPH_WALL_THICKNESS);

    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, 1 + GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, 1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, 1, 1 + GRAPH_WALL_THICKNESS);

    glEnd();

    glColor4f(0, 0, 0, 1);
    glBegin(GL_LINE_LOOP);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(1 + GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(1 + GRAPH_WALL_THICKNESS, 1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, 1, -1 - GRAPH_WALL_THICKNESS);
    glEnd();

    glBegin(GL_LINE_LOOP);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, 1 + GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, -1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, 1, -1 - GRAPH_WALL_THICKNESS);
    glVertex3f(-1 - GRAPH_WALL_THICKNESS, 1, 1 + GRAPH_WALL_THICKNESS);
    glEnd();

    glBegin(GL_LINES);

    // for (int i = 0; i < (int)(2 / (30 / yStep)); i++)
    for (int i = 0; i < 7; i++)
    {
        glVertex3f(-1 - GRAPH_WALL_THICKNESS, curY, -1 - GRAPH_WALL_THICKNESS);
        glVertex3f(-1 - GRAPH_WALL_THICKNESS, curY, 1 + GRAPH_WALL_THICKNESS + GRAPH_TICK_LENGTH);

        glVertex3f(-1 - GRAPH_WALL_THICKNESS, curY, -1 - GRAPH_WALL_THICKNESS);
        glVertex3f(1 + GRAPH_WALL_THICKNESS + GRAPH_TICK_LENGTH, curY, -1 - GRAPH_WALL_THICKNESS);
        curY += yStep;
    }

    glEnd();
}

static void render(void)
{
    GLfloat black[] = {0, 0, 0, 1};

    GLfloat yellow[] = {1, 1, 0, 1};
    GLfloat orange[] = {1, 0.5, 0, 1};
    GLfloat green[] = {0, 1, 0, 1};
    GLfloat red[] = {1, 0, 0, 1};
    GLfloat blue[] = {0, 0, 1, 1};

    if (alphaLock)
    {
        // alpha = 135;
        alpha = 325;
        // alpha = 0;
    }

    glClearColor(0.66, 0.66, 0.66, 1);
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
    // glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    glColor4f(0, 0, 0, 1);
    // drawString("THIS IS SOME TEXT", 0, 0, 1);
    // drawStrokeText("THIS IS SOME TEXT", 0, 0, 1);
    // drawString("THIS IS SOME TEXT", 0, 0, 1);
    // drawStrokeText("THIS IS SOME TEXT", 0, 0, 1);

    // drawGraphAxes();
    drawSeriesLabels();
    drawDateLabels();
    drawYLabels();
    drawTitles();
    drawWalls();
    drawFloor();

    // normal mode
    glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

    GLfloat z = -1;
    GLfloat zStep = (2 / GLfloat(graphData.numberSeries));

    // drawSeriesBad(graphData.series6, z, blue);
    // z += zStep;
    // drawSeriesBad(graphData.series5, z, red);
    // z += zStep;
    // drawSeriesBad(graphData.series4, z, yellow);
    // z += zStep;
    // drawSeriesBad(graphData.series3, z, green);
    // z += zStep;
    // drawSeriesBad(graphData.series2, z, yellow);
    // z += zStep;
    // drawSeriesBad(graphData.series1, z, blue);
    // z += zStep;
    // drawSeriesBad(graphData.series0, z, red);

    GLfloat padding = 0.1;
    GLfloat seriesThickness = ((GRAPH_WIDTH * 2) / graphData.numberSeries) - padding;

    drawSeriesBad(graphData.series0, z, seriesThickness, red);
    z += zStep;
    drawSeriesBad(graphData.series1, z, seriesThickness, blue);
    z += zStep;
    drawSeriesBad(graphData.series2, z, seriesThickness, yellow);
    z += zStep;
    drawSeriesBad(graphData.series3, z, seriesThickness, green);
    z += zStep;
    drawSeriesBad(graphData.series4, z, seriesThickness, orange);
    z += zStep;
    drawSeriesBad(graphData.series5, z, seriesThickness, red);
    z += zStep;
    drawSeriesBad(graphData.series6, z, seriesThickness, blue);

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

    // transparency
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    glutMainLoop();
}

void fillSeriesData(std::vector<GLfloat> input, GLfloat *out)
{
    for (int i = 0; i < input.size(); i++)
    {
        if (input[i] > largestValue)
            largestValue = input[i];

        if (input[i] < smallestValue)
            smallestValue = input[i];

        out[i] = input[i];
    }
}
void readData(std::string filename)
{
    std::ifstream file(filename);

    Json json;

    file >> json;

    // get data length
    graphData.length = json["length"].get<int>();

    // dynamically allocate
    graphData.dates = new std::string[graphData.length];
    graphData.numberSeries = 7;
    graphData.seriesNames = new std::string[graphData.numberSeries];

    // get the dates
    std::vector<std::string> temp = json["Years"].get<std::vector<std::string>>();

    for (int i = 0; i < temp.size(); i++)
    {
        graphData.dates[i] = temp[i];
    }

    graphData.seriesNames[0] = "15-64";
    graphData.seriesNames[1] = "15-24";
    graphData.seriesNames[2] = "15-19";
    graphData.seriesNames[3] = "25-34";
    graphData.seriesNames[4] = "35-44";
    graphData.seriesNames[5] = "45-54";
    graphData.seriesNames[6] = "55 and over";

    graphData.series0 = new GLfloat[graphData.length];
    graphData.series1 = new GLfloat[graphData.length];
    graphData.series2 = new GLfloat[graphData.length];
    graphData.series3 = new GLfloat[graphData.length];
    graphData.series4 = new GLfloat[graphData.length];
    graphData.series5 = new GLfloat[graphData.length];
    graphData.series6 = new GLfloat[graphData.length];

    // read the data
    fillSeriesData(json["15-64"].get<std::vector<GLfloat>>(), graphData.series0);
    fillSeriesData(json["15-24"].get<std::vector<GLfloat>>(), graphData.series1);
    fillSeriesData(json["15-19"].get<std::vector<GLfloat>>(), graphData.series2);
    fillSeriesData(json["25-34"].get<std::vector<GLfloat>>(), graphData.series3);
    fillSeriesData(json["35-44"].get<std::vector<GLfloat>>(), graphData.series4);
    fillSeriesData(json["45-54"].get<std::vector<GLfloat>>(), graphData.series5);
    fillSeriesData(json["55 and over"].get<std::vector<GLfloat>>(), graphData.series6);
}

int main(int argc, char **argv)
{
    readData("data.json");
    // readDataTemp();
    glutSetup(&argc, argv);

    return EXIT_SUCCESS;
}
