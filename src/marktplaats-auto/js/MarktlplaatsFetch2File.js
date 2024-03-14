// npm install node-fetch
// npm install @google-cloud/storage
// node scripts/fetch2File.js


const fs = require("fs");

url = "https://www.marktplaats.nl/lrp/api/search?attributeRanges[]=constructionYear%3A2019%3Anull&attributesById[]=10882&attributesById[]=13838&attributesById[]=11756&l1CategoryId=91&limit=30&offset=0&postcode=1421LJ&query=private%20lease%20overname&searchInTitleAndDescription=true&viewOptions=list-view"

date_str = (new Date()).toISOString().substring(0, 10)
const filePath = `data/marktplaats_auto_response_${date_str}.txt`

async function main() {
    try {
        fs.mkdirSync("data");
    } catch (e) {
        console.error(e.message)
    }

    const fetchModule = await import("node-fetch")
    fetch = fetchModule.default || fetchModule;

    try {
        const response = await fetch(url, {
            "headers": {
              "accept": "*/*",
              "accept-language": "en-US,en;q=0.9,nl;q=0.8,ru;q=0.7,de;q=0.6",
              "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "Referer": "https://www.marktplaats.nl/l/auto-s",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });

        if (!response.ok) {
            throw new Error(`HTTP error. Staus ${response.status}`);
        }

        const data = await response.text();
        fs.writeFileSync(filePath, data, "utf-8");
        console.log("Data written to file", filePath);

    } catch (error) {
        console.error("Error:", error.message)
    };
}

main()
    .then(() => console.log("Done."));