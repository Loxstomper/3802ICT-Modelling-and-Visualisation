#include <iostream>
#include <iomanip>
#include <fstream>
#include "headers/json.hpp"

#include <GL/glut.h>

#define SCREEN_HEIGHT 480
#define SCREEN_WIDTH 640
#define WIREFRAME false

GLfloat HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;
GLfloat HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
GLfloat WATER_HEIGHT = 100;
GLfloat WATER_WIDTH = 1000;
GLfloat WATER_DEPTH = 1000;

GLfloat ROTATION_X = 0.78;
GLfloat ROTATION_Y = 0;

using Json = nlohmann::json;

Json fileToJson(std::string* filename) {
    std::ifstream infile(*filename);

    Json j;
    infile >> j;

    return j;
}

void createHeightMap(Json* config, float** heightMap) {
    int height = (*config)["height"].get<int>();
    int width = (*config)["width"].get<int>();

    std::cout << width << " " << height << std::endl;

    // alloc space
    heightMap = new float*[height];
    for (int i = 0; i < height; i ++) {
        heightMap[i] = new float[width];
    }

    // copy the values in

    for (int y = 0; y < height; y ++) {
        std::vector<float> test = (*config)["heightMap"][y].get<std::vector<float>>();

        // for (auto i = test.begin(); i != test.end(); ++i)
        //     std::cout << *i << " ";

        // std::cout << std::endl;

        for (int x = 0; x < width; x ++) {
            heightMap[y][x] = test[x];
            // std::cout << heightMap[y][x] << std::endl;
        }
    }
}

void printHeightMap(int width, int height, float** heightMap) {
    for (int y = 0; y < height; y ++) {
        for (int x = 0; x < width; x ++) {
            std::cout << heightMap[y][x] << " ";
        }

        std::cout << "\n";
    }

    std::cout << std::endl;
}

void DrawCube( GLfloat centerPosX, GLfloat centerPosY, GLfloat centerPosZ, GLfloat edgeLength )
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

    glEnableClientState( GL_VERTEX_ARRAY );
    glVertexPointer( 3, GL_FLOAT, 0, vertices );

    glDrawArrays( GL_QUADS, 0, 24 );
    
    glDisableClientState( GL_VERTEX_ARRAY );
}

void drawWater() {

    GLfloat colours[] = {
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        0, 0, 255,
        // 0, 0, 255,
        // 0, 0, 255,
        // 0, 0, 255,
        // 0, 0, 255,
    };

    GLfloat vertices[] = {
        // top
        -WATER_WIDTH, WATER_HEIGHT, -WATER_DEPTH,
        -WATER_WIDTH, WATER_HEIGHT, WATER_DEPTH,
        WATER_WIDTH, WATER_HEIGHT, WATER_DEPTH,
        WATER_WIDTH, WATER_HEIGHT, -WATER_DEPTH

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

    glEnableClientState( GL_VERTEX_ARRAY );
    glEnableClientState(GL_COLOR_ARRAY);

    glVertexPointer( 3, GL_FLOAT, 0, vertices );
    glColorPointer(3, GL_FLOAT, 0, colours);

    glDrawArrays( GL_QUADS, 0,  8);
    
    glDisableClientState(GL_COLOR_ARRAY);
    glDisableClientState( GL_VERTEX_ARRAY );

}

void drawTerrain()
{
    drawWater();

    GLfloat vertices[] = {
        250, 250, -500,
        300, 250, -500,
        300, 250, -500,
        100, 250, -500
    };

    if (WIREFRAME) 
        glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    else
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, vertices);

    glDrawArrays( GL_TRIANGLE_STRIP, 0,  4);
    
    glDisableClientState( GL_VERTEX_ARRAY );
}

/* GLUT callback Handlers */
static void onWindowResize(int width, int height)
{
    glViewport( 0.0f, 0.0f, SCREEN_WIDTH, SCREEN_HEIGHT ); // specifies the part of the window to which OpenGL will draw (in pixels), convert from normalised to pixels
    glMatrixMode( GL_PROJECTION ); // projection matrix defines the properties of the camera that views the objects in the world coordinate frame. Here you typically set the zoom factor, aspect ratio and the near and far clipping planes
    glLoadIdentity( ); // replace the current matrix with the identity matrix and starts us a fresh because matrix transforms such as glOrpho and glRotate cumulate, basically puts us at (0, 0, 0)
    glOrtho( 0, SCREEN_WIDTH, 0, SCREEN_HEIGHT, 0, 1000); // essentially set coordinate system
    glMatrixMode( GL_MODELVIEW ); // (default matrix mode) modelview matrix defines how your objects are transformed (meaning translation, rotation and scaling) in your world
    glLoadIdentity( ); // same as above comment
}

static void render(void)
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity(); // replace the current matrix with the identity matrix and starts us a fresh because matrix transforms such as glOrpho and glRotate cumulate, basically puts us at (0, 0, 0)


    float vertices[] =
    {
        300, 300, 0.0, // top right corner
        0, 300, 0.0, // top left corner
        0, 0, 0.0, // bottom left corner
        300, 0, 0.0 // bottom right corner
    };

    // Render OpenGL here

    glPushMatrix();
    glTranslatef(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT, -500);
    glRotatef(ROTATION_X, 1, 0, 0);
    glRotatef(ROTATION_Y, 0, 1, 0);
    glTranslatef(-HALF_SCREEN_WIDTH, -HALF_SCREEN_HEIGHT, 500);

    DrawCube(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT, -500, 200);
    drawTerrain();


    glPopMatrix();
    
    glutSwapBuffers();
}


static void onKey(unsigned char key, int x, int y)
{
    const GLfloat rotationSpeed = 10;

    std::cout << "X: " << ROTATION_X << " " << "Y: " << ROTATION_Y << std::endl;

    switch (key)
    {
        case 'w':
            ROTATION_X -= rotationSpeed;
            break;
        case 's':
            ROTATION_X += rotationSpeed;
            break;
        case 'a':
            ROTATION_Y -= rotationSpeed;
            break;
        case 'd':
            ROTATION_Y += rotationSpeed;
            break;
        case 'z':
            WATER_HEIGHT += 10;
            break;
        case 'x':
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

static void idle(void)
{
    glutPostRedisplay();
}


int main(int argc, char** argv)
{
    // if (argc < 2) {
    //     std::cerr << "Provide a filename" << std::endl;
    //     exit(1);
    // }

    // std::string filename = argv[1];
    std::string filename = "data.json";

    Json config = fileToJson(&filename);

    std::cout << "Input" << std::endl;
    std::cout << std::setw(4) << config << std::endl;

    float** heightMap;

    createHeightMap(&config, heightMap);
    // std::cout << heightMap[0][0] << std::endl;
    // printHeightMap(4, 4, heightMap);
    // float a = heightMap[0][0];
    // a += 5;

    

    glutInit(&argc, argv);
    glutInitWindowSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    glutInitWindowPosition(100,100);
    // glutInitDisplayMode(GLUT_RGBA | GLUT_DOUBLE | GLUT_DEPTH);
    glutInitDisplayMode(GLUT_RGB | GLUT_DOUBLE | GLUT_DEPTH);

    glutCreateWindow("Terrain");

    glutReshapeFunc(onWindowResize);
    glutDisplayFunc(render);
    glutKeyboardFunc(onKey);
    glutMouseFunc(onMouse);
    glutIdleFunc(idle);

    // glClearColor(0,0,0,0);

    glutMainLoop();

    return EXIT_SUCCESS;

    exit(0);
}