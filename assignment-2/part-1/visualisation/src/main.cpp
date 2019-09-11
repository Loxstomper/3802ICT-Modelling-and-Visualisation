#include <iostream>
#include <fstream>
#include "headers/json.hpp"

using Json = nlohmann::json;

Json fileToJson(std::string* filename) {
    std::ifstream infile(*filename);

    Json j;
    infile >> j;

    return j;
}

int main(int argc, char** argv)
{
    if (argc < 2) {
        std::cerr << "Provide a filename" << std::endl;
        exit(1);
    }

    std::string filename = argv[1];

    Json config = fileToJson(&filename);

    std::cout << config << std::endl;

    exit(0);
}