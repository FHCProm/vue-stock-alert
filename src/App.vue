<template>
  <div class="DocSearch-SearchBar">
    <form class="DocSearch-Form">
      <label
        class="DocSearch-MagnifierLabel"
        for="docsearch-input"
        id="docsearch-label"
        ><svg
          width="20"
          height="20"
          class="DocSearch-Search-Icon"
          viewBox="0 0 20 20"
        >
          <path
            d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
            stroke="currentColor"
            fill="none"
            fill-rule="evenodd"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path></svg
      ></label>
      <div class="DocSearch-LoadingIndicator">
        <svg viewBox="0 0 38 38" stroke="currentColor" stroke-opacity=".5">
          <g fill="none" fill-rule="evenodd">
            <g transform="translate(1 1)" stroke-width="2">
              <circle stroke-opacity=".3" cx="18" cy="18" r="18"></circle>
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="1s"
                  repeatCount="indefinite"
                ></animateTransform>
              </path>
            </g>
          </g>
        </svg>
      </div>
      <input
        class="DocSearch-Input"
        aria-autocomplete="both"
        aria-labelledby="docsearch-label"
        id="docsearch-input"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        enterkeyhint="go"
        spellcheck="false"
        placeholder="Search stock symbol"
        maxlength="64"
        type="search"
        aria-activedescendant="docsearch-item-0"
        aria-controls="docsearch-list"
        v-model="searchQuery"
      />
    </form>
  </div>
  <div class="DocSearch-Dropdown">
    <div class="DocSearch-NoResults" v-if="searchResult.length == 0">
      <div class="DocSearch-Screen-Icon">
        <svg
          width="40"
          height="40"
          viewBox="0 0 20 20"
          fill="none"
          fill-rule="evenodd"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M15.5 4.8c2 3 1.7 7-1 9.7h0l4.3 4.3-4.3-4.3a7.8 7.8 0 01-9.8 1m-2.2-2.2A7.8 7.8 0 0113.2 2.4M2 18L18 2"
          ></path>
        </svg>
      </div>
      <p class="DocSearch-Title">
        No results for "<strong>{{ searchQuery }}</strong
        >"
      </p>
    </div>
    <section class="DocSearch-Hits">
      <ul role="listbox" aria-labelledby="docsearch-label" id="docsearch-list">
        <SearchResultList></SearchResultList>
      </ul>
    </section>
  </div>
</template>

<script setup>
import SearchResultList from "./components/SearchResultList.vue";
import { ref } from "vue";

const searchQuery = ref("");
const searchResult = ref([
  {
    name: "Tesla",
    symbol: "TSLA",
  },
]);
</script>

<style>
#app {
  color: white;
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
  border-radius: 50%;
  color: white;
  padding: 2px;
  right: 0;
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

.DocSearch-Hit a {
  background: #090a11;
  border-radius: 4px;
  text-decoration: none;
  display: block;
  padding-left: 12px;
  width: 100%;
  color: #7f8497;
}

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
  flex-direction: column;
  font-weight: 500;
  justify-content: center;
  line-height: 1.2em;
  margin: 0 8px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 80%;
}

.DocSearch-Hit-title {
  font-size: 1.5em;
}

.DocSearch-Hit-action {
  align-items: center;
  display: flex;
  height: 22px;
  width: 22px;
}
</style>
