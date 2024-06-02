<template>
  <div
    class="grid svelte-q2f2pt"
    style="
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
      min-width: 900px;
      padding: 10px 16px;
    "
    :class="{
      rainbow: rainbowBoxChanges,
      grayedOut: !dataFreshnessStatus,
      glow: newlyAdded,
      boxStarred: isStarred,
    }"
  >
    <div class="row svelte-o95zkd">
      <div class="df aic svelte-o95zkd">
        <div class="svelte-o95zkd">
          <div class="df aic fw3 T1 lh18 svelte-o95zkd">
            <span class="svelte-o95zkd">{{ props.symbolData.symbol }}</span>
          </div>
          <div class="f12 T4 lh18 svelte-o95zkd">
            {{ props.symbolData.company }}
          </div>
        </div>
      </div>
      <div class="svelte-o95zkd">
        <span
          class="uncolored-box"
          :style="{ borderColor: computedCurrentMonth.candleColor }"
          >{{ computedCurrentMonth.percentage }}%</span
        >
      </div>
      <div class="svelte-o95zkd">
        <span
          class="uncolored-box"
          :style="{ borderColor: computedLastMonth.candleColor }"
          >{{ computedLastMonth.percentage }}%</span
        >
      </div>
      <div class="svelte-o95zkd">
        <span
          class="uncolored-box"
          :style="{ borderColor: computedLast3Month.candleColor }"
          >{{ computedLast3Month.percentage }}%</span
        >
      </div>
      <div class="svelte-o95zkd">
        <span
          class="uncolored-box"
          :style="{ borderColor: computedLast6Month.candleColor }"
          >{{ computedLast6Month.percentage }}%</span
        >
      </div>

      <div class="df aic svelte-o95zkd">
        <a class="cp BLUE btc-deposit svelte-o95zkd" href="#"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="star"
            @click="starRecord"
            :class="{ isStarred: isStarred }"
          >
            <path
              fill-rule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clip-rule="evenodd"
            />
          </svg>
        </a>

        <a
          class="ml24 cp BLUE btc-deposit svelte-o95zkd red-highlight"
          @click="removeSymbol"
          >Remove</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  VueElement,
  computed,
  defineProps,
  onMounted,
  reactive,
  ref,
} from "vue";
import { useTradingMode } from "@/stores/TradingMode";
import moment from "moment";

const tradingModeStore = useTradingMode();

const props = defineProps({
  symbolData: {
    type: Object,
    required: true,
  },
});
const fs = window.require("fs");

const dataFreshnessStatus = ref(false);
const newlyAdded = ref(false);

let symbolMonthlyPrice = {};
let dataIsUpdated = ref(false);

const computedCurrentMonth = computed(() => {
  let currentMonthValues = {};
  if (dataIsUpdated.value) {
    let specificDate;
    let specificDateMonth;
    let specificDateYear;
    let currentDate = new Date();
    let currentMonthOpenAndClosePrice = {};

    for (const key in props.symbolData.monthlyTime) {
      specificDate = new Date(key);
      specificDateMonth = specificDate.getMonth();
      specificDateYear = specificDate.getFullYear();

      if (
        specificDateMonth == currentDate.getMonth() &&
        specificDateYear == currentDate.getFullYear()
      ) {
        currentMonthOpenAndClosePrice = {
          ...props.symbolData.monthlyTime[`${key}`],
        };
      }
    }
    let currentMonthPercentageChange = getPercentageChanged(
      currentMonthOpenAndClosePrice["1. open"],
      currentMonthOpenAndClosePrice["4. close"]
    );

    if (
      currentMonthOpenAndClosePrice["4. close"] -
        currentMonthOpenAndClosePrice["1. open"] >=
      0
    ) {
      currentMonthValues["candleColor"] = "green";
    } else {
      currentMonthValues["candleColor"] = "red";
    }
    currentMonthValues["percentage"] = Math.abs(
      currentMonthPercentageChange
    ).toFixed(2);
  }
  return currentMonthValues;
});

