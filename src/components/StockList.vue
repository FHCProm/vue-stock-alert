<template>
  <div class="wallet mt20 br12 svelte-o95zkd">
    <div class="table-header">
      <div
        data-selected="false"
        @click="arrangeList('company', $event)"
        :class="{ rotate: isSelected(1) }"
      >
        company
      </div>
      <div
        @click="arrangeList('now', $event)"
        data-selected="false"
        :class="{ rotate: isSelected(2) }"
      >
        now
      </div>
      <div
        @click="arrangeList('1 month', $event)"
        data-selected="false"
        :class="{ rotate: isSelected(3) }"
      >
        1 month
      </div>
      <div
        @click="arrangeList('3 month', $event)"
        data-selected="false"
        :class="{ rotate: isSelected(4) }"
      >
        3 month
      </div>
      <div
        @click="arrangeList('6 month', $event)"
        data-selected="false"
        :class="{ rotate: isSelected(5) }"
      >
        6 month
      </div>
    </div>
    <SingleStockRecord
      ref="stockRecordReference"
      v-for="(item, index) in tradingModeStore.symbols"
      :key="index"
      :symbol-data="item"
    ></SingleStockRecord>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed, TrackOpTypes } from "vue";
import SingleStockRecord from "./SingleStockRecord.vue";
import { useTradingMode } from "@/stores/TradingMode";
import fileSystemRead from "@/utility-functions/fs-read";
import coreJs from "core-js";

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

let currentlySelected = ref(10);
function arrangeList(option, event) {
  let dataset = event.target.dataset.selected;
  if (option == "company") {
    currentlySelected.value = 1;
  }
  let currentState = Boolean(dataset);
  console.log(currentState);
  event.target.dataset.selected = !currentState;
}

const isSelected = (index) => {
  return index == currentlySelected.value;
};

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

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 114px;
  min-width: 900px;
  padding: 10px 16px;
  border-bottom: 1px solid white;
}

.table-header > div {
  padding: 12px 8px;
  cursor: pointer;
  width: min-content;
  white-space: nowrap;
  position: relative;
}
.table-header > div::after {
  content: "";
  display: inline-block;
  background-image: url(../assets/triangle.png);
  position: absolute;
  background-size: contain;
  right: -16px;
  top: 13px;
  width: 15px;
  height: 15px;
  opacity: 0;
  transition: opacity 0.5s;
}

.table-header > div:hover::after {
  opacity: 1;
  transition: opacity 0.5s;
}
.rotate {
  transform: rotate(180deg);
}
</style>
