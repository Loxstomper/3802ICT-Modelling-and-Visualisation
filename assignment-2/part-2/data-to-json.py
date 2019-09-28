#! /bin/python3

import json
import csv

data = {
    "length": 0,
    "Years": [],
    "15-64": [],
    "15-24": [],
    "15-19": [],
    "25-34": [],
    "35-44": [],
    "45-54": [],
    "55 and over": []
}

with open ("./data/years.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')

    length = 0

    for row in csv_reader:
        # header
        if row[0] == "Year":
            continue

        data["Years"].append(row[0])
        data["15-64"].append(row[1])
        data["15-24"].append(row[2])
        data["15-19"].append(row[3])
        data["25-34"].append(row[4])
        data["35-44"].append(row[5])
        data["45-54"].append(row[6])
        data["55 and over"].append(row[7])
        length += 1

    data["length"] = length

print(json.dumps(data, indent=4))