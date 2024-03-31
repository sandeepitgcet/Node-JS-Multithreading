const { fork } = require("child_process");
const path = require("path");

class SharedResource {
  constructor() {
    this.flag = false;
  }

  setFlag(value) {
    this.flag = value;
  }

  getFlag() {
    return this.flag;
  }
}

function main() {
  console.log("Thread example");

  try {
    const worker1 = fork(path.resolve(__dirname, "child.js"), ["thread1"]);
    const worker2 = fork(path.resolve(__dirname, "child.js"), ["thread2"]);

    worker1.on("message", (msg) => {
      console.log(`Message from thread1: ${msg}`);
    });

    worker2.on("message", (msg) => {
      console.log(`Message from thread2: ${msg}`);
    });
  } catch (e) {
    console.error(e);
  }
}

const sharedResource = new SharedResource();

const threadName = process.argv[2];
if (!threadName) {
  main();
} else {
  if (threadName === "thread1") {
    console.log("Thread 1 started");
    setTimeout(() => {
      sharedResource.setFlag(true); // Set the flag after a delay
      console.log("Thread 1 set flag", sharedResource.getFlag());
      console.log("Thread 1 completed");
    }, 1000);
  } else if (threadName === "thread2") {
    console.log("Thread 2 started");
    console.log("Thread 2 flag initial value", sharedResource.getFlag());
    const checkFlag = () => {
      if (sharedResource.getFlag()) {
        console.log("Thread 2 completed");
        process.send("Flag is true");
      } else {
        setTimeout(checkFlag, 10); // Check the flag periodically
      }
    };

    checkFlag(); // Start checking the flag
  } else {
    console.log("Invalid thread name: " + threadName);
  }
}
