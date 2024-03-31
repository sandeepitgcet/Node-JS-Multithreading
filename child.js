const { parentPort } = require("worker_threads");
console.log("Child process", process.argv[2]);
if (process.argv[2] === "thread1" || process.argv[2] === "thread2") {
  require("./main.js");
}
