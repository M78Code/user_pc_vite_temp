import { createApp } from "vue";
import { Quasar } from "quasar";
// import { createPinia } from 'pinia'
// const pinia = createPinia()

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
// Import Quasar css
import "quasar/src/css/index.sass";

// import BetBoxDialog from "../../src/components/test/bet-box-dialog.vue";

import * as ALL_COMPONENTS from "./components.js";

 

import init_domain from "src/global/domain.js";

let ALL_COMPONENTS_NAMES = Object.keys(ALL_COMPONENTS);
import EMITTER from "src/global/mitt.js";

import final_config_idc_online from "app/z-config/idc_online.js";
import final_config_idc_sandbox from "app/z-config/idc_sandbox.js";

let final_config = final_config_idc_sandbox;

const draw_component = (config) => {
  let { dom_id, component, props } = config;

  let component_module = ALL_COMPONENTS[component];

  if (!component_module) {
    window.alert("组件未注册");
    return false;
  }

  let instance = null;

  if (props) {
    instance = createApp(component_module, props);
  } else {
    instance = createApp(component_module);
  }
  instance.use(Quasar, {
    plugins: {},
  });
  instance.mount(dom_id);
};

function init_env() {
  window.env = final_config;
}
const SDK = {
  init_env,
 
  ALL_COMPONENTS_NAMES,
  draw_component,
  init_domain,
  EMITTER,
};
export default SDK;
