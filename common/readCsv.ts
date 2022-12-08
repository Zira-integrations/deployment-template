import csv from 'fast-csv';
const { Readable } = require('stream');



function readCsv(csvBuffer, rowProcessor = (row) => row) {
    return new Promise((resolve, reject) => {
        const stream = Readable.from(csvBuffer);

        const data = [];

        csv.parseStream(stream)
            .on("error", reject)
            .on("data", (row) => {
                const obj = rowProcessor(row);
                if (obj) data.push(obj);
            })
            .on("end", () => {
                resolve(data);
            });
    });
}

export default readCsv