import os
import sys
from datetime import datetime
from argparse import ArgumentParser
import json
import requests

DEFAULT_OUT_DIR = "data"

# private lease overname
SEARCHES = {
    "lease": "https://www.marktplaats.nl/lrp/api/search?attributesById[]=11756&l1CategoryId=91&limit=100&offset=0&postcode=1421LJ&query=private%20lease&searchInTitleAndDescription=true&viewOptions=list-view",
    "zoe": "https://www.marktplaats.nl/lrp/api/search?attributeRanges[]=PriceCents%3A600000%3A1300000&attributeRanges[]=constructionYear%3A2017%3Anull&attributesById[]=10882&attributesById[]=10793&l1CategoryId=91&l2CategoryId=146&limit=100&offset=0&postcode=1012AB&searchInTitleAndDescription=true&viewOptions=list-view",
}

HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,nl;q=0.8,ru;q=0.7,de;q=0.6",
    "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "Referer": "https://www.marktplaats.nl/l/auto-s",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}


def main():
    parser = ArgumentParser()
    parser.add_argument("search_id")
    parser.add_argument("--out-dir", default=DEFAULT_OUT_DIR)
    args = parser.parse_args()
    print(args)

    ds = datetime.now().strftime("%Y%m%d")
    snapshot_dir = os.path.join(
        args.out_dir, ds)
    os.makedirs(snapshot_dir, exist_ok=True)
    print(f"Using output directory: {snapshot_dir}")

    with requests.Session() as session:
        session.headers = HEADERS
        fetch_one(snapshot_dir, session, args.search_id)


def fetch_one(snapshot_dir, session: requests.Session, search_id, params={}):
    if search_id not in SEARCHES:
        print(
            f"Unknown Search Id {search_id}, known ids: {', '.join([k for k in SEARCHES.keys()])}")
        sys.exit(1)
    url = SEARCHES[search_id]
    res = session.get(url, params=params)
    # res.raise_for_status()
    if res.ok:

        data = res.json()
        with open(os.path.join(snapshot_dir, f"marktplaats_search_{search_id}.json"), "w+") as f:
            f.write(json.dumps(data))
    else:
        print(res.status_code, res.text)


if __name__ == "__main__":
    main()
