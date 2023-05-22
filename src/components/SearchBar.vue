<template>
  <div class="DocSearch-Modal">
    <div class="DocSearch-SearchBar">
      <form class="DocSearch-Form" @submit.prevent="handleSearch">
        <label
          class="DocSearch-MagnifierLabel"
          for="docsearch-input"
          id="docsearch-label"
        >
          <svg
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
            ></path>
          </svg>
        </label>
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
          type="text"
          aria-activedescendant="docsearch-item-0"
          aria-controls="docsearch-list"
          v-model="searchQuery"
        />
        <button
          type="submit"
          title="enter the query"
          class="DocSearch-Enter"
          aria-label="enter the query"
        >
          Enter
        </button>
        <button
          type="reset"
          title="Clear the query"
          class="DocSearch-Reset"
          aria-label="Clear the query"
          @click="changeSearchResultVisibility"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
              stroke="currentColor"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
      </form>
    </div>
    <div
      class="DocSearch-Dropdown"
      :style="{ display: searchResultVisibility }"
    >
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
        <ul
          role="listbox"
          aria-labelledby="docsearch-label"
          id="docsearch-list"
        >
          <SearchResultList :search-result="searchResult"></SearchResultList>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import SearchResultList from "./SearchResultList.vue";
import { ref } from "vue";

const searchQuery = ref("");
const searchResult = ref([]);
const searchResultVisibility = ref("none");

const storage = ref([
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
  {
    name: "Apple",
    symbol: "AAPL",
    currency: "USD",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    currency: "USD",
  },
]);

function handleSearch() {
  searchResultVisibility.value = "unset";
  let matches = [];

  for (const result of storage.value) {
    if (
      result.symbol.toUpperCase().startsWith(searchQuery.value.toUpperCase()) &&
      searchQuery.value !== ""
    ) {
      matches.push(result);
    }
  }

  searchResult.value = matches;
}

function changeSearchResultVisibility() {
  searchResultVisibility.value = "none";
}
</script>

<style scoped></style>
