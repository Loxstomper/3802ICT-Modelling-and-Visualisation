#pragma once

#include <fstream>
#include "json.hpp"

using Json = nlohmann::json;

class Utils
{
private:
public:
    static Json jsonFromFile(std::string filepath);
};