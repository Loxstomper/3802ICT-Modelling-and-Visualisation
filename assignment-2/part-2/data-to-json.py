#! /bin/python3

import json
import csv

data = {
    "length": 0,
    "dates": [],
    "15-24": [],
    "25-34": [],
    "35-44": [],
    "45-54": [],
    "55+": []
}

with open ("./data/filtered.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')

    length = 0

    for row in csv_reader:
        # header
        if row[0] == "Month":
            continue

        data["dates"].append(row[0])
        data["15-24"].append(row[1])
        data["25-34"].append(row[2])
        data["35-44"].append(row[3])
        data["45-54"].append(row[4])
        data["55+"].append(row[5])
        length += 1

    data["length"] = length

print(json.dumps(data, indent=4))