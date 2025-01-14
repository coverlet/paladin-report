const fs = require("fs");
const readline = require("readline");
const path = require('path');

const inputFilePath = path.resolve(__dirname, "./sample-input.txt");
const outputFilePath = path.resolve(__dirname, './output.log');

try {
  fs.writeFileSync(outputFilePath, '', 'utf-8'); 
  console.log(`Cleared the contents of ${outputFilePath}`);
} catch (error) {
  console.error('Error clearing output file:', error.message);
}

async function readLines(filePath) {
  const lines = [];
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lines.push(line);
  }

  return lines;
}

async function writeRandomLines(inputFilePath, outputFilePath) {
  const lines = await readLines(inputFilePath);

  if (lines.length === 0) {
    console.error("Input file is empty or could not be read.");
    return;
  }

  const writeStream = fs.createWriteStream(outputFilePath, { flags: "a" });

  const interval = setInterval(() => {
    const randomLine = lines[Math.floor(Math.random() * lines.length)];

    writeStream.write(randomLine + "\n", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        clearInterval(interval);
        writeStream.end();
      }
    });

    console.log(`Wrote line: ${randomLine}`);
  }, 500);

  // setTimeout(() => {
  //   clearInterval(interval);
  //   writeStream.end();
  //   console.log("Stopped writing random lines.");
  // }, 10000);
}

writeRandomLines(inputFilePath, outputFilePath).catch(console.error);
