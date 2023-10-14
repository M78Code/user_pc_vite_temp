import FliterCheckbox from "../fliter-fheckbox-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  FliterCheckbox,
};
const component_config = {
  registered_component_key: "FliterCheckbox",
  default_component_key: "FliterCheckbox",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;
