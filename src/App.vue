<template>
  <SearchBar></SearchBar>
  <SelectionBar></SelectionBar>
  <StockList></StockList>
</template>

<script setup>
import SearchBar from "./components/SearchBar.vue";
import StockList from "./components/StockList.vue";
import SelectionBar from "./components/SelectionBar.vue";

const fs = window.require("fs");
const moment = require("moment");

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
