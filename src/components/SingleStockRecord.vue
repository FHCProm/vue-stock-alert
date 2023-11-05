<template>
  <div
    class="grid svelte-q2f2pt"
    style="
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
      min-width: 900px;
      padding: 10px 16px;
    "
    :class="{ rainbow: canTrade, grayedOut: !dataFreshnessStatus }"
  >
    <div class="row svelte-o95zkd" style="">
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
          :style="{ borderColor: currentMonthStatus.candleColor }"
          >now({{ currentMonthStatus.percentage }}%)</span
        >
      </div>
      <div class="svelte-o95zkd">
        <span
          class="uncolored-box"
          :style="{ borderColor: lastMonthStatus.candleColor }"
          >1 month({{ lastMonthStatus.percentage }}%)</span
        >
      </div>
      <div class="svelte-o95zkd">
        <span
          class="uncolored-box"
          :style="{ borderColor: last3MonthStatus.candleColor }"
          >3 month({{ last3MonthStatus.percentage }}%)</span
        >
      </div>
      <div class="svelte-o95zkd">
        <span
          class="uncolored-box"
          :style="{ borderColor: last6MonthStatus.candleColor }"
          >6 month({{ last6MonthStatus.percentage }}%)</span
        >
      </div>

      <div class="df aic svelte-o95zkd">
        <a class="cp BLUE btc-deposit svelte-o95zkd" href="#"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="star"
          >
            <path
              fill-rule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clip-rule="evenodd"
            />
          </svg>
        </a>

        <a class="ml24 cp BLUE btc-deposit svelte-o95zkd" href="#">Remove</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from "vue";
import { useTradingMode } from "@/stores/TradingMode";
const tradingModeStore = useTradingMode();

const props = defineProps({
  symbolData: {
    type: Object,
    required: true,
  },
});

let canTrade = ref(false);

let currentMonthStatus = ref({
  candleColor: "gray",
  percentage: "?",
});

let lastMonthStatus = ref({
  candleColor: "gray",
  percentage: "?",
});
let last3MonthStatus = ref({
  candleColor: "gray",
  percentage: "?",
});

let last6MonthStatus = ref({
  candleColor: "gray",
  percentage: "?",
});

const dataFreshnessStatus = computed(() => {
  let dataIsUpdated = false;
  if (tradingModeStore.dataIsFullyLoaded === true) {
    dataIsUpdated = true;
  }
  return dataIsUpdated;
});

if (props.symbolData != undefined) {
  let specificDate;
  let specificDateMonth;
  let specificDateYear;

  let currentDate = new Date();
  let currentMonthOpenAndClosePrice = {};
  let lastMonthOpenAndClosePrice = {};
  let last3MonthOpenAndClosePrice = {};
  let last6MonthOpenAndClosePrice = {};

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

    //this is to get this month open and close price
    if (
      specificDateMonth == currentDate.getMonth() &&
      specificDateYear == currentDate.getFullYear()
    ) {
      currentMonthOpenAndClosePrice = {
        ...props.symbolData.monthlyTime[`${key}`],
      };
    }

    //this is to get last month open and close price

    if (specificDateMonth == lastMonth && specificDateYear == yearOfLastMonth) {
      lastMonthOpenAndClosePrice = {
        ...props.symbolData.monthlyTime[`${key}`],
      };
    }

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
  //this is for current month status
  //
  //

  let currentMonthPercentageChange = getPercentageChanged(
    currentMonthOpenAndClosePrice["1. open"],
    currentMonthOpenAndClosePrice["4. close"]
  );
  if (
    currentMonthOpenAndClosePrice["4. close"] -
      currentMonthOpenAndClosePrice["1. open"] >=
    0
  ) {
    currentMonthStatus.value.candleColor = "green";
  } else {
    currentMonthStatus.value.candleColor = "red";
  }
  currentMonthStatus.value.percentage = Math.abs(
    currentMonthPercentageChange
  ).toFixed(2);

  //
  //
  //this is for last month status
  //
  //

  let lastMonthPercentageChange = getPercentageChanged(
    lastMonthOpenAndClosePrice["1. open"],
    lastMonthOpenAndClosePrice["4. close"]
  );

  if (
    lastMonthOpenAndClosePrice["4. close"] -
      lastMonthOpenAndClosePrice["1. open"] >=
    0
  ) {
    lastMonthStatus.value.candleColor = "green";
  } else {
    lastMonthStatus.value.candleColor = "red";
  }
  lastMonthStatus.value.percentage = Math.abs(
    lastMonthPercentageChange
  ).toFixed(2);

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
    last3MonthStatus.value.candleColor = "green";
  } else {
    last3MonthStatus.value.candleColor = "red";
  }
  last3MonthStatus.value.percentage = Math.abs(
    last3MonthPercentageChange
  ).toFixed(2);

  //
  //
  //this is for last 6 month status
  //
  //

  let last6MonthPercentageChange = getPercentageChanged(
    last6MonthOpenAndClosePrice.open["1. open"],
    last6MonthOpenAndClosePrice.close["4. close"]
  );

  if (
    last6MonthOpenAndClosePrice.close["4. close"] -
      last6MonthOpenAndClosePrice.open["1. open"] >=
    0
  ) {
    last6MonthStatus.value.candleColor = "green";
  } else {
    last6MonthStatus.value.candleColor = "red";
  }

  last6MonthStatus.value.percentage = Math.abs(
    last6MonthPercentageChange
  ).toFixed(2);
}
function getPercentageChanged(open, close) {
  return ((close - open) / open) * 100;
}

function initiateColorChange() {
  canTrade.value = false;
  if (tradingModeStore.mode == "Standard") {
    if (
      last6MonthStatus.value.candleColor == "green" &&
      lastMonthStatus.value.candleColor == "red"
    ) {
      canTrade.value = true;
    }
  }

  if (tradingModeStore.mode == "Fastest") {
    if (
      last3MonthStatus.value.candleColor == "green" &&
      lastMonthStatus.value.candleColor == "red"
    ) {
      canTrade.value = true;
    }
  }
  if (tradingModeStore.mode == "Most Secure") {
    if (
      last6MonthStatus.value.candleColor == "green" &&
      last3MonthStatus.value.candleColor == "red"
    ) {
      canTrade.value = true;
    }
  }
}
defineExpose({
  initiateColorChange,
});

initiateColorChange();
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
  padding: 4px 8px;
}

.star {
  color: gray;
  width: 20px;
  height: 20px;
  display: grid;
  justify-content: center;
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
  border-color: gray;
  border-image: none;
}
</style>
