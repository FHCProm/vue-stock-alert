<template>
  <a
    href="#"
    @mouseover="highlighted = true"
    @mouseleave="highlighted = false"
    @keydown.enter.prevent="addSymbol"
    ><div class="DocSearch-Hit-Container">
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
      <div class="DocSearch-Hit-action" v-if="highlighted">
        <svg
          class="DocSearch-Hit-Select-Icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <g
            stroke="currentColor"
            fill="none"
            fill-rule="evenodd"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 3v4c0 2-2 4-4 4H2"></path>
            <path d="M8 17l-6-6 6-6"></path>
          </g>
        </svg>
      </div></div
  ></a>
</template>

<script setup>
import { defineProps, ref } from "vue";

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
  isHighligeted: {
    type: Boolean,
  },
});
const highlighted = ref(false);

import apiCredential from "@/storage/dataStatus.json";
const api_key = apiCredential["api_key"];

function addSymbol() {
  const fs = window.require("fs");
  const path = window.require("path");
  const folderPath = "./src/storage/symbols";
  const symbol = `${props.symbol}.json`;

  const filePath = path.join(folderPath, symbol);

  try {
    if (fs.existsSync(filePath)) {
      console.log("symbol has been added");
    } else {
      fs.writeFile(filePath, "", function (err) {
        if (err) throw err;
        console.log(`${filePath} created`);
        //getDataFromAlphaVantage();
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function getDataFromAlphaVantage() {
  var request = window.require("request");

  var url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${props.symbol}&apikey=${api_key}`;

  fetch(url, {
    headers: {
      "User-Agent": "request",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(`Fetch error: ${error}`);
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
  width: 80%;
}

.DocSearch-Hit-title {
  font-size: 1.2em;
}

.DocSearch-Hit-action {
  align-items: center;
  display: flex;
  height: 22px;
  width: 22px;
}
</style>
