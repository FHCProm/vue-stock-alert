import { createApp } from "vue";
import App from "./App.vue";
// import devtools from "@vue/devtools";
import { createPinia } from "pinia";

if (process.env.NODE_ENV === "development") {
  // devtools.connect("http://localhost");
}

createApp(App).use(createPinia()).mount("#app");