const computedLastMonth = computed(() => {
  let lastMonthValues = {};
  if (dataIsUpdated.value) {
    let specificDate;
    let specificDateMonth;
    let specificDateYear;
    let currentDate = new Date();
    let lastMonthOpenAndClosePrice = {};

    let yearOfLastMonth = currentDate.getFullYear();
    let lastMonth = currentDate.getMonth() - 1;

    //if current month is january , there will be bug if we dont add this.
    if (lastMonth < 0) {
      lastMonth = 11;
      yearOfLastMonth -= 1;
    }

    //with all the necessary dates , now we loop through Alpha vantage data to get prices.
    for (const key in props.symbolData.monthlyTime) {
      specificDate = new Date(key);
      specificDateMonth = specificDate.getMonth();
      specificDateYear = specificDate.getFullYear();

      if (
        specificDateMonth == lastMonth &&
        specificDateYear == yearOfLastMonth
      ) {
        lastMonthOpenAndClosePrice = {
          ...props.symbolData.monthlyTime[`${key}`],
          // ...props.symbolData.monthlyTime[`${key}`],
        };
      }
    }

    let lastMonthPercentageChange = getPercentageChanged(
      lastMonthOpenAndClosePrice["1. open"],
      lastMonthOpenAndClosePrice["4. close"]
    );

    if (
      lastMonthOpenAndClosePrice["4. close"] -
        lastMonthOpenAndClosePrice["1. open"] >=
      0
    ) {
      lastMonthValues["candleColor"] = "green";
    } else {
      lastMonthValues["candleColor"] = "red";
    }
    lastMonthValues["percentage"] = Math.abs(lastMonthPercentageChange).toFixed(
      2
    );
  }
  return lastMonthValues;
});

const computedLast3Month = computed(() => {
  let last3MonthValue = {};
  if (dataIsUpdated.value) {
    let specificDate;
    let specificDateMonth;
    let specificDateYear;

    let currentDate = new Date();
    let last3MonthOpenAndClosePrice = {
      open: {
        "1. open": 0,
        "4. close": 0,
      },
      close: { "1. open": 0, "4. close": 0 },
    };
    let yearOfLastMonth = currentDate.getFullYear();
    let lastMonth = currentDate.getMonth() - 1;

    //if current month is january , there will be bug if we dont add this.
    if (lastMonth < 0) {
      lastMonth = 11;
      yearOfLastMonth -= 1;
    }
    //
    //
    //this is to get last 3 months candles.Get the opening month and closing month and year
    //
    //
    let last3MonthOpenMonth;
    let last3MonthCloseMonth;
    let yearOflast3Months = yearOfLastMonth;
    let foundOpenAndClose3Month = false;
    const closingMonthOf3Months = [2, 5, 8, 11];
    for (let x = lastMonth; foundOpenAndClose3Month == false; x--) {
      if (x < 0) {
        x = 11;
        yearOflast3Months -= 1;
      }
      if (closingMonthOf3Months.includes(x)) {
        last3MonthCloseMonth = x;
        last3MonthOpenMonth = x - 2;
        foundOpenAndClose3Month = true;
      }
    }
    for (const key in props.symbolData.monthlyTime) {
      specificDate = new Date(key);
      specificDateMonth = specificDate.getMonth();
      specificDateYear = specificDate.getFullYear();
      //this is to get last 3 month open and close price.
      if (
        specificDateMonth == last3MonthOpenMonth &&
        specificDateYear == yearOflast3Months
      ) {
        last3MonthOpenAndClosePrice["open"] = {
          ...props.symbolData.monthlyTime[`${key}`],
        };
      }

      if (
        specificDateMonth == last3MonthCloseMonth &&
        specificDateYear == yearOflast3Months
      ) {
        last3MonthOpenAndClosePrice["close"] = {
          ...props.symbolData.monthlyTime[`${key}`],
        };
      }
    }

    //
    //
    //this is for last 3 month status
    //
    //

    let last3MonthPercentageChange = getPercentageChanged(
      last3MonthOpenAndClosePrice.open["1. open"],
      last3MonthOpenAndClosePrice.close["4. close"]
    );
    if (
      last3MonthOpenAndClosePrice.close["4. close"] -
        last3MonthOpenAndClosePrice.open["1. open"] >=
      0
    ) {
      last3MonthValue["candleColor"] = "green";
    } else {
      last3MonthValue["candleColor"] = "red";
    }
    last3MonthValue["percentage"] = Math.abs(
      last3MonthPercentageChange
    ).toFixed(2);
  }
  return last3MonthValue;
});

