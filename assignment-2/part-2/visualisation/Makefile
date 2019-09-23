
FLAGS=-g -lglut -lGL -lGLU

graph: ./build/main.o
	g++ $(FLAGS) -o graph ./build/main.o

./build/main.o:  ./src/main.cpp
	g++ $(FLAGS) -c -o ./build/main.o ./src/main.cpp