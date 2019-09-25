FLAGS=-g -lglut -lGL -lGLU

run: visualisation
	./visualisation

build: visualisation

visualisation: build/main.o build/Terrain.o
	g++ $(FLAGS) -o visualisation build/main.o build/Terrain.o

build/main.o:  src/main.cpp
	mkdir -p build
	g++ $(FLAGS) -c -o build/main.o src/main.cpp

build/Terrain.o: src/Terrain.cpp
	mkdir -p build
	g++ $(FLAGS) -c -o build/Terrain.o src/Terrain.cpp

clean:
	rm visualisation
	rm -rf ./build/*
