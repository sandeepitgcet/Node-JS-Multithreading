const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const path = require("path");

class SharedResource {
  constructor() {
    this.flag = new Int32Array(
      new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
    );
    this.flag[0] = 0;
  }

  setFlag(value) {
    Atomics.store(this.flag, 0, value ? 1 : 0);
  }

  getFlag() {
    return Atomics.load(this.flag, 0) === 1;
  }
}

function main() {
  console.log("Thread example");

  try {
    const worker1 = new Worker(__filename, {
      workerData: {
        threadName: "thread1",
      },
    });
    const worker2 = new Worker(__filename, {
      workerData: {
        threadName: "thread2",
      },
    });
  } catch (e) {
    console.error(e);
  }
}

const sharedResource = new SharedResource();

if (isMainThread) {
  main();
} else {
  const { threadName } = workerData;

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
      } else {
        setTimeout(checkFlag, 10); // Check the flag periodically
      }
    };

    checkFlag(); // Start checking the flag
  } else {
    console.log("Invalid thread name: " + threadName);
  }
}
