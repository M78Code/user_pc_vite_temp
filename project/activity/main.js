import { createApp } from 'vue'
import { Quasar, Notify } from "quasar";
import "./src/css/app.scss";
import "quasar/dist/quasar.css";
import lodash from "lodash";
// import './style.css'
import App from './App.vue'
 
import _ from 'lodash';
 
import { i18n, loadLanguageAsync, i18n_t, i18n_tc } from "./src/boot/i18n.js";
import global from './src/boot/globals';
import BUILDIN_CONFIG from "app/job/output/env/index.js";
import { main_js_common_fun } from "src/core/main-js-common-fun/index.js";
window.BUILDIN_CONFIG = BUILDIN_CONFIG;

// 兼容旧项目里面的 lodash
window._ = _;
const app = createApp(App);

window.vue = app;

app.use(global);
app.use(i18n);
window.lodash = lodash;
app.config.globalProperties.lodash = lodash;
app.config.globalProperties.i18n_t = i18n_t;
window.i18n_t = i18n_t;
app.config.globalProperties.i18n_tc = i18n_tc;
window.i18n_tc = i18n_tc;
app.use(Quasar, {
  plugins: {
    Notify
  }, // import Quasar plugins and add here
});
// app文件配置
main_js_common_fun(app);
app.mount('#ty-app')
