const { spawn } = require("child_process");
const { host, url } = require('./config.js');

const postData = (data) => {
  fetch(url, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).catch((error) => console.error("Error:", error.message));
};

const committedLamportsRegex = /committed_lamports=(\d+)i/;
const lamportsToSol = 1000000000;

try {
  const journalctl = spawn("./src/command.sh");
  let buffer = "";

  journalctl.stdout.on("data", (data) => {
    buffer += data.toString();
    let lines = buffer.split("\n");
    buffer = lines.pop();

    lines.forEach((line) => {
      const match = committedLamportsRegex.exec(line);
      if (match) {
        const timestampInNanoseconds = BigInt(Date.now()) * BigInt(1e6);

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const dayOnlyTimeStamp = BigInt(currentDate.getTime()) * BigInt(1e6);

        console.log(timestampInNanoseconds);

        const committedLamports = parseInt(match[1], 10);
        const sol = committedLamports / lamportsToSol;

        const data = `solana_node,host=${host} paladinSol=${sol},date=${timestampInNanoseconds},day=${dayOnlyTimeStamp}`;
        console.log(data);
        postData(data);
      }
    });
  });

  journalctl.stderr.on("data", (data) => {
    console.error("Error:", data.toString());
  });

  journalctl.on("close", (code) => {
    console.log(`journalctl process exited with code ${code}`);
  });
} catch (error) {
  console.error("Error clearing output file:", error.message);
}
