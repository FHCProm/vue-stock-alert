<template>
  <div class="wallet mt20 br12 svelte-o95zkd">
    <SingleStockRecord
      ref="stockRecordReference"
      v-for="item in tradingModeStore.allStockMonthlyData"
      :key="item.filename"
      :symbol-data="item"
    ></SingleStockRecord>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import SingleStockRecord from "./SingleStockRecord.vue";
import { useTradingMode } from "@/stores/TradingMode";

const fs = window.require("fs");
const path = window.require("path");

const directoryPath = "./src/storage/symbols";
//let allStockMonthlyData = ref([]);
const tradingModeStore = useTradingMode();

defineExpose({
  ReadStockDataFromStorage,
});

onMounted(() => {
  ReadStockDataFromStorage();
});

function ReadStockDataFromStorage() {
  tradingModeStore.allStockMonthlyData = [];
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
        tradingModeStore.allStockMonthlyData.push(singleStock);
      });
    });
  });
}

const stockRecordReference = ref(null);
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
