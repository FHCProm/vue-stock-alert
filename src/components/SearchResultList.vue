<template>
  <li
    v-for="(item, index) in searchResult"
    :key="item.name"
    class="DocSearch-Hit"
    id="docsearch-item-0"
    role="option"
    :aria-selected="index === selectedIndex"
    @mouseover="highlighted = true"
    @mouseleave="highlighted = false"
    @click="selectedIndex = index"
  >
    <a href="#"
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
          <span class="DocSearch-Hit-symbol">{{ item.symbol }}</span>
          <span class="DocSearch-Hit-title">{{ item.name }}</span>
          <span class="DocSearch-Hit-currency">{{ item.currency }}</span>
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
  </li>
</template>

<script setup>
import { ref } from "vue";
const searchResult = ref([
  {
    name: "Tesla",
    symbol: "TSLA",
    currency: "USD",
  },
  {
    name: "Microsoft",
    symbol: "MSFT",
    currency: "USD",
  },
]);
const highlighted = ref(false);
const selectedIndex = ref(0);
</script>

<style lang="scss" scoped></style>
