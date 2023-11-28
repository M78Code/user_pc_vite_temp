import { createApp } from 'vue'
import { Quasar } from "quasar";
import "./src/css/app.scss"
import './style.css'
import App from './App.vue'
 
import _ from 'lodash';
import { HackError } from './hack-error';
import { i18n, loadLanguageAsync } from "./src/boot/i18n.js";
import global from './src/boot/globals';

new HackError();

// 兼容旧项目里面的 lodash
window._ = _;
const app = createApp(App);

window.vue = app;

app.use(global);
app.use(i18n);
 
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

app.mount('#ty-app')
