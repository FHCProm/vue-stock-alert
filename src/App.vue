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

.DocSearch-Modal {
  background: #15172a;
  border-radius: 6px;
  box-shadow: inset 1px 1px 0 0 #2c2e40, 0 3px 8px 0 #000309;
  flex-direction: column;
  margin: 20px auto auto;
  padding: 10px 0;

  position: relative;
}

.DocSearch-SearchBar {
  display: flex;
  padding: 12px 12px 0;
}

.DocSearch-Form {
  align-items: center;
  background: #000;
  border-radius: 4px;
  box-shadow: inset 0 0 0 2px #00aeff;
  display: flex;
  height: 56px;
  margin: 0;
  padding: 0 12px;
  position: relative;
  width: 100%;
}

.DocSearch-MagnifierLabel {
  align-items: center;
  color: #00aeff;
  display: flex;
  justify-content: center;
}

.DocSearch-LoadingIndicator {
  display: none;
}

.DocSearch-Input {
  appearance: none;
  background: #0000;
  border: 0;
  color: #f5f6f7;
  flex: 1;
  font-size: 1.2em;
  height: 100%;
  outline: 0;
  padding: 0 0 0 8px;
  width: 80%;
}

.DocSearch-Reset {
  animation: 0.1s ease-in forwards f;
  appearance: none;
  background: none;
  color: white;
  padding: 2px;
  border: none;
  right: 0;
}

.DocSearch-Reset:hover {
  color: #00aeff;
}

.DocSearch-Enter {
  border: 0.5px solid white;

  color: #f5f6f7;
  background-color: transparent;
  font-size: 15px;
  margin-right: 20px;
}

.DocSearch-Dropdown {
  max-height: 600px;
  min-height: 12px;

  overflow-y: overlay;
  padding: 0 12px;
}

.DocSearch-NoResults {
  font-size: 0.9em;
  margin: 0 auto;
  padding: 36px 0;
  text-align: center;
  width: 80%;
}

.DocSearch-Screen-Icon {
  color: #7f8497;
  padding-bottom: 12px;
}

.DocSearch-Title {
  font-size: 1.2em;
}

.DocSearch-Dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