const computedLast6Month = computed(() => {
  let last6MonthValue = {};
  if (dataIsUpdated.value) {
    let specificDate;
    let specificDateMonth;
    let specificDateYear;

    let currentDate = new Date();
    let last6MonthOpenAndClosePrice = {
      open: {
        "1. open": 0,
        "4. close": 0,
      },
      close: { "1. open": 0, "4. close": 0 },
    };

    let yearOfLastMonth = currentDate.getFullYear();
    let lastMonth = currentDate.getMonth() - 1;

    //
    //
    //this is to get last 6 months candles.Get the opening month and closing month
    //
    //
    let last6MonthOpenMonth;
    let last6MonthCloseMonth;
    let yearOflast6Months = yearOfLastMonth;
    let foundOpenAndClose6Month = false;
    const closingMonthOf6Months = [5, 11];
    for (let x = lastMonth; foundOpenAndClose6Month == false; x--) {
      if (x < 0) {
        x = 11;
        yearOflast6Months -= 1;
      }
      if (closingMonthOf6Months.includes(x)) {
        last6MonthCloseMonth = x;
        last6MonthOpenMonth = x - 5;
        foundOpenAndClose6Month = true;
      }
    }

    //with all the necessary dates , now we loop through Alpha vantage data to get prices.

    for (const key in props.symbolData.monthlyTime) {
      specificDate = new Date(key);
      specificDateMonth = specificDate.getMonth();
      specificDateYear = specificDate.getFullYear();

      //this is to get last 6 month open and close price.
      if (
        specificDateMonth == last6MonthOpenMonth &&
        specificDateYear == yearOflast6Months
      ) {
        last6MonthOpenAndClosePrice["open"] = {
          ...props.symbolData.monthlyTime[`${key}`],
        };
      }
      if (
        specificDateMonth == last6MonthCloseMonth &&
        specificDateYear == yearOflast6Months
      ) {
        last6MonthOpenAndClosePrice["close"] = {
          ...props.symbolData.monthlyTime[`${key}`],
        };
      }
    }
    //
    //
    //this is for last 6 month status
    //
    //

    if (
      last6MonthOpenAndClosePrice.open["1. open"] &&
      last6MonthOpenAndClosePrice.close["4. close"]
    ) {
      let last6MonthPercentageChange = getPercentageChanged(
        last6MonthOpenAndClosePrice.open["1. open"],
        last6MonthOpenAndClosePrice.close["4. close"]
      );
      if (
        last6MonthOpenAndClosePrice.close["4. close"] -
          last6MonthOpenAndClosePrice.open["1. open"] >=
        0
      ) {
        last6MonthValue["candleColor"] = "green";
      } else {
        last6MonthValue["candleColor"] = "red";
      }

      last6MonthValue["percentage"] = Math.abs(
        last6MonthPercentageChange
      ).toFixed(2);
    }
  }
  return last6MonthValue;
});

