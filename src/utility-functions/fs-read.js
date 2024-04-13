import { ref } from "vue";

export default function fileSystemRead() {
  const fs = window.require("fs");

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
    readDir,
  };
}
