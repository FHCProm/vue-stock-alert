<template>
  <li
    v-for="(item, index) in props.searchResult"
    :key="item['1. symbol']"
    class="DocSearch-Hit"
    id="docsearch-item-0"
    role="option"
    :aria-selected="index === selectedIndex"
    @click="selectedIndex = index"
  >
    <SingleSearchResult
      :symbol="item['1. symbol']"
      :name="item['2. name']"
      :currency="item['8. currency']"
    ></SingleSearchResult>
  </li>
</template>

<script setup>
import { ref, defineProps } from "vue";

import SingleSearchResult from "./SingleSearchResult.vue";

const props = defineProps({
  searchResult: {
    type: Array,
    required: true,
  },
});

const selectedIndex = ref(0);
</script>

<style scoped>
.DocSearch-Hit {
  border-radius: 4px;
  display: flex;
  padding-bottom: 4px;
  position: relative;
  background: #ffffff;
  border: 1px solid #ddd;
  margin-bottom: 8px;
}

.DocSearch-Hit a {
  background: transparent;
  border-radius: 4px;
  text-decoration: none;
  display: block;
  padding-left: 12px;
  width: 100%;
  color: #000;
}

.DocSearch-Hit[aria-selected="true"] a {
  background-color: #ffe5e5;
  color: #000;
}
</style>
