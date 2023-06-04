<template>
  <div class="wallet mt20 br12 svelte-o95zkd">
    <SingleStockRecord
      v-for="item in allStockMonthlyData"
      :key="item.filename"
      :symbol-data="item"
    ></SingleStockRecord>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SingleStockRecord from "./SingleStockRecord.vue";

const fs = window.require("fs");
const path = window.require("path");

const directoryPath = "./src/storage/symbols";
let allStockMonthlyData = ref([]);
fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach((file) => {
    fs.readFile(path.join(directoryPath, file), "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let singleStock = JSON.parse(data);
      allStockMonthlyData.value.push(singleStock);
    });
  });
});
</script>

<style scoped>
.wallet.svelte-o95zkd.svelte-o95zkd {
  background: #15172a;
}

.br12 {
  border-radius: 12px;
}
.mt20 {
}
</style>
