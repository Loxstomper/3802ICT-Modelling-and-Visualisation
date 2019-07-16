#include <GL/glut.h>
#include <stdlib.h>

/* GLUT callback Handlers */
static void resize(int width, int height)
{
    const float ar = (float) width / (float) height;

    glViewport(0, 0, width, height);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glFrustum(-ar, ar, -1.0, 1.0, 2.0, 100.0);

    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity() ;
}

static void setPixel(int x, int y, float r, float g, float b) 
{
    glClear(GL_COLOR_BUFFER_BIT);

    // glBegin(GL_POINTS);
    //     glColor3f(r, g, b);
    //     glVertex2i(x, y);
    // glEnd();

    // glutSwapBuffers();


    // glMatrixMode( GL_PROJECTION );
    // glLoadIdentity();
    // gluOrtho2D( 0.0, 500.0, 500.0,0.0 );

    // glBegin(GL_POINTS);
    //     glPointSize(8);
    //     glColor3f(1,1,1);
    //     glVertex2i(100,100);
    // glEnd();
}

static void display(void)
{
//     glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

//     glBegin(GL_QUADS);
//         glColor3d(1,0,0);
//         glVertex3f(-2,-1,-10);
//         glColor3d(0,1,0);
//         glVertex3f(1,-1,-10);
//         glColor3d(0,0,1);
//         glVertex3f(1,1,-10);
//         glColor3d(1,1,1);
//         glVertex3f(-2,1,-10);
//     glEnd();
//     glutSwapBuffers();

    glClear(GL_COLOR_BUFFER_BIT);

    glBegin(GL_POINTS);
        glColor3d(1,1,1);
        glVertex2i(-2,-1);
    glEnd();

    glFlush();

    // setPixel(1, 1, 1, 1, 1);
}



static void key(unsigned char key, int x, int y)
{
    switch (key)
    {
        case 27 :
        case 'q':
            exit(0);
            break;
    }
    glutPostRedisplay();
}

static void idle(void)
{
    glutPostRedisplay();
}


int main(int argc, char** argv)
{
    glutInit(&argc, argv);
    glutInitWindowSize(640,480);
    glutInitWindowPosition(10,10);
    glutInitDisplayMode(GLUT_RGB | GLUT_DOUBLE | GLUT_DEPTH);

    glutCreateWindow("GLUT quadPoly");

    glutReshapeFunc(resize);
    glutDisplayFunc(display);
    glutKeyboardFunc(key);
    glutIdleFunc(idle);

    glClearColor(0,0,0,0);

    glutMainLoop();

    return EXIT_SUCCESS;
}