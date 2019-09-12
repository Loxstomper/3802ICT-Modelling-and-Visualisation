#include <iostream>
#include <iomanip>
#include <fstream>
#include "headers/json.hpp"

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
    float a = heightMap[0][0];
    a += 5;

    exit(0);
}