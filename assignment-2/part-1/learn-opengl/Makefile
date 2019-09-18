FLAGS=-g -lglut -lGL -lGLU

learning: main.o
	g++ $(FLAGS) -o learning main.o

main.o:  main.cpp
	g++ $(FLAGS) -c -o main.o main.cpp
