const { workerData } = require("worker_threads");

console.log("Thread 2 started");
const { sharedResource } = workerData;
while (!sharedResource.getFlag()) {
  // Busy wait until flag becomes true
}
console.log("Thread 2 completed");
