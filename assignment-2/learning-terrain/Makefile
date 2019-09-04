all:
	tsc ./ts/*.ts --outDir ./js/ && browserify ./js/*.js -o game.js

clean:
	rm -rf ./js/*