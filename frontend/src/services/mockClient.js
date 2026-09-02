const DEFAULT_DELAY_MS = 400;

function cloneData(data) {
  return typeof structuredClone === "function"
    ? structuredClone(data)
    : JSON.parse(JSON.stringify(data));
}

export function resolveMock(data, { delay = DEFAULT_DELAY_MS, shouldFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Mock request failed"));
      } else {
        resolve(cloneData(data));
      }
    }, delay);
  });
}
