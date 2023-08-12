import Menu_1 from "../menu-1/index.vue";
import Menu_h5 from "../menu-h5/index.vue";
import { compute_component_wapper_config } from "app/job/output/merchant/index.js";
const all_components_obj = {
  Menu_1,
  Menu_h5
};
const component_config = {
  registered_component_key: "Menu",
  default_component_key: "Menu_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;

