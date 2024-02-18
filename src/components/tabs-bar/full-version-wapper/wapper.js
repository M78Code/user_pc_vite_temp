import tabs_bar_1 from "../tabs-bar-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  tabs_bar_1,
};
const component_config = {
  registered_component_key: "TabsBar",
  default_component_key: "tabs_bar_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;
