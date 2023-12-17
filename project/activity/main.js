import { createApp } from 'vue'
import { Quasar, Notify } from "quasar";
import "./src/css/app.scss";
import "quasar/dist/quasar.css";
// import './style.css'
import App from './App.vue'
 
import _ from 'lodash';
 
import { i18n, loadLanguageAsync, i18n_t } from "./src/boot/i18n.js";
import global from './src/boot/globals';


// 兼容旧项目里面的 lodash
window._ = _;
const app = createApp(App);

window.vue = app;

app.use(global);
app.use(i18n);
app.config.globalProperties.i18n_t = i18n_t;
window.i18n_t = i18n_t;
app.use(Quasar, {
  plugins: {
    Notify
  }, // import Quasar plugins and add here
});

app.mount('#ty-app')