onMounted(async () => {
  symbolMonthlyPrice = props.symbolData.monthlyTime;

  if (moment(props.symbolData.lastUpdated).isSame(moment(), "month")) {
    dataIsUpdated.value = true;
    dataFreshnessStatus.value = true;
    tradingModeStore.progressBarLoadedSymbol++;
  }

  if (dataIsUpdated.value == false) {
    console.log(`getting data for ${props.symbolData.symbol}`);
    const api_key = process.env.API_KEY;
    var url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${props.symbolData["symbol"]}&apikey=${api_key}`;
    try {
      const response = await fetch(url);
      const alphaVantageData = await response.json();

      if (alphaVantageData["Information"]) {
        console.log("25 daily api limit based on IP address reached");
        return;
      }
      if (alphaVantageData["Monthly Time Series"]) {
        let newPriceData = reduceTheAmountOfMonthlyPricesData(
          alphaVantageData["Monthly Time Series"]
        );
        symbolMonthlyPrice = newPriceData;
      }
      savePriceToStorage();
      dataFreshnessStatus.value = true;
      tradingModeStore.progressBarLoadedSymbol++;
    } catch (error) {
      console.error(error);
    }
    //make your updating to database easier by adding a function that can keep saving stock data in trading mode file
  }

  newlyAdded.value = true;
  setTimeout(() => {
    newlyAdded.value = false;
  }, 500);
});

function getPercentageChanged(open, close) {
  // if (open == undefined || close == undefined) {
  //   return 0;
  // }
  return ((close - open) / open) * 100;
}

const rainbowBoxChanges = computed(() => {
  let colored = false;

  if (tradingModeStore.mode == "Standard") {
    if (
      computedLast6Month.value.candleColor == "green" &&
      computedLastMonth.value.candleColor == "red"
    ) {
      colored = true;
    }
  }

  if (tradingModeStore.mode == "Fastest") {
    if (
      computedLast3Month.value.candleColor == "green" &&
      computedLastMonth.value.candleColor == "red"
    ) {
      colored = true;
    }
  }
  if (tradingModeStore.mode == "Most Secure") {
    if (
      computedLast6Month.value.candleColor == "green" &&
      computedLast3Month.value.candleColor == "red"
    ) {
      colored = true;
    }
  }

  return colored;
});

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

function savePriceToStorage() {
  let symbolPath = `./src/storage/symbols/${props.symbolData.symbol}.json`;
  const data = JSON.parse(fs.readFileSync(symbolPath, "utf-8"));

  data["lastUpdated"] = Date.now();
  data["monthlyTime"] = symbolMonthlyPrice;

  for (let x = 0; x < tradingModeStore.symbols.length; x++) {
    if (tradingModeStore.symbols[x].symbol == props.symbolData.symbol) {
      tradingModeStore.symbols[x].monthlyTime = symbolMonthlyPrice;
      break;
    }
  }

  dataIsUpdated.value = true;

  try {
    fs.writeFileSync(symbolPath, JSON.stringify(data));
  } catch (e) {
    console.log(e);
    console.log("failed to save to the files");
  }
}

function removeSymbol() {
  let symbolPath = `./src/storage/symbols/${props.symbolData.symbol}.json`;

  fs.unlink(symbolPath, (err) => {
    if (err) {
      console.error("An error occurred while deleting the file:", err);
      return;
    }
    //get the index of the removed symbol from tradingModeStore for removal
    let indexToRemove;
    for (let x = 0; x < tradingModeStore.symbols.length; x++) {
      if (tradingModeStore.symbols[x]["symbol"] == props.symbolData.symbol) {
        indexToRemove = x;
        break;
      }
    }
    tradingModeStore.symbols.splice(indexToRemove, 1);
    console.log(`${props.symbolData.symbol} was deleted successfully.`);
  });
}

const isStarred = computed(() => {
  return props.symbolData.isStarred;
});

function starRecord() {
  for (let i = 0; i < tradingModeStore.symbols.length; i++) {
    if (tradingModeStore.symbols[i].symbol == props.symbolData.symbol) {
      if (tradingModeStore.symbols[i]["isStarred"] == undefined) {
        tradingModeStore.symbols[i]["isStarred"] = true;
      } else {
        tradingModeStore.symbols[i]["isStarred"] =
          !tradingModeStore.symbols[i]["isStarred"];
      }

      break;
    }
  }

  if (props.symbolData.isStarred) {
    let indexToBeMoved;
    for (let i = 0; i < tradingModeStore.symbols.length; i++) {
      if (props.symbolData.symbol == tradingModeStore.symbols[i].symbol) {
        indexToBeMoved = i;
        break;
      }
    }
    let starredItem = tradingModeStore.symbols[indexToBeMoved];
    tradingModeStore.symbols.splice(indexToBeMoved, 1);
    tradingModeStore.symbols.unshift(starredItem);
    //save the star status to the file
  }

  //remove the star from the line
  if (!props.symbolData.isStarred) {
    let movingRow = props.symbolData;
    let movingRowIndex;
    //get the location of the to-be-unstarred item to remove it from the array
    for (let i = 0; i < tradingModeStore.symbols.length; i++) {
      if (tradingModeStore.symbols[i].symbol == movingRow.symbol) {
        movingRowIndex = i;
        break;
      }
    }
    tradingModeStore.symbols.splice(movingRowIndex, 1);

    //get the location where the unstarred item is supposed to be moved
    let indexToBeMoved;
    for (let i = 0; i < tradingModeStore.symbols.length; i++) {
      if (
        tradingModeStore.symbols[i].isStarred == undefined ||
        tradingModeStore.symbols[i].isStarred == false
      ) {
        indexToBeMoved = i;
        break;
      }
    }
    tradingModeStore.symbols.splice(indexToBeMoved, 0, movingRow);

    //save the star status to the file
  }
}
</script>

<style scoped>
.grid.svelte-q2f2pt {
  display: grid;
  max-height: 100%;
  line-height: 42px;
}

.row.svelte-o95zkd.svelte-o95zkd {
  display: contents;
}

.row.svelte-o95zkd > div.svelte-o95zkd {
  padding: 12px 8px;
}
.aic {
  align-items: center;
}

.df {
  display: flex;
}

.coin.svelte-o95zkd.svelte-o95zkd {
  border-radius: 50%;
  width: 36px;
  height: 36px;
}

.mr16 {
  margin-right: 16px;
}

body img {
  vertical-align: unset;
}

.fw3 {
  font-weight: 600;
}

.lh18 {
  line-height: 18px;
}

.aic {
  align-items: center;
}

.df {
  display: flex;
}

.T4 {
  color: #9fa3ab;
}

.f12 {
  font-size: 12px;
}

.lh18 {
  line-height: 18px;
}

.row.svelte-o95zkd > div.svelte-o95zkd {
  padding: 12px 8px;
}

.cp {
  cursor: pointer;
}
.BLUE {
  color: white;
}
.ml24 {
  margin-left: 24px;
}

.uncolored-box {
  border: 0.5px solid gray;
  padding: 8px 21px;
}

.star {
  color: gray;
  width: 20px;
  height: 20px;
  display: grid;
  justify-content: center;
}
.star:hover {
  color: rgb(244, 235, 187);
}

.rainbow {
  margin-top: 2px;
  border: 2px solid;
  border-image: linear-gradient(
    to right,
    red,
    orange,
    yellow,
    green,
    blue,
    indigo,
    violet
  );
  border-image-slice: 1;
}

.grayedOut {
  border: 2px solid gray;
  border-image: none;
}

.glow {
  animation: glow 0.5s ease-in-out forwards;
  background-size: 100% 200%;
}

@keyframes glow {
  0% {
    opacity: 0;
    background-color: #383d6b;
  }

  100% {
    opacity: 1;
    background-color: #15172a;
  }
}
.red-highlight:hover {
  color: red;
}
.isStarred {
  color: rgb(255, 200, 0);
}
.isStarred:hover {
  color: rgb(255, 200, 0);
}

.boxStarred {
  background-color: #d9e27534;
}
</style>
