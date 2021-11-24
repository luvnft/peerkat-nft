import { createApp, h, Fragment } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import store from "./store";
import { i18n } from "./i18n";
import VueAxe, { VueAxePopup } from "vue-axe";
import VueAnnouncer from "@vue-a11y/announcer";
import Notifications from "@kyvg/vue3-notification";
import {
  isAndroidWebView,
  isIosWebView,
  isWebView,
} from "./utils/isIosWebView";

if (process.env.NODE_ENV === "development") {
  createApp({
    render: () => h(Fragment, [h(App), h(VueAxePopup)]),
  })
    .use(VueAxe)
    .use(VueAnnouncer)
    .use(router)
    .use(store)
    .use(i18n)
    .use(Notifications)
    .mount("#app");
} else {
  createApp(App)
    .use(VueAnnouncer)
    .use(router)
    .use(store)
    .use(i18n)
    .use(Notifications)
    .mount("#app");
}

console.log("is in xumm", /xumm/.test(navigator.userAgent));
console.log("isWebView", isWebView());
console.log("isIosWebView", isIosWebView());
console.log("isAndroidWebView", isAndroidWebView());

const is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
  navigator.userAgent
);
console.log("is_uiwebview", is_uiwebview);

const hours = 1; // Reset when storage is more than 24hours
const now = new Date().getTime();
const setupTime = Number(localStorage.getItem("setupTime"));
if (setupTime == null) {
  localStorage.setItem("setupTime", now.toString());
} else {
  if (now - setupTime > hours * 60 * 60 * 1000) {
    localStorage.clear();
    localStorage.setItem("setupTime", now.toString());
  }
}
