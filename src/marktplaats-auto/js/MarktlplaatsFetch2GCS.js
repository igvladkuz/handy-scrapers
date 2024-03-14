// npm install node-fetch
// npm install @google-cloud/storage
// node scripts/fetch2File.js


const fs = require("fs");
const {Storage} = require('@google-cloud/storage');

const uploadToBucket = false

const filePath = "data/response.txt"
const bucketName = 'gcs_bucket_name'
const destFileName = 'destination/file_name'

async function uploadToGcs(filePath){
    const storage = new Storage();
    const options = {
        destination: destFileName,
        // preconditionOpts: {ifGenerationMatch: 0},
      };
    await storage.bucket(bucketName).upload(filePath, options);
    console.log(`${filePath} uploaded to ${bucketName} ${destFileName}`);
}

async function main() {
    try {
        fs.mkdirSync("data");
    } catch (e) {
        console.error(e.message)
    }

    const fetchModule = await import("node-fetch")
    fetch = fetchModule.default || fetchModule;

    try {
        const response = await fetch("https://www.marktplaats.nl/lrp/api/search?attributeRanges[]=constructionYear%3A2019%3Anull&attributesById[]=10882&attributesById[]=13838&attributesById[]=11756&l1CategoryId=91&limit=30&offset=0&postcode=1421LJ&query=private%20lease%20overname&searchInTitleAndDescription=true&viewOptions=list-view", {
            "headers": {
              "accept": "*/*",
              "accept-language": "en-US,en;q=0.9,nl;q=0.8,ru;q=0.7,de;q=0.6",
              "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "Referer": "https://www.marktplaats.nl/l/auto-s/f/elektrisch/11756/",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
          });

        if (!response.ok) {
            throw new Error(`HTTP error. Staus ${response.status}`);
        }

        const data = await response.text()
        fs.writeFileSync(filePath, data, "utf-8");
        console.log("Data written to file", filePath)

        if (uploadToBucket) {
            await uploadToGcs(filePath);
        }

    } catch (error) {
        console.error("Error:", error.message)
    };
}

main()
    .then(() => console.log("Done."));