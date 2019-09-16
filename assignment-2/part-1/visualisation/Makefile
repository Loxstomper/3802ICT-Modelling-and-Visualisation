FLAGS=-g -lglut -lGL -lGLU

visualisation: ./build/main.o ./build/Utils.o ./build/Terrain.o
	g++ $(FLAGS) -o visualisation ./build/*.o

./build/Utils.o: ./src/Utils.cpp
	g++ $(FLAGS) -c -o ./build/Utils.o ./src/Utils.cpp

./build/Terrain.o: ./src/Terrain.cpp
	g++ $(FLAGS) -c -o ./build/Terrain.o ./src/Terrain.cpp

./build/main.o:  ./src/main.cpp
	g++ $(FLAGS) -c -o ./build/main.o ./src/main.cpp
