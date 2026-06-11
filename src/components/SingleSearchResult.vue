<template>
  <div class="DocSearch-Hit-Container">
    <div class="DocSearch-Hit-icon">
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path
          d="M17 6v12c0 .52-.2 1-1 1H4c-.7 0-1-.33-1-1V2c0-.55.42-1 1-1h8l5 5zM14 8h-3.13c-.51 0-.87-.34-.87-.87V4"
          stroke="currentColor"
          fill="none"
          fill-rule="evenodd"
          stroke-linejoin="round"
        ></path>
      </svg>
    </div>
    <div class="DocSearch-Hit-content-wrapper">
      <span class="DocSearch-Hit-symbol">{{ props.symbol }}</span>
      <span class="DocSearch-Hit-title">{{ props.name }}</span>
      <span class="DocSearch-Hit-currency">{{ props.currency }}</span>
    </div>
    <button class="DocSearch-Hit-button" type="button" @click="addSymbol">
      Select symbol
    </button>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useTradingMode } from "@/stores/TradingMode";

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },

  currency: {
    type: String,
  },
});
const tradingModeStore = useTradingMode();

const api_key = process.env.API_KEY;

async function addSymbol() {
  const existing = tradingModeStore.symbols.some(
    (item) => item.symbol === props.symbol
  );

  if (existing) {
    console.log("symbol has already been added");
    return;
  }

  try {
    const stockMonthlyPrice = await getDataFromAlphaVantage();
    const filteredData = reduceTheAmountOfMonthlyPricesData(
      stockMonthlyPrice["Monthly Time Series"]
    );

    const toWriteToFile = {
      company: props.name,
      symbol: props.symbol,
      monthlyTime: filteredData,
      lastUpdated: Date.now(),
    };

    tradingModeStore.symbols.unshift(toWriteToFile);
  } catch (err) {
    console.log(err);
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

function getDataFromAlphaVantage() {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${props.symbol}&apikey=${api_key}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(`Fetch error: ${error}`);
      return {};
    });
}
</script>

<style scoped>
.DocSearch-Hit-Container {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 56px;
  padding: 0 12px 0 0;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #ddd;
  color: #000;
}

.DocSearch-Hit-icon {
  height: 20px;
  width: 20px;
}

.DocSearch-Hit-content-wrapper {
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  font-weight: 500;
  justify-content: space-between;
  line-height: 1.2em;
  margin: 0 8px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.DocSearch-Hit-title,
.DocSearch-Hit-symbol,
.DocSearch-Hit-currency {
  color: #000;
}

.DocSearch-Hit-title {
  font-size: 1.2em;
}

.DocSearch-Hit-button {
  margin-left: auto;
  padding: 8px 12px;
  background: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 600;
  text-transform: uppercase;
}

.DocSearch-Hit-button:hover,
.DocSearch-Hit-button:focus {
  background: #e00000;
  outline: none;
}
</style>
