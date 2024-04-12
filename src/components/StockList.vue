<template>
  <div class="wallet mt20 br12 svelte-o95zkd">
    <SingleStockRecord
      ref="stockRecordReference"
      v-for="item in tradingModeStore.symbols"
      :key="item.symbol"
      :symbol-data="item"
    ></SingleStockRecord>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import SingleStockRecord from "./SingleStockRecord.vue";
import { useTradingMode } from "@/stores/TradingMode";
import fileSystemRead from "@/utility-functions/fs-read";

const fs = window.require("fs");
const path = window.require("path");

const directoryPath = "./src/storage/symbols";

const tradingModeStore = useTradingMode();

// defineExpose({
//   ReadStockDataFromStorage,
// });

let symbols = ref([]);
onMounted(async () => {
  // ReadStockDataFromStorage();
  await getAllSymbolsFromStorage();
});

async function getAllSymbolsFromStorage() {
  let directoryPath = "./src/storage/symbols";
  let allSymbols = [];
  allSymbols = await fileSystemRead().readDir(directoryPath);
  for (let x = 0; x < allSymbols.length; x++) {
    let symbolPath = `./src/storage/symbols/${allSymbols[x]}`;
    const data = JSON.parse(fs.readFileSync(symbolPath, "utf-8"));
    symbols.value.push(data);
  }

  tradingModeStore.symbols = symbols.value;
  tradingModeStore.progressBarTotalSymbol = symbols.value.length;
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
