import H5MenuTemplate1 from "../h5-menu-template-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";

const all_components_obj = {
  H5MenuTemplate1,
};
const component_config = {
  registered_component_key: "Menu",
  default_component_key: "PcMenuTemplate1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;

