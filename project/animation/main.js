import { createApp } from 'vue'
import { Quasar } from "quasar";
import App from './App.vue'
import "./src/css/app.scss"
import router from 'project/animation/src/router/index.js'
import BUILDIN_CONFIG from "app/job/output/env/index.js";
console.log("BUILDIN_CONFIG-----------pc---", BUILDIN_CONFIG);

import _ from 'lodash';
// import { HackError } from './hack-error';
// import { i18n, loadLanguageAsync } from "./src/boot/i18n.js";
// import global from './src/boot/globals';

// new HackError();

// 兼容旧项目里面的 lodash
window._ = _;
const app = createApp(App);

window.vue = app;

// app.use(global);
// app.use(i18n);
app.use(router);
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});
app.mount('#ty-app')
