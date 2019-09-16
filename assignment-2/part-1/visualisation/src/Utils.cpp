#include "headers/Utils.hpp"

Json Utils::jsonFromFile(std::string filepath)
{
    std::ifstream file(filepath);

    Json json;

    file >> json;

    return json;
}