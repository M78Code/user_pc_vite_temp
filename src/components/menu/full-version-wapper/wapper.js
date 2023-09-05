import PcMenuTemplate1 from "../pc-menu-template-1/index.vue";
import {sport_menu as H5MenuTemplate1} from "../h5-menu-template-1/index.js";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  PcMenuTemplate1,
  H5MenuTemplate1,
};
console.log("H5MenuTemplate1",H5MenuTemplate1)
const component_config = {
  registered_component_key: "Menu",
  default_component_key: "PcMenuTemplate1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;

