// thread1.js

const { workerData } = require("worker_threads");

function thread1() {
  const sharedResource = workerData.sharedResource; // Access sharedResource from workerData
  console.log("Thread 1 started");
  setTimeout(() => {
    sharedResource.setFlag(true); // Use setFlag method of sharedResource
    console.log("Thread 1 completed");
  }, 1000);
}

thread1();
