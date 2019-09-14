FLAGS=-g -lglut -lGL -lGLU

all: main.o
	g++ $(FLAGS) -o visualisation ./build/main.o

main.o: 
	g++ $(FLAGS) -c -o ./build/main.o ./src/main.cpp
