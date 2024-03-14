import os
import sys
from datetime import datetime
from argparse import ArgumentParser
import json
import pandas as pd

DEFAULT_OUT_DIR = "data"


def parse_response(file_path):

    listings = []
    with open(file_path, encoding="utf-8") as f:
        data = json.load(f)

        if data and "listings" in data:
            for it in data["listings"]:
                listings.append(it)
    df = pd.json_normalize(listings)

    df.insert(loc=0, column="link",
              value="https://www.marktplaats.nl/q/" + df["itemId"])
    return df


def main():
    parser = ArgumentParser()
    parser.add_argument("file_path")
    parser.add_argument("--out-dir", default=DEFAULT_OUT_DIR)
    args = parser.parse_args()
    print(args)
    df = parse_response(args.file_path)
    path, filename = os.path.split(args.file_path)
    date_dir_ = path.split("/")[-1]
    filename, _ = os.path.splitext(filename)
    df.to_csv(os.path.join(args.out_dir,
              f"{filename}_{date_dir_}.csv"), index=False)


if __name__ == "__main__":
    main()
