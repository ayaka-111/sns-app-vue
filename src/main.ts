import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import { icon, library } from "@fortawesome/fontawesome-svg-core";
import {
  faLeaf,
  faHeart as fasHeart,
  faBookmark as fasBookmark,
  faEye,
  faEyeSlash,
  faEllipsis,
  faXmark,
  faHouse,
  faMagnifyingGlass,
  faBars,
  faGear,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as farHeart,
  faComment,
  faBookmark as farBookmark,
  faImages,
  faCircleCheck,
  faSquarePlus,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faLeaf,
  fasHeart,
  farHeart,
  faComment,
  fasBookmark,
  farBookmark,
  faImages,
  faEye,
  faEyeSlash,
  faEllipsis,
  faCircleCheck,
  faXmark,
  faSquarePlus,
  faHouse,
  faMagnifyingGlass,
  faBars,
  faGear,
  faTableCells
);

const app = createApp(App);

app.use(router);

app.mount("#app");

app.component("font-awesome-icon", FontAwesomeIcon);
