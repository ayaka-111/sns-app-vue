import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLeaf, faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faLeaf, solidHeart, faHeart);

const app = createApp(App);

app.use(router);

app.mount("#app");

app.component("fa", FontAwesomeIcon);
app.component("far", FontAwesomeIcon);
