async function cliReadLine() {
  const readline = require('readline');
  return await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("", answer => {
      rl.close();
      resolve(answer);
    });
  });
}
exports.cliReadLine = cliReadLine;
