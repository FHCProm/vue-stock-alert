export default function fileSystemRead() {
  const canReadFs =
    typeof window !== "undefined" && typeof window.require === "function";
  const fs = canReadFs ? window.require("fs") : null;

  function readDir(path) {
    return new Promise((resolve, reject) => {
      if (!fs) {
        resolve([]);
        return;
      }

      fs.readdir(path, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  return {
    readDir,
  };
}
