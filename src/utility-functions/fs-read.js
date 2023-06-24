import { ref } from "vue";

export default function fileSystemRead() {
  const fs = window.require("fs");

  function readFromDataStatus() {
    const data = JSON.parse(
      fs.readFileSync("./src/storage/dataStatus.json", "utf-8")
    );
    return data;
  }

  function readDir(path) {
    return new Promise((resolve, reject) => {
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
    readFromDataStatus,
    readDir,
  };
}
