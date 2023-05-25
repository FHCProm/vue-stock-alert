<template>
  <SearchBar></SearchBar>
  <SelectionBar></SelectionBar>
  <StockList></StockList>
</template>

<script setup>
import SearchBar from "./components/SearchBar.vue";
import StockList from "./components/StockList.vue";
import SelectionBar from "./components/SelectionBar.vue";
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
