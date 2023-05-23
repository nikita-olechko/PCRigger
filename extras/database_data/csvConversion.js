// These functions are used to convert the various CSV files acquired from Kaggle into JSON objects for use in MongoDB
// The desired CSV data should be pasted between the csvData back ticks ``, and the desired function should be uncommented
// To run the script, use the command: node csvConversion.js or use the VSCode extension Quokka.js to run the script line by line
// The output will be an array of JSON objects that can be pasted into studio 3T to be inserted into the desired collection

var csvData = ``
const data = []


// Convert GPU Benchmark Kaggle CSV data to JSON objects for insertion into MongoDB
// Data sourced from: https://www.kaggle.com/datasets/alanjo/gpu-benchmarks 

// /**
// @param {string} csvData - The CSV data to be processed.
// */
// const rows = csvData.split("\n"); // split the CSV data into an array of rows

// for (let i = 1; i < rows.length; i++) {
//     const values = rows[i].split(",");
//     const obj = {};
//     obj["gpuName"] = values[0];
//     obj["G3Dmark"] = parseInt(values[1]);
//     obj["G2Dmark"] = parseInt(values[2]);
//     obj["price"] = parseFloat(values[3]);
//     obj["gpuValue"] = parseFloat(values[4]);
//     obj["TDP"] = parseInt(values[5]);
//     obj["powerPerformance"] = parseFloat(values[6]);
//     obj["testDate"] = values[7];
//     obj["category"] = values[8];
//     data.push(obj);
// }


// Convert GPU Spec Kaggle CSV data to JSON objects for insertion into MongoDB
// Data sourced from: https://www.kaggle.com/datasets/alanjo/graphics-card-full-specs

// const rows = csvData.split("\n"); // split the CSV data into an array of rows
// const headers = rows[0].split(","); // get the headers from the first row

// /**
// @param {string} csvData - The CSV data to be processed.
// */
// for (let i = 1; i < rows.length; i++) {
//     const values = rows[i].split(",");
//     const obj = {
//         manufacturer: values[0],
//         productName: values[1],
//         releaseYear: parseInt(values[2]),
//         memSize: parseInt(values[3]),
//         memBusWidth: parseInt(values[4]),
//         gpuClock: parseInt(values[5]),
//         memClock: parseInt(values[6]),
//         unifiedShader: parseInt(values[7]),
//         tmu: parseInt(values[8]),
//         rop: parseInt(values[9]),
//         pixelShader: parseInt(values[10]),
//         vertexShader: parseInt(values[11]),
//         igp: parseInt(values[12]),
//         bus: values[13],
//         memType: values[14],
//         gpuChip: values[15],
//     };
//     data.push(obj);
// }


// generate documents from CPU dataset for insertion into MongoDB
// Data sourced from: https://www.kaggle.com/datasets/alanjo/cpu-benchmarks

// const rows = csvData.split("\n"); // split the CSV data into an array of rows
// const headers = rows[0].split(","); // get the headers from the first row

// /**
// @param {string} csvData - The CSV data to be processed.
// */
// for (let i = 1; i < rows.length; i++) {
//         const values = rows[i].split(",");
//         const obj = {
//         cpuName: values[0],
//         price: parseFloat(values[1]),
//         cpuMark: parseInt(values[2]),
//         cpuValue: parseFloat(values[3]),
//         threadMark: parseInt(values[4]),
//         threadValue: parseFloat(values[5]),
//         TDP: values[6],
//         powerPerf: parseInt(values[7]),
//         cores: parseInt(values[8]),
//         testDate: values[9],
//         socket: values[10],
//         category: values[11]
//     };
//     data.push(obj);
// }


// Convert memory data CSV to JSON objects for insertion into MongoDB
// Data sourced from: https://www.kaggle.com/datasets/alanjo/ddr2ddr3ddr4ddr5-ram-benchmarks
// /**
// @param {string} csvData - The CSV data to be processed.
// */
// const rows = csvData.split("\n");
// const headers = rows[0].split(",");

// for (let i = 1; i < rows.length; i++) {
// const values = rows[i].split(",");
// const memoryNameParts = values[0].split(" ");
// const capacity = memoryNameParts[memoryNameParts.length - 1];
// const obj = {
//     memoryName: values[0],
//     capacity,
//     gen: values[1],
//     latency: parseInt(values[2]),
//     readUncached: parseFloat(values[3]),
//     write: parseFloat(values[4])
// };
// data.push(obj);
// }


// Convert storage CSV data to JSON objects for insertion into MongoDB
// Data sourced from: https://www.kaggle.com/datasets/alanjo/ssd-and-hdd-benchmarks
// /**
// @param {string} csvData - The CSV data to be processed.
// */

// const rows = csvData.split("\n");
// const headers = rows[0].split(",");

// for (let i = 1; i < rows.length; i++) {
//     const values = rows[i].split(",");
//     const testDate = values[8];
//     if (testDate >= "2019") {
//         const obj = {
//             driveName: values[0],
//             type: values[1],
//             diskCapacity: parseFloat(values[2]),
//             diskMark: parseInt(values[3]),
//         };
//         data.push(obj);
//     }
// }


console.log(data);