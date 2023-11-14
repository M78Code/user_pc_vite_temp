import { createApp } from 'vue'
import { Quasar } from "quasar";

import "./src/css/app.scss"
import './style.css'
import App from './App.vue'
import router from 'project/activity/src/router/index.js'
import 'project/activity/src/public/utils/window_env/window_env_default'
import _ from 'lodash';
import * as Vue from 'vue';

// 兼容旧项目里面的 lodash
window._ = _;
const app = createApp(App);

window.vue = app;

app.use(router);
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

app.mount('#ty-app')
