<template>
  <li
    v-for="(item, index) in props.searchResult"
    :key="item.name"
    class="DocSearch-Hit"
    id="docsearch-item-0"
    role="option"
    :aria-selected="index === selectedIndex"
    @click="selectedIndex = index"
  >
    <SingleResult
      :symbol="item.symbol"
      :name="item.name"
      :currency="item.currency"
    ></SingleResult>
  </li>
</template>

<script setup>
import { ref, defineProps } from "vue";

import SingleResult from "./SingleResult.vue";

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
}
.DocSearch-Hit[aria-selected="true"] a {
  background-color: #00aeff;
  color: white;
}
</style>
