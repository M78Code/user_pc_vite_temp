import DateTab from "../date-tab-template-1/index.vue";
import { compute_component_wapper_config } from "app/job/output/merchant/index.js";
const all_components_obj = {
  DateTab,
};
const component_config = {
  registered_component_key: "DateTab",
  default_component_key: "DateTab_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;
