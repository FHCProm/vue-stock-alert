<template>
  <SearchBar></SearchBar>
  <SelectionBar v-if="hasSelectedSymbols"></SelectionBar>
  <StockList v-if="hasSelectedSymbols" ref="stockListReference"></StockList>
</template>

<script setup>
import SearchBar from "./components/SearchBar.vue";
import StockList from "./components/StockList.vue";
import SelectionBar from "./components/SelectionBar.vue";
import { computed, onMounted, ref } from "vue";
import { useTradingMode } from "./stores/TradingMode";

const tradingModeStore = useTradingMode();
const hasSelectedSymbols = computed(
  () => tradingModeStore.symbols.length > 0
);

const moment = require("moment");

const stockListReference = ref(null);

onMounted(async () => {
  //new update : no need to check for dataStatus but pull data from database to trading mode
  // so reading data from api need to let singleStockRecord handle
  // the logic for progress bar also need to redo since we are no longer depending on the data pull from api
  //instead we are depending on the singleStockRecord to update to the trading Mode
  // if (checkDataStatusJson() == "outdated") {
  //   tradingModeStore.dataIsFullyLoaded = false;
  //   await getSymbolsWithOutdatedPrice();
  //   await getSymbolPriceFromAlphaVantage();
  //   saveUpdatedPriceToStorage();
  //   // stockListReference.value.ReadStockDataFromStorage();
  //   tradingModeStore.dataIsFullyLoaded = true;
  // }
});
</script>

<style>
#app {
  background: #ffffff;
  color: #000000;
  min-height: 100vh;
}

::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

body {
  background: #ffffff;
  color: #000000;
}

body a {
  text-decoration: none;
  color: #000000;
}
</style>
