<template>
  <SearchBar></SearchBar>
  <SelectionBar></SelectionBar>
  <StockList ref="stockListReference"></StockList>
</template>

<script setup>
import SearchBar from "./components/SearchBar.vue";
import StockList from "./components/StockList.vue";
import SelectionBar from "./components/SelectionBar.vue";
import fileSystemRead from "@/utility-functions/fs-read";
import commonUtil from "./utility-functions/common-utility";
import { onMounted, ref } from "vue";
import { useTradingMode } from "@/stores/TradingMode";

const fs = window.require("fs");
const moment = require("moment");
let outdatedSymbols = [];

let newSymbolPriceList = {};
const tradingModeStore = useTradingMode();
const stockListReference = ref(null);

onMounted(async () => {
  if (checkDataStatusJson() == "outdated") {
    tradingModeStore.dataIsFullyLoaded = false;
    await getSymbolsWithOutdatedPrice();
    await getSymbolPriceFromAlphaVantage();
    saveUpdatedPriceToStorage();
    stockListReference.value.ReadStockDataFromStorage();
    tradingModeStore.dataIsFullyLoaded = true;
  }
});

function checkDataStatusJson() {
  const data = JSON.parse(
    fs.readFileSync("./src/storage/dataStatus.json", "utf-8")
  );

  let unixTimestamp = data["last_updated"]; // Replace with your Unix timestamp

  if (
    moment().format("YYYY-MM-DD") !==
    moment.unix(unixTimestamp).format("YYYY-MM-DD")
  ) {
    console.log("loading new data right now");
    return "outdated";
  } else {
    console.log("you have just reloaded the data for today");
    return "updated";
  }
}

async function getSymbolsWithOutdatedPrice() {
  let directoryPath = "./src/storage/symbols";
  let allSymbols = [];
  allSymbols = await fileSystemRead().readDir(directoryPath);

  for (let x = 0; x < allSymbols.length; x++) {
    let symbolPath = `./src/storage/symbols/${allSymbols[x]}`;
    const data = JSON.parse(fs.readFileSync(symbolPath, "utf-8"));
    if (data["lastUpdated"] == undefined) {
      data["lastUpdated"] = Date.now();
    }
    let symbolLastUpdated = new Date(data["lastUpdated"]);
    let todayDate = new Date();
    if (
      symbolLastUpdated.getDate() == todayDate.getDate() &&
      symbolLastUpdated.getMonth() == todayDate.getMonth()
    ) {
      console.log("data up-to-date");
      //outdatedSymbols.push(data["symbol"]);
    }

    if (
      symbolLastUpdated.getDate() != todayDate.getDate() ||
      symbolLastUpdated.getMonth() != todayDate.getMonth()
    ) {
      outdatedSymbols.push(data["symbol"]);
    }
  }
}

async function getSymbolPriceFromAlphaVantage() {
  const api_key = fileSystemRead().readFromDataStatus();
  let outdatedSymbolsCopy = [...outdatedSymbols];
  tradingModeStore.progressBarTotalSymbol = outdatedSymbolsCopy.length;

  while (outdatedSymbolsCopy.length > 0) {
    var url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${outdatedSymbolsCopy[0]}&apikey=${api_key}`;

    try {
      const response = await fetch(url);
      const alphaVantageData = await response.json();
      if (alphaVantageData["Monthly Time Series"] == undefined) {
        var now = new Date();
        var secondsRemaining = 60 - now.getSeconds() + 2;
        console.log(`waiting for ${secondsRemaining}s`);
        await commonUtil().sleep(secondsRemaining * 1000);
      } else {
        let newPriceData = reduceTheAmountOfMonthlyPricesData(
          alphaVantageData["Monthly Time Series"]
        );
        newSymbolPriceList[`${outdatedSymbolsCopy[0]}`] = newPriceData;
        outdatedSymbolsCopy.shift();
        tradingModeStore.progressBarLoadedSymbol++;
      }
    } catch (error) {
      console.error(error);
    }
    console.log(newSymbolPriceList);
  }
}
function saveUpdatedPriceToStorage() {
  let errorWhenSaving = false;
  for (let x = 0; x < outdatedSymbols.length; x++) {
    let symbolPath = `./src/storage/symbols/${outdatedSymbols[x]}.json`;
    const data = JSON.parse(fs.readFileSync(symbolPath, "utf-8"));
    data["lastUpdated"] = Date.now();
    data["monthlyTime"] = newSymbolPriceList[`${outdatedSymbols[x]}`];

    try {
      fs.writeFileSync(symbolPath, JSON.stringify(data));
    } catch (e) {
      console.log(e);
      errorWhenSaving = true;
    }
  }
  if (!errorWhenSaving) {
    updateDataStatusJson();
  }
}

function updateDataStatusJson() {
  const path = "./src/storage/dataStatus.json";
  const data = JSON.parse(fs.readFileSync(path, "utf-8"));
  data["last_updated"] = Math.floor(Date.now() / 1000);
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
}

function reduceTheAmountOfMonthlyPricesData(originalMonthlyPrices) {
  let currentDate = new Date();
  let filteredStockMonthlyPrices = {};
  for (const key in originalMonthlyPrices) {
    let specificDate = new Date(key);
    if (currentDate.getTime() - specificDate.getTime() < 63114704000) {
      filteredStockMonthlyPrices[`${key}`] = originalMonthlyPrices[`${key}`];
    }
  }
  return filteredStockMonthlyPrices;
}
</script>

<style>
#app {
  color: white;
}

::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

body a {
  text-decoration: none;
}
</style>
