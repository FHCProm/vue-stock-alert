import { ref } from "vue";

export default function fileSystemRead() {
  const fs = window.require("fs");

  function readFromDataStatus() {
    const data = JSON.parse(
      fs.readFileSync("./src/storage/dataStatus.json", "utf-8")
    );
    return data;
  }

  function myOtherFunction() {
    console.log("to be added");
  }

  return {
    readFromDataStatus,
    myOtherFunction,
  };
}
