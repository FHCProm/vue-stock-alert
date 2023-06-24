<template>
  <SearchBar></SearchBar>
  <SelectionBar></SelectionBar>
  <StockList></StockList>
</template>

<script setup>
import SearchBar from "./components/SearchBar.vue";
import StockList from "./components/StockList.vue";
import SelectionBar from "./components/SelectionBar.vue";
import fileSystemRead from "@/utility-functions/fs-read";

const fs = window.require("fs");
const moment = require("moment");

checkDataStatusJson();
checkSymbolStockPrice();

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
  } else {
    console.log("you have just reloaded the data for today");
  }
}

async function checkSymbolStockPrice() {
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
      console.log("it is already updated");
    }

    if (
      symbolLastUpdated.getDate() != todayDate.getDate() ||
      symbolLastUpdated.getMonth() != todayDate.getMonth()
    ) {
      const api_key = fileSystemRead().readFromDataStatus();

      var url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${data["symbol"]}&apikey=${api_key}`;

      try {
        const response = await fetch(url);
        const alphaVantageData = await response.json();
        let newPriceData = reduceTheAmountOfMonthlyPricesData(
          alphaVantageData["Monthly Time Series"]
        );
        data["monthlyTime"] = newPriceData;
        fs.writeFile(symbolPath, JSON.stringify(data), (err) => {
          if (err) throw err;
        });
      } catch (error) {
        console.error(error);
      }
    }
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
